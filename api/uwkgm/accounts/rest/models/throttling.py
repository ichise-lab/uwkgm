"""Custom throttling models

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import uuid
from typing import List, Tuple

from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.utils.translation import gettext_lazy as _

from dorest import configs
from dorest.libs.django.exceptions import ObjectNotFound

from .accounts import CustomUser


def _get_rate_limit_choices() -> List[Tuple[str, str]]:
    choices = list()

    if hasattr(settings, 'REST_FRAMEWORK'):
        throttle_rates = settings.REST_FRAMEWORK.get('DEFAULT_THROTTLE_RATES', None)

        if throttle_rates is not None:
            choices = [(key, '%s @ %s' % (key, value.replace('/', ' requests/'))) for key, value in throttle_rates.items()]

    return choices


def _get_api_choices() -> List[Tuple[str, str]]:
    return [(api['name'], api['title']) for api in configs.resolve('auth.apis')]


class ThrottleModelManager(models.Manager):
    def get(self, *args, **kwargs):
        try:
            return super().get(*args, **kwargs)
        except ObjectDoesNotExist:
            raise ObjectNotFound


class ThrottleBurstRequest(models.Model):
    """By default, each user can make limited requests in each time frame.
    Global rate limits are set specifically for each API.

    To increase a rate limit for specific user, the user must first make a burst request.
    A user may make multiple burst requests. A burst permit with the highest limit precedes other permits."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    api_choices = _get_api_choices()
    reate_limit_choices = _get_rate_limit_choices()

    api = models.CharField(_('API'), max_length=32, choices=api_choices, blank=False, null=False, default=api_choices[0][0])
    name = models.CharField(_('Rate limit'), max_length=32, choices=reate_limit_choices, blank=False, null=False, default=reate_limit_choices[0][0])
    user = models.ForeignKey(CustomUser, related_name='throttle_request_user', on_delete=models.CASCADE)

    # Set 'limit' to zero to allow unlimited number of requests
    limit = models.IntegerField(_('Request limit'), default=0)
    duration = models.IntegerField(_('Limit duration'), choices=[(60, 'min'), (3600, 'hour'), (86400, 'day')], default=60)

    message = models.CharField(_('Message'), max_length=1024, blank=True, null=True)

    # The system will not check for start or expiration date/time if they are set to blank or null.
    start = models.DateTimeField(_('Permit start'), blank=True, null=True)
    expire = models.DateTimeField(_('Permit expiration'), blank=True, null=True)

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    objects = ThrottleModelManager()

    def __str__(self):
        return '%s:%s' % (self.user, self.name)


class ThrottleBurstPermit(models.Model):
    """Throttle burst permit override default rate limits defined in throttle tags. Only staffs can grant a burst permit.
    A burst permit may be granted without a request."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    api_choices = _get_api_choices()
    rate_limit_choices = _get_rate_limit_choices()

    api = models.CharField(_('API'), max_length=32, choices=api_choices, blank=False, null=False, default=api_choices[0][0])
    name = models.CharField(_('Rate limit'), max_length=32, choices=rate_limit_choices, blank=False, null=False, default=rate_limit_choices[0][0])
    user = models.ForeignKey(CustomUser, related_name='throttle_permit_user', on_delete=models.CASCADE)

    # Set 'limit' to zero to allow unlimited number of requests
    limit = models.IntegerField(_('Request limit'), default=0)
    duration = models.IntegerField(_('Limit duration'), choices=[(60, 'min'), (3600, 'hour'), (86400, 'day')], default=60)

    # The system will not check for start or expiration date/time if they are set to blank or null.
    start = models.DateTimeField(_('Permit start'), blank=True, null=True)
    expire = models.DateTimeField(_('Permit expiration'), blank=True, null=True)

    granter = models.ForeignKey(CustomUser, related_name='throttle_granter', on_delete=models.SET_NULL, null=True,
                                limit_choices_to=models.Q(is_staff=True))
    request = models.OneToOneField(ThrottleBurstRequest, related_name='throttle_burst_request', on_delete=models.SET_NULL, blank=True, null=True)

    message = models.CharField(_('Message'), max_length=1024, blank=True, null=True)

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    objects = ThrottleModelManager()

    def __str__(self):
        return '%s:%s' % (self.user, self.name)
