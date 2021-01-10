"""Interfaces for a graph database

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import os
from typing import Any, Dict, List, Tuple

from rest_framework.permissions import IsAdminUser, IsAuthenticated

from dorest import interfaces
from dorest.decorators import endpoint
from dorest.permissions import OR

from accounts.permissions import IsTrustedUser


@endpoint(['GET'], requires=[IsAuthenticated])
def find(triple: Tuple[str, str, str], graph_uri: str) -> bool:
    """Find a triple in the graph database

    :param triple: Entities of (subject, predicate, object)
    :param graph_uri: Graph URI
    :return: True if the triple exists in the graph
    """

    return interfaces.resolve(find)(triple, graph_uri)


@endpoint(['POST'], requires=[OR(IsAdminUser, IsTrustedUser)])
def add(triple: Tuple[str, str, str], graph_uri: str) -> str:
    """Add a triple to the graph database

    :param triple: A URI triple (subject, predicate, object)
    :param graph_uri: Graph URI
    :return: Adding status
    """
    return interfaces.resolve(add)(triple, graph_uri)


@endpoint(['DELETE'], requires=[OR(IsAdminUser, IsTrustedUser)])
def delete(triple: Tuple[str, str, str], graph_uri: str) -> str:
    """Delete a triple from the graph database

    :param triple: Entities of (subject, predicate, object)
    :param graph_uri: Graph URI
    :return: Deleting status
    """

    return interfaces.resolve(delete)(triple, graph_uri)


@endpoint(['GET'], requires=[IsAuthenticated])
def verify(triple: Tuple[str, str, str], graph_uri: str) -> Dict[str, Any]:
    """Verify a new triple

    :param triple: (subject, predicate, object)
            :ex: ["http://dbpedia.org/resource/Barack_Obama", "http://dbpedia.org/property/birthplace", "http://dbpedia.org/resource/Hawaii"]
    :param graph_uri: Graph URI
    :return: True if the triple does not exist in the graph
    """

    return interfaces.resolve(verify)(triple, graph_uri)
