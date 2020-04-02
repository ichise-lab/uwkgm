"""Argument-validator decorator for Dorest-based endpoints

The Dorest project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from rest_framework.response import Response

from django.utils.translation import ugettext_lazy as _


def existence(**params):
    """Checks whether all required request parameters are included in an HTTP request to an APIView
    :param params: parameter 'fields' contains required request parameters
                   parameter 'strict_fields' are 'fields' that cannot be blank
    """

    def decorator(func):
        def wrapper(*args, **kwargs):
            """Receives HTTP request handler (function) of Django rest_framework's APIView class."""

            # Assign rest_framework.request.Request object to 'request' variable, which is to be validated
            request = args[1]

            missings = []
            blanks = []
            fields = params['fields'] if 'fields' in params else [] + params['strict_fields'] if 'strict_fields' in params else []
            strict_fields = params['strict_fields'] if 'strict_fields' in params else []

            for kwarg in fields:
                if kwarg not in request.data and kwarg not in request.GET:
                    missings.append(kwarg)

            for kwarg in strict_fields:
                if kwarg in request.data and len(request.data[kwarg]) == 0:
                    blanks.append(kwarg)

            if len(missings) > 0 or len(blanks):
                return Response({'detail': _('Parameters missing or containing blank value'),
                                 'missing': missings,
                                 'blank': blanks}, status=400)

            return func(*args, **kwargs)

        return wrapper

    return decorator
