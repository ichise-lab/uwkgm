"""CustomUser view set

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from rest_framework.request import Request
from rest_framework.response import Response

from dorest.libs.django.decorators import permissions
from dorest.libs.django.decorators.permissions import operator_or as _or
from dorest.libs.django.permissions import IsAccountManager, IsAccountOwner

from accounts.rest.activation import send_activation_code
from accounts.rest.models.accounts import CustomUser
from accounts.rest.serializers.accounts import CustomUserSerializer, CustomUserLimitedSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    lookup_field = 'username'

    @permissions.require(_or(IsAdminUser, IsAccountOwner, IsAccountManager))
    def retrieve(self, request: Request, *args, **kwargs) -> Response:
        self.serializer_class = CustomUserSerializer if request.user.is_staff else CustomUserLimitedSerializer
        return self._tokenize(super().retrieve(request, *args, **kwargs))

    @permissions.require(_or(IsAdminUser, IsAccountManager))
    def create(self, request: Request, *args, **kwargs) -> Response:
        user = super().create(request, *args, **kwargs)
        send_activation_code(CustomUser.objects.get_by_natural_key(user.data['email']))
        return self._tokenize(user)

    @permissions.require(_or(IsAdminUser, IsAccountOwner, IsAccountManager))
    def partial_update(self, request, *args, **kwargs):
        self.serializer_class = CustomUserSerializer if request.user.is_staff else CustomUserLimitedSerializer
        return self._tokenize(super().partial_update(request, *args, **kwargs))

    @permissions.require(_or(IsAdminUser, IsAccountManager))
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    @staticmethod
    def _tokenize(response: Response) -> Response:
        response.data = response.data   # {**CustomUser.objects.gen_user_token(CustomUser.objects.get_by_natural_key(response.data['email']))}
        return response
