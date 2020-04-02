"""REST communication handler

The Dorest project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import importlib
import inspect
import re
from typing import Any, Callable, List, Tuple, Type, Union
from types import ModuleType

from django.conf import settings
from django.core.handlers.wsgi import WSGIRequest
from django.urls import resolve

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .glossary import Glossary
from .walk import walk
from dorest.managers.struct import describe
from dorest.libs.modules import get_module as _get_module


def _get_endpoint(method: str, branch: str, module: ModuleType = None) -> Tuple[Callable[..., Any], Union[Type, None]]:
    """Resolves the target endpoint from an API request

    A branch, within tree-structure packages, may either include a module or an endpoint function as a leaf.

    This function first assumes that the branch only include hierarchical packages as its nodes and the target module as its leaf.
    In the 'try' clause, the function will try to look for any default endpoints that matches the request method;
    if not found, it will try to find redirect operators that matches the request method, then look for the endpoint within the redirected module.

    If the branch contains an endpoint function as a leaf, the 'importlib.import_module' will fail to import and skip to the 'except' clause.

    :param method: An endpoint may accept multiple HTTP methods, the 'method' parameter specifies which method to be looking for
    :param branch: A string that indicates a branch containing packages as nodes and a module, function, or class as a leaf (e.g. 'pkg_a.pkg_b.leaf')
    :param module: A direct reference to the module which contains the endpoint. If set, the function will skip 'importlib.import_module'
    :return: A tuple containing the target endpoint function and, if applicable, its class (current version only support endpoint functions)
    """

    try:
        imported_module, endpoint_function = importlib.import_module(branch), None

        for func in [obj for obj in [getattr(imported_module, attr) for attr in dir(imported_module)]
                     if hasattr(obj, 'meta') and obj.__module__ == imported_module.__name__]:
            if func.meta['default']:
                return func, None
            endpoint_function = func

        if endpoint_function is not None:
            return endpoint_function, None

        else:
            obj = getattr(imported_module, Glossary.REDIRECT.value)[method.lower()]

            if inspect.isfunction(obj):
                return obj, None
            else:
                return _get_endpoint(method, getattr(imported_module, Glossary.REDIRECT.value)[method.lower()].__name__)

    except ModuleNotFoundError:
        path = branch.split('.')
        target_function = path[-1]
        imported_module = importlib.import_module('.'.join(path[:-1])) if module is None else module
        obj = getattr(imported_module, target_function, None)

        if inspect.isfunction(obj) and hasattr(obj, 'meta'):
            if method in obj.meta['methods']:
                return obj, None
            else:
                raise MethodNotAllowed(method)

        else:
            raise AttributeError("Could not find endpoint '%s' with HTTP request method '%s' in '%s'" % (target_function, method, module))


@api_view(['DELETE', 'GET', 'PATCH', 'POST', 'PUT'])
@permission_classes([AllowAny])
def _reply(request: WSGIRequest, topic: str, message: Union[dict, str], status: int) -> Response:
    """Creates Django REST Framework's Response object from a text message

    :param request: A request sent from Django REST Framework (despite not being used, this parameter is mandatory)
    :param topic: The topic of the message
    :param message: The message
    :param status: HTTP status code
    :return: Django REST Framework's Response object
    """

    return Response({topic: message}, status=status)


def handle(request: WSGIRequest, root: Union[str, ModuleType]) -> Response:
    """Handles a redirected request from Django REST Framework, calls the target endpoint and gets the result, then creates a wrapped response

    This function also provides special responses, which are either an API structure or a detailed description of specific endpoint function.
    To get an API structure, append '?**' after a parent endpoint.

    For example, suppose an API is structured as followed:
    ~~~~~~~~~~~~~~~~~~~~~~~
        + parent_pkg
        | + pkg_a
        | |- module_a.py
        | |- module_b.py
        | + pkg_b
        | | + pkg_c
        | | |- module_c.py
    ~~~~~~~~~~~~~~~~~~~~~~~
    and the root of the structured endpoints is 'http://domain/api/parent_pkg', which points to the 'parent_pkg' package,
    a GET request with URI 'http://domain/api/parent_pkg?**' will return the description of the 'parent_pkg' package, including its
    subpackages, modules, and endpoint functions. 'http://domain/api/parent_pkg/pkg_a?**' will return only those within the 'pkg_a' package.

    In case the structural organization of an API results in some packages containing only one subpackage or module (other than the package's
    __init__.py), appending the 'reduce' key to the request URI will merge all sequences of these packages. In the above example,
    'http://domain/api/parent_pkg?**&reduce' will return the API structure with 'pkg_b/pkg_c/module_c' keyword.

    To get a description of a particular endpoint function, append '?*' to the URI, e.g., 'http://domain/api/parent_pkg/pkg_a/module_a/func?*'

    :param request: A request sent from Django REST Framework
    :param root: The root package of the structured endpoints
    :return: Django REST Framework's Response object
    """

    # 'request.GET' is a QueryDict. When appending '?**' to the URI, '**' becomes a dictionary key
    if '**' in request.GET:
        route = re.sub(r'\.\*$', '', resolve(request.path_info).route)
        branch = ('%s.%s' % (root if isinstance(root, str) else root.__name__, re.sub(r'^/%s' % route, '', request.path).replace('/', '.'))).strip('.')
        return _reply(request, 'api', walk(branch, 'reduce' in request.GET), status.HTTP_200_OK)

    else:
        route = re.sub(r'\.\*$', '', resolve(request.path_info).route)
        branch = '%s.%s' % (root if isinstance(root, str) else root.__name__, re.sub(r'^/%s' % route, '', request.path).replace('/', '.'))

        # Given the request URI and method, try to find the target endpoint
        try:
            endpoint, request.META[Glossary.META_CLASS.value] = _get_endpoint(request.method, branch, root if isinstance(root, str) else None)
            request.META[Glossary.META_ENDPOINT.value] = describe.Endpoint(endpoint)
        except MethodNotAllowed as error:
            return _reply(request, 'detail', error.detail, status.HTTP_403_FORBIDDEN)
        except AttributeError as error:
            return _reply(request, 'detail', str(error), status.HTTP_403_FORBIDDEN)

        if '*' in request.GET:
            return _reply(request, 'help', request.META[Glossary.META_ENDPOINT.value].rest(brief='brief' in request.GET), status.HTTP_200_OK)
        else:
            view = api_view([request.method])(endpoint)

            if hasattr(settings, 'REST_FRAMEWORK'):
                throttle_rates = settings.REST_FRAMEWORK.get('DEFAULT_THROTTLE_RATES', None)

                if throttle_rates is not None and getattr(endpoint, 'meta')['throttle'] in throttle_rates:
                    view.view_class.throttle_custom_scope = getattr(endpoint, 'meta')['throttle']

            return view(request)


def redirect(*, methods: List[str], at: Union[str, ModuleType], to: [str, ModuleType]) -> None:
    """Redirects an API request to the target module containing endpoints

    To redirect an API request, call this function in the redirecting module
    Since the call is in the redirecting module, the 'at' parameter should normally be '__name__', e.g.:
    ---
        redirect(methods=['GET'], at=__name__, to='api.target.func')
    ---

    This function sets the redirect attribute of the module in which it is called.
    The attribute will later be evaluated and acted upon by the 'handle' function as it processes API requests.

    :param methods: HTTP methods that this redirect rule applies
    :param at: The redirecting module
    :param to: The target module
    :return: None
    """

    caller, target = _get_module(at), _get_module(to)
    [setattr(caller, Glossary.REDIRECT.value, {**getattr(caller, Glossary.REDIRECT.value, {}), **{method.lower(): target}}) for method in methods]
