from django.db import IntegrityError
from rest_framework import viewsets
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework.permissions import IsAuthenticated

from .models import FamilyMember, Ownership
from .serializers import FamilyMemberSerializer, OwnershipReadSerializer, OwnershipWriteSerializer


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
        Ownership.objects.get_or_create(
            user=self.request.user,
            kind=Ownership.Kind.INDIVIDUAL,
            member=member,
        )

    def destroy(self, request, *args, **kwargs):
        member = self.get_object()

        if Ownership.objects.filter(user=request.user, kind=Ownership.Kind.SHARED, splits__member=member).exists():
            raise DRFValidationError(
                {"detail": "Este miembro aparece en una titularidad compartida. Elimina/ajusta esa titularidad antes."}
            )

        Ownership.objects.filter(user=request.user, kind=Ownership.Kind.INDIVIDUAL, member=member).delete()

        try:
            return super().destroy(request, *args, **kwargs)
        except IntegrityError:
            raise DRFValidationError({"detail": "No se puede eliminar este miembro porque esta en uso."})


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
        if instance.kind == Ownership.Kind.INDIVIDUAL:
            raise DRFValidationError({"detail": "La titularidad individual no se puede editar."})
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.kind == Ownership.Kind.INDIVIDUAL:
            raise DRFValidationError({"detail": "La titularidad individual no se puede eliminar."})
        return super().destroy(request, *args, **kwargs)
