from rest_framework.routers import DefaultRouter

from .views import FamilyMemberViewSet, OwnershipViewSet

router = DefaultRouter()
router.register(r"family-members", FamilyMemberViewSet, basename="family-member")
router.register(r"ownerships", OwnershipViewSet, basename="ownership")

urlpatterns = router.urls
