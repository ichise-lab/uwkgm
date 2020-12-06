"""Custom user model

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import os
from typing import Dict

from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models
from django.utils.crypto import get_random_string
from django.utils.translation import gettext_lazy as _

from rest_framework.authtoken.models import Token

from dorest.exceptions import ObjectNotFound


def gen_registration_code() -> str:
    if 'UWKGM_API_STATE' in os.environ and os.environ['UWKGM_API_STATE'] == 'running':
        while True:
            code = get_random_string(32)

            try:
                CustomUser.objects.get(registration_code=code)
            except ObjectNotFound:
                return code
    
    return ''


class CustomUserManager(UserManager):
    def create_user(self, username, email=None, password=None, **extra_fields):
        return super().create_user(username, email, password, **extra_fields)

    def get(self, *args, **kwargs):
        try:
            if 'pk' in kwargs:
                # In case the request was sent from Django admin login page
                try:
                    return super().get(*args, **kwargs)
                except ObjectDoesNotExist:
                    return None
            else:
                return super().get(*args, **kwargs)
        except ObjectDoesNotExist:
            raise ObjectNotFound(_('Account not found'))

    def get_by_natural_key(self, username: str) -> AbstractUser:
        if username is None:
            return super().get_by_natural_key(username)
        else:
            try:
                return super().get_by_natural_key(username)
            except ObjectDoesNotExist:
                raise ObjectNotFound(_('Account not found'))

    @staticmethod
    def gen_user_token(user: AbstractUser) -> Dict[str, str]:
        return {'token': Token.objects.get_or_create(user=user)[0].key}


class CustomUser(AbstractUser):
    """A subclass of Django's default User class

    According to Django documentation, it’s highly recommended to set up a custom user model when starting a project.
    Should future entire migration has to be made (e.g. changing a database backend),
    make sure that this subclass is included in the migration.

    To register this model on Django, set 'AUTH_USER_MODEL' in auth/settings.py to 'accounts.CustomUser'.

    For more information, visit:
    https://docs.djangoproject.com/en/2.2/topics/auth/customizing/
    """

    # Override: Email addresses must be unique
    email = models.EmailField(_('Email address'), blank=False, null=False, unique=True)

    # Override: A newly created user will not be active until the first successful email verification
    is_active = models.BooleanField(
        _('active'),
        default=False,
        help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        ),
    )

    registration_code = models.TextField(_('Registration code'), max_length=32, blank=True, null=True,
                                         default=gen_registration_code)
    registered = models.BooleanField(_('Registered'), default=False)

    # User identity verification determines scopes and permissions given to the user
    is_email_verified = models.BooleanField(_('Verified email'), default=False)

    objects = CustomUserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    @property
    def is_authenticated(self):
        return self.is_active or self.is_staff or self.is_superuser

    def gen_registration_code(self):
        code = gen_registration_code()
        self.registration_code = code
        self.save()
        return code
