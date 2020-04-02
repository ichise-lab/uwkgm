"""JWT custom classes

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from accounts.models import CustomUser


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Adds additional payload to a JWT token for the platform's user interface"""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['isAdmin'] = CustomUser.objects.get_by_natural_key(user).is_superuser
        return token


class CustomObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
