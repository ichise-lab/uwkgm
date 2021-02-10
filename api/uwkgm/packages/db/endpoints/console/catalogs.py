"""Interfaces for a graph database

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from typing import List

from rest_framework.permissions import IsAuthenticated, IsAdminUser

from dorest import interfaces
from dorest.decorators import endpoint


@endpoint(['GET'], requires=[IsAuthenticated])
def find() -> List[dict]:
    """List graph catalogs

    :return: A list of graph catalogs
    """
    return interfaces.resolve(find)()


@endpoint(['POST'], requires=[IsAdminUser])
def add(catalog: dict) -> str:
    """Add a graph catalog

    :return: Added catalog's id"""
    return interfaces.resolve(add)(catalog)


@endpoint(['PATCH'], requires=[IsAdminUser])
def edit(catalog: dict) -> int:
    """Edit a graph catalog

    :return: The number of modified record"""
    return interfaces.resolve(edit)(catalog)


@endpoint(['DELETE'], requires=[IsAdminUser])
def delete(catalog_id: str) -> int:
    """Add a graph catalog

    :return: Deleted catalog's id"""
    return interfaces.resolve(delete)(catalog_id)
