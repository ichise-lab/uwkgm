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

from dorest.decorators import require, operator_or as _or
from dorest.permissions import IsAccountOwner


class Basic(APIView):
    @require(_or(IsAdminUser, IsAccountOwner))
    def get(self, request: Request, username: str) -> Response:
        base = datetime.datetime.today()
        dates = [(base - datetime.timedelta(days=d)).strftime('%Y-%m-%d') for d in range(31)]
        requests = [randrange(10) + 10 for _ in range(31)]
        return Response([(dates[i], requests[i]) for i in range(31)])
