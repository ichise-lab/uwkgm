from django.shortcuts import redirect

from rest_framework.request import Request
from rest_framework.response import Response

from uwkgm import url_prefix


def home_page(request: Request) -> Response:
    response = redirect('%s/admin/' % url_prefix)
    return response


def api_page(request: Request) -> Response:
    response = redirect('%s/admin/' % url_prefix.replace('api/', ''))
    return response
