from django.urls import include, path
from rest_framework.routers import DefaultRouter
from svapp.views import SentimentViewSet

router = DefaultRouter()
router.register(prefix=r"sentiments", viewset=SentimentViewSet)

urlpatterns = [
    path("", include(router.urls))
]
