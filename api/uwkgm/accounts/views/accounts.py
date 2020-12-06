"""CustomUser view set

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from django.core.exceptions import ValidationError

from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.request import Request
from rest_framework.response import Response

from dorest.decorators import require, operator_or as _or, mandate
from dorest.exceptions import ObjectNotFound
from dorest.permissions import IsAccountOwner

from accounts.activation import send_activation_code
from accounts.models.accounts import CustomUser
from accounts.serializers.accounts import CustomUserSerializer, CustomUserLimitedSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    lookup_field = 'username'

    @require(_or(IsAdminUser, IsAccountOwner))
    def retrieve(self, request: Request, *args, **kwargs) -> Response:
        self.serializer_class = CustomUserSerializer if request.user.is_staff else CustomUserLimitedSerializer
        return self._tokenize(super().retrieve(request, *args, **kwargs))

    @require(_or(IsAdminUser))
    def create(self, request: Request, *args, **kwargs) -> Response:
        try:
            user = super().create(request, *args, **kwargs)
            send_activation_code(CustomUser.objects.get_by_natural_key(user.data['email']))
            return self._tokenize(user)
        except ValidationError:
            return Response({'code': 'invalid_input'}, status=status.HTTP_400_BAD_REQUEST)

    @require(_or(IsAdminUser, IsAccountOwner))
    def partial_update(self, request, *args, **kwargs):
        try:
            self.serializer_class = CustomUserSerializer if request.user.is_staff else CustomUserLimitedSerializer
            return self._tokenize(super().partial_update(request, *args, **kwargs))
        except ValidationError:
            return Response({'code': 'invalid_input'}, status=status.HTTP_400_BAD_REQUEST)

    @require(_or(IsAdminUser))
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    @staticmethod
    def _tokenize(response: Response) -> Response:
        # response.data = {**CustomUser.objects.gen_user_token(
        # CustomUser.objects.get_by_natural_key(response.data['email']))}
        return response


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
@mandate(strict_fields=['email'])
def gen_registration_code(request: Request) -> Response:
    """Generate registration code for a previously created account.
    Used when the admin want to create an account and let the account owner sets its password later using the code.
    """

    user = CustomUser.objects.get_by_natural_key(request.data['email'])
    return Response({'code': user.gen_registration_code()})


@api_view(['PATCH'])
@permission_classes([AllowAny])
@mandate(strict_fields=['code'])
def apply_registration_code(request: Request) -> Response:
    """Get username and email for registration"""

    try:
        user = CustomUser.objects.get(registration_code=request.data['code'])
        return Response({'username': user.username, 'email': user.email})
    except ObjectNotFound:
        return Response({'code': 'invalid_code'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['PATCH'])
@permission_classes([AllowAny])
@mandate(strict_fields=['code', 'password'])
def register(request: Request, username: str) -> Response:
    """Register an existing account using a registration code"""

    user = CustomUser.objects.get(username=username)

    if user.registration_code == request.data['code']:
        if user.registered:
            return Response({'code': 'account_already_registered'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            user.set_password(request.data['password'])
            user.registered = True
            user.save()
            return Response({})
    else:
        return Response({'code': 'invalid_code'}, status=status.HTTP_401_UNAUTHORIZED)
