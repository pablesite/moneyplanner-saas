from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import FamilyMember, Ownership
from .serializers import FamilyMemberSerializer, OwnershipReadSerializer, OwnershipWriteSerializer
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
