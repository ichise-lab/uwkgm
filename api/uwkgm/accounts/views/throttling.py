"""Throttling endpoints

Utilize Django REST Framework's ViewSets to process throttling-related requests, including listing, viewing, editing, and deleting

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from dorest.decorators import require, operator_or as _or
from dorest.permissions import IsAccountOwner

from accounts.models import ThrottleBurstPermit, ThrottleBurstRequest
from accounts.serializers import throttling


class BurstRequestViewSet(viewsets.ModelViewSet):
    queryset = ThrottleBurstRequest.objects.all()
    serializer_class = throttling.BurstRequestSerializer

    def get_object(self):
        """Non-standard queryset lookup"""
        obj = ThrottleBurstRequest.objects.get(id=self.kwargs['id'])

        # May raise a permission denied
        self.check_object_permissions(self.request, obj)

        return obj

    @require(_or(IsAdminUser, IsAccountOwner))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @require(_or(IsAdminUser, IsAccountOwner))
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @require(_or(IsAdminUser, IsAccountOwner))
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @require(_or(IsAdminUser, IsAccountOwner))
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @require(_or(IsAdminUser, IsAccountOwner))
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class BurstPermitViewSet(viewsets.ModelViewSet):
    queryset = ThrottleBurstPermit.objects.all()
    serializer_class = throttling.BurstPermitSerializer

    def get_object(self):
        """Non-standard queryset lookup"""
        obj = ThrottleBurstPermit.objects.get(id=self.kwargs['id'])

        # May raise permission denied
        self.check_object_permissions(self.request, obj)

        return obj

    @require(_or(IsAdminUser, IsAccountOwner))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @require(_or(IsAdminUser))
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @require(_or(IsAdminUser, IsAccountOwner))
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @require(_or(IsAdminUser))
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @require(_or(IsAdminUser))
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
