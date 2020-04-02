"""Module importing utilities

The Dorest project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import importlib
import sys
from typing import Union
from types import ModuleType


def get_module(module: Union[str, ModuleType]) -> ModuleType:
    return getattr(sys.modules, module, importlib.import_module(module)) if isinstance(module, str) else module
