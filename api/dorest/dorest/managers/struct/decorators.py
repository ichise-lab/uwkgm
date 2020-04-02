"""Endpoint decorators

The Dorest project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import importlib
from functools import wraps
from typing import Any, Callable, List

from django.conf import settings

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response

from .glossary import Glossary


def endpoint(methods: List[str], default: bool = False, throttle: str = 'base', include_request: str = None) -> Callable[..., Any]:
    """Intercepts requests and transform into function calls with arguments

    :param methods: HTTP request method
    :param default: Set as module's default endpoint in case no specific function or class name is specified in the request
    :param throttle: Throttle type
    :param include_request: Include 'request' parameter in the function call
    :return: An output of the function as Django REST Framework's Response object,
             or the target function if called directly (not as an endpoint)
    """

    endpoint.meta = locals()

    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        @wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            if len(args) == 1 and isinstance(args[0], Request):
                try:
                    request = args[0]

                    # Extract request's body from requests using methods other than GET
                    body = {key: value for key, value in request.data.items()}
                    parameters = request.META[Glossary.META_ENDPOINT.value].parse(**{**dict(request.GET), **body})

                    if include_request is not None:
                        parameters[include_request] = request

                    # A request is handled differently based on how the endpoint is defined (as a class or a function)
                    if Glossary.META_CLASS.value in request.META and request.META[Glossary.META_CLASS.value] is not None:
                        return Response({'data': func(request.META[Glossary.META_CLASS.value][1], **parameters)}, status=status.HTTP_200_OK)
                    else:
                        return Response({'data': func(**parameters)}, status=status.HTTP_200_OK)

                except TypeError as error:
                    return Response({'detail': str(error)}, status=status.HTTP_400_BAD_REQUEST)

            else:
                return func(*args, **kwargs)

        if hasattr(settings, 'DOREST'):
            throttle_class = settings.DOREST.get('DEFAULT_THROTTLE_CLASSES', None)

            if throttle_class is not None and len(throttle_class) > 0:
                throttle_class_branch = [node.split('.') for node in throttle_class]
                wrapper.throttle_classes = [getattr(importlib.import_module('.'.join(node[:-1])), node[-1]) for node in throttle_class_branch]

        wrapper.meta = endpoint.meta

        return wrapper
    return decorator
