"""CustomUser-related API descriptions

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from django.contrib.auth.models import Group, Permission

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from dorest.libs.django.decorators import permissions
from dorest.libs.django.decorators.permissions import operator_or as _or

from accounts.rest.serializers import accounts


class HelpViews:
    class Groups(APIView):
        @permissions.require(_or(IsAdminUser, 'auth.view_group'))
        def get(self, request: Request):
            return Response({'groups': accounts.GroupSerializer(Group.objects.all(), many=True).data}, status=status.HTTP_200_OK)

    class Permissions(APIView):
        @permissions.require(_or(IsAdminUser, 'auth.view_permission'))
        def get(self, request: Request):
            return Response({'permissions': accounts.PermissionSerializer(Permission.objects.all(), many=True).data}, status=status.HTTP_200_OK)

    # class Throttles(APIView):
    #    permission_classes = (IsAuthenticated, )

    #    def get(self, request: Request):
    #        return Response({'throttles': 'dummy'}, status=status.HTTP_200_OK)
