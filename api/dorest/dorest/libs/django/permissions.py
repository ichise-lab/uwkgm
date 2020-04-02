"""Implementations of additional Django REST Framework permission validators

The Dorest project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from django.core.exceptions import ObjectDoesNotExist

from rest_framework.permissions import BasePermission


class IsAccountOwner(BasePermission):
    """Validates whether the target account in the request URL is owned by the user sending the request"""

    def has_permission(self, request, view, **kwargs):
        try:
            return kwargs['username'] == request.user.username
        except ObjectDoesNotExist:
            return False


class IsAccountManager(BasePermission):
    """Validates whether the account sending the request has the permission to manage other accounts"""

    def has_permission(self, request, view):
        return len(request.user.groups.filter(name='system_user_manager')) > 0
