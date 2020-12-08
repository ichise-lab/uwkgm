"""Implementations of additional UWKGM permission validators

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from rest_framework.permissions import BasePermission


class IsAccountManager(BasePermission):
    """Validate whether the account sending the request has the permission to manage other accounts"""

    def has_permission(self, request, view):
        return len(request.user.groups.filter(name='user_manager')) > 0


class IsRegularUser(BasePermission):
    """Validate whether the account is a regular user"""

    def has_permission(self, request, view):
        return len(request.user.groups.filter(name='user_regular')) > 0


class IsDemoUser(BasePermission):
    """Validate whether the account is for demonstration"""

    def has_permission(self, request, view):
        return len(request.user.groups.filter(name='user_demo')) > 0


class IsTrustedUser(BasePermission):
    """Validate whether the account is trusted"""

    def has_permission(self, request, view):
        return len(request.user.groups.filter(name='user_trusted')) > 0
