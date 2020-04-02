"""Dictionary utilities

The Dorest project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from collections import namedtuple
from typing import Any, Dict, Union


def override(d1: dict, d2: dict) -> dict:
    """Overrides a nested dictionary 'd1' with a nested dictionary 'd2'

    :param d1: A dictionary to be overwritten (Dorest default configuration)
    :param d2: A dictionary to overwrite (API configuration)
    :return: An overwritten dictionary
    """
    return {**{**d1, **d2}, **{k: override(d1[k], d2[k]) for k in d2 if k in d1 and isinstance(d2[k], dict)}}


def namespace(d: Union[dict, list, Any]) -> Union[Any, tuple]:
    """Converts a nested dictionary into a named tuple

    :param d: A dictionary
    :return: A named tuple
    """
    def name(obj: Union[Dict[str, Any], list]) -> Union[list, tuple]:
        if isinstance(d, dict):
            return namedtuple('Namespace', obj.keys())(*(namespace(v) if isinstance(v, (dict, list)) else v for v in obj.values()))
        else:
            return [namespace(v) if isinstance(v, (dict, list)) else v for v in obj]

    if isinstance(d, dict) or isinstance(d, list):
        return name(d)
    else:
        return d
