"""Namespace utilities

The Dorest project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from typing import Any, Dict, List, Tuple


def itemize(n: tuple) -> List[Tuple[str, Any]]:
    return [(k, getattr(n, k)) for k in n._fields]


def dictize(n: tuple) -> Dict[str, Any]:
    return {k: dictize(v) if isinstance(v, tuple) else v for k, v in itemize(n)}
