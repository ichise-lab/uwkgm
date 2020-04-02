"""Dorest extension manager

This module consists of functions that mount dorest managers as extensions to Django apps.

The Dorest project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from functools import partial
from typing import Union
from types import ModuleType

from django.urls import include, path, re_path
from django.views.decorators.csrf import csrf_exempt

from . import AbstractManagers, struct
from dorest.libs.modules import get_module as _get_module


class Managers(AbstractManagers):
    STRUCTURED_ENDPOINTS = struct.rest


def forward(pattern: str, *, at: Union[str, ModuleType], to: Union[str, ModuleType], using: ModuleType) -> None:
    """Forwards an API request to a Dorest-based manager

    For example, suppose a Django project 'greet' has an app 'hello' and the 'urls.py' in the project's main app ('greet/greet/urls.py')
    contains the following lines:
    ---
        urlpatterns = [
            ...
            path('greet/hello/', include('greet.hello.extensions'))
            ...
        ]
    ---

    All requests starting with 'greet/hello/' would then be sent to the 'hello' app where they are forwarded to a Dorest manager.
    'greet/hello/extensions.py':
    ---
        from dorest.managers import rest
        rest.forward(r'.*', at=__name__, to='hello.endpoints', using=rest.Managers.STRUCTURED_ENDPOINTS)
    ---

    :param pattern: URL pattern according to Django URL handling specification
    :param at: The forwarding module
    :param to: The target module
    :param using: The type of Dorest manager used to manage the request
    :return: None
    """

    caller, target = _get_module(at), _get_module(to)
    setattr(caller, 'urlpatterns', getattr(caller, 'urlpatterns', []) + [re_path(pattern, csrf_exempt(partial(using.handle, root=target)))])


def extend(pattern: str, *, at: Union[str, ModuleType], to: Union[str, ModuleType]) -> None:
    """Extends 'urlpatterns' to handle requests other than those handled by Dorest managers

    The extended patterns are defined in a separate file indicated in the 'to' parameter.

    :param pattern: URL pattern according to Django URL handling specification
    :param at: The source module
    :param to: The extension module
    :return: None
    """

    caller = _get_module(at)
    setattr(caller, 'urlpatterns', getattr(caller, 'urlpatterns', []) + [path(pattern, include(to))])
