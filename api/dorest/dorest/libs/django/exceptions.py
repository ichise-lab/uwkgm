"""Dorest-specific exceptions

The Dorest project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from django.utils.translation import gettext_lazy as _

from rest_framework import status
from rest_framework.exceptions import APIException


class ObjectNotFound(APIException):
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = _('Object not found')
    default_code = 'object_not_found'
