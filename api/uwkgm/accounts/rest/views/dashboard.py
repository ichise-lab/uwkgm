"""UI's dashboard data provider

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import datetime
from random import randrange

from rest_framework.permissions import IsAdminUser
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from dorest.libs.django.decorators import permissions
from dorest.libs.django.decorators.permissions import operator_or as _or
from dorest.libs.django.permissions import IsAccountManager, IsAccountOwner


class UsageStat(APIView):
    @permissions.require(_or(IsAdminUser, IsAccountOwner, IsAccountManager))
    def get(self, request: Request, username: str) -> Response:
        base = datetime.datetime.today()
        dates = [(base - datetime.timedelta(days=d)).strftime('%Y-%m-%d') for d in range(31)]
        requests = [randrange(10) + 10 for _ in range(31)]
        return Response([(dates[i], requests[i]) for i in range(31)])
