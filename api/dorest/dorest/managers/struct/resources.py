"""Structured API endpoints resource manager

This manager associates structured API endpoints with their resources, which must also be structured according to the API structure.

For example, suppose there is a function 'bar' in a module 'foo', which is located in 'api_root_pkg.subpkg' (the actual path would be
'.../api_root_pkg/subpkg/foo.py').

Function 'bar' needs to access an input file 'input.txt'. To use this resource manager, the 'input.txt' must be stored as
'.../res_root/subpkg/foo/bar/input.txt', with '.../res_root' registered as the root directory of the structured API endpoints.

Once 'input.txt' is stored in the directory, calling 'resolve' with 'bar' and 'input.txt' as its parameters will return the path to the file:
---
    def bar(...):
        with open(resources.resolve(bar, 'input.txt), 'r') as file:
            ...
---

The Dorest project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import importlib
import os
import sys
from typing import Union
from types import ModuleType

from dorest.libs.modules import get_module as _get_module


def register(package: Union[str, ModuleType], *, to: Union[str, ModuleType]) -> None:
    """Registers a root resource directory to structured API endpoints

    In general, this function should be called in '__init__.py' of the root package of the structured API endpoints.
    The functions will then add '__resources' attribute to the module for the 'resolve' function to use as reference.

    :param package: The root package of the designated resources in Python's import format
    :param to: The root package of the structured API endpoints
    :return: None
    """

    setattr(_get_module(to), '__resources', _get_module(package))


def resolve(obj: Union[callable, str, ModuleType], path: str = None) -> str:
    """Resolves the path where resources corresponding to the given function or module are stored

    :param obj: The caller function or module
    :param path: A sub-path to the target resource (usually filename) within the resolved path
    :return: A path to the target resource
    """

    if callable(obj):
        tr = '%s.%s' % (obj.__module__, obj.__name__)
    else:
        tr = getattr(sys.modules, obj, importlib.import_module(obj)).__name__ if isinstance(obj, str) else obj.__name__

    ts = tr.split('.')
    s, ms = None, None

    # Find a reference to the root path of the resources registered using the 'register' function
    # starting from the highest-level package of the 'obj' (function or module)
    for i in range(1, len(ts)):
        t = '.'.join(ts[:i])
        m = getattr(sys.modules, t, importlib.import_module(t))

        if hasattr(m, '__resources'):
            s, ms = i, getattr(m, '__resources')

    if s is None:
        raise ModuleNotFoundError("Cannot locate resource directory of '%s'" % str(obj))

    return '%s/%s%s' % (os.path.dirname(ms.__file__), '/'.join(ts[s:]), '/%s' % path if path is not None else '')
