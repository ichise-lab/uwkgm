"""'CustomUser's passwords

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from smtplib import SMTPException

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.auth.forms import PasswordResetForm
from django.utils.http import urlsafe_base64_decode
from django.utils.translation import ugettext_lazy as _

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from dorest import conf
from dorest.decorators import require, operator_or as _or, mandate

from accounts.models import CustomUser
from accounts.serializers import accounts


class PasswordView:
    class Reset(APIView):
        permission_classes = (IsAuthenticated,)

        @require(_or(IsAdminUser))
        @mandate(strict_fields=['email'])
        def get(self, request: Request) -> Response:
            """
            Email a one-time use link to reset a password

            Required request parameter: 'email'
            """

            form = PasswordResetForm(request.GET)

            if form.is_valid():
                try:
                    sender = conf.resolve('accounts.registration.email')
                    form.clean()
                    form.save(from_email=sender, request=request)
                    return Response({'detail': _('Password-reset link sent')}, status=status.HTTP_200_OK)

                except SMTPException as error:
                    return Response({'detail': _('An error occurred while sending the password-reset link.'),
                                     'error': error}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                return Response({'detail': _('Invalid email'),
                                 'errors': form.errors}, status=status.HTTP_400_BAD_REQUEST)

        @require(_or(IsAdminUser))
        @mandate(strict_fields=['new_password'])
        def patch(self, request: Request, uidb64: str, token: str) -> Response:
            """
            Verify a one-time use password-reset link and set a new password

            Required request parameter: 'new_password'
            """

            u = CustomUser.objects.get(id=urlsafe_base64_decode(uidb64))
            pg = PasswordResetTokenGenerator()

            if pg.check_token(u, token):
                us = accounts.CustomUserSerializer(u, data={'username': u.username, 'email': u.email, 'password': request.data['new_password']})

                if us.is_valid(raise_exception=True):
                    us.save()

                return Response({'detail': _('Password updated')}, status=status.HTTP_200_OK)
            else:
                return Response({'detail': _('Invalid token')}, status=status.HTTP_400_BAD_REQUEST)
