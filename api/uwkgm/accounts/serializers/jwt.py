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
        token['username'] = CustomUser.objects.get_by_natural_key(user).username
        token['isAdmin'] = CustomUser.objects.get_by_natural_key(user).is_superuser
        token['groups'] = ','.join([group.name for group in CustomUser.objects.get_by_natural_key(user).groups.all()])
        return token


class CustomObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
