"""Account activation

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from smtplib import SMTPException

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.template import Template, Context

from rest_framework.exceptions import APIException

from dorest import configs

from accounts.models import CustomUser


def send_activation_code(user: CustomUser) -> None:
    with open(configs.resolve('accounts.registration.activation.template'), 'r', encoding='utf-8') as file:
        template = Template(file.read())

    try:
        send_mail(configs.resolve('accounts.registration.activation.subject'),
                  template.render(Context({'api': 'UWKGM',
                                           'code': PasswordResetTokenGenerator().make_token(user),
                                           'user': user.get_full_name()})),
                  '%s' % configs.resolve('accounts.registration.email'),
                  [user.email])
    except SMTPException as error:
        raise APIException(_('An error occurred while sending an activation code: %s' % str(error)))


def validate_activation_code(user: CustomUser, code: str) -> bool:
    if PasswordResetTokenGenerator().check_token(user, code):
        user.is_active = True
        user.is_email_verified = True
        user.save()
        return True
    else:
        return False


def deactivate(user: CustomUser) -> None:
    usr = CustomUser.objects.get_by_natural_key(user.username)
    usr.is_active = False
    usr.save()
