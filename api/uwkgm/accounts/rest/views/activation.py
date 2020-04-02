"""CustomUser activation views

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from django.utils.translation import ugettext_lazy as _

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAdminUser

from dorest.libs.django.decorators import validation, permissions
from dorest.libs.django.decorators.permissions import operator_or as _or
from dorest.libs.django.permissions import IsAccountOwner, IsAccountManager

from accounts.models import CustomUser
from accounts.rest.activation import deactivate, send_activation_code, validate_activation_code


class ActivationViews:
    class Activate(APIView):
        permission_classes = [AllowAny]

        def get(self, request: Request, username: str) -> Response:
            send_activation_code(CustomUser.objects.get_by_natural_key(username))
            return Response({'detail': _('Activation code sent')}, status=status.HTTP_200_OK)

        @validation.arguments.existence(strict_fields=['code'])
        def patch(self, request: Request, username: str) -> Response:
            """Validate an activation code and set the user active if the code is valid

            Required request parameter:
            'code': Activation code
            """
            if validate_activation_code(CustomUser.objects.get_by_natural_key(username), request.data['code']):
                return Response({'detail': _('Account activated')}, status=status.HTTP_200_OK)
            else:
                return Response({'detail': _('Invalid activation code')}, status=status.HTTP_400_BAD_REQUEST)

    class Deactivate(APIView):
        @permissions.require(_or(IsAdminUser, IsAccountOwner, IsAccountManager))
        def patch(self, request: Request, username: str) -> Response:
            deactivate(CustomUser.objects.get_by_natural_key(username))
            return Response({'detail': _('Account deactivated')}, status=status.HTTP_200_OK)
