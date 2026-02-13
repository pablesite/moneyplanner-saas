from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import FamilyMember, Ownership, OwnershipLink
from .serializers import (
    FamilyMemberSerializer,
    OwnershipLinkReadSerializer,
    OwnershipLinkSyncSerializer,
    OwnershipReadSerializer,
    OwnershipWriteSerializer,
)
from .services import (
    assert_member_can_be_deleted,
    assert_ownership_can_be_deleted,
    assert_ownership_can_be_updated,
    ensure_individual_ownership_for_member,
)


class UserScopedQuerySetMixin:
    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(user=self.request.user)


class FamilyMemberViewSet(UserScopedQuerySetMixin, viewsets.ModelViewSet):
    serializer_class = FamilyMemberSerializer
    permission_classes = [IsAuthenticated]
    queryset = FamilyMember.objects.all()

    def perform_create(self, serializer):
        member = serializer.save(user=self.request.user)
        ensure_individual_ownership_for_member(user=self.request.user, member=member)

    def destroy(self, request, *args, **kwargs):
        member = self.get_object()
        assert_member_can_be_deleted(member)
        Ownership.objects.filter(user=request.user, kind=Ownership.Kind.INDIVIDUAL, member=member).delete()
        return super().destroy(request, *args, **kwargs)


class OwnershipViewSet(UserScopedQuerySetMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Ownership.objects.all()

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.select_related("member").prefetch_related("splits", "splits__member")

    def get_serializer_class(self):
        if self.action in ("list", "retrieve"):
            return OwnershipReadSerializer
        return OwnershipWriteSerializer

    def perform_update(self, serializer):
        instance = self.get_object()
        assert_ownership_can_be_updated(instance)
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        assert_ownership_can_be_deleted(instance)
        return super().destroy(request, *args, **kwargs)


class OwnershipLinkViewSet(UserScopedQuerySetMixin, viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]
    queryset = OwnershipLink.objects.all()

    def list(self, request):
        qs = self.get_queryset().select_related("ownership")
        serializer = OwnershipLinkReadSerializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["post"], url_path="sync")
    def sync(self, request):
        serializer = OwnershipLinkSyncSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        target_type = serializer.validated_data["target_type"]
        target_id = serializer.validated_data["target_id"]
        ownership = serializer.validated_data.get("ownership")

        if ownership is None:
            OwnershipLink.objects.filter(
                user=request.user,
                target_type=target_type,
                target_id=target_id,
            ).delete()
            return Response({"ok": True, "ownership_id": None}, status=status.HTTP_200_OK)

        link, _created = OwnershipLink.objects.update_or_create(
            user=request.user,
            target_type=target_type,
            target_id=target_id,
            defaults={"ownership": ownership},
        )
        return Response({"ok": True, "ownership_id": link.ownership_id}, status=status.HTTP_200_OK)
