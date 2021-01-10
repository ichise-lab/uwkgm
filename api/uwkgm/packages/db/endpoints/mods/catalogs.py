"""Interfaces for a graph database

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from typing import List

from rest_framework.permissions import IsAuthenticated

from dorest import interfaces
from dorest.decorators import endpoint


@endpoint(['GET'], requires=[IsAuthenticated])
def find() -> List[dict]:
    """List graphs

    :return: A list of graphs
    """
    return interfaces.resolve(find)()
