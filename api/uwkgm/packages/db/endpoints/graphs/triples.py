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
def find(graph_uri: str, triple: Tuple[str, str, str]) -> bool:
    """Find a triple in the graph database

    :param triple: Entities of (subject, predicate, object)
    :param graph_uri: Graph URI
    :return: True if the triple exists in the graph
    """

    return interfaces.resolve(find)(graph_uri, triple)


@endpoint(['POST'], requires=[OR(IsAdminUser, IsTrustedUser)])
def add(graph_uri: str, triple: Tuple[str, str, str], literal: str = None, language: str = None) -> str:
    """Add a triple to the graph database

    :param triple: A URI triple (subject, predicate, object)
    :param graph_uri: Graph URI
    :param literal: Literal (attribute) value
    :param language: Language if the triple is an attribute
    :return: Adding status
    """
    return interfaces.resolve(add)(graph_uri, triple, literal=literal, language=language)


@endpoint(['DELETE'], requires=[OR(IsAdminUser, IsTrustedUser)])
def delete(graph_uri: str, triple: Tuple[str, str, str]) -> str:
    """Delete a triple from the graph database

    :param triple: Entities of (subject, predicate, object)
    :param graph_uri: Graph URI
    :return: Deleting status
    """

    return interfaces.resolve(delete)(graph_uri, triple)


@endpoint(['GET'], requires=[IsAuthenticated])
def verify(graph_uri: str, triple: Tuple[str, str, str]) -> Dict[str, Any]:
    """Verify a new triple

    :param triple: (subject, predicate, object)
            :ex: ["http://dbpedia.org/resource/Barack_Obama", "http://dbpedia.org/property/birthplace", "http://dbpedia.org/resource/Hawaii"]
    :param graph_uri: Graph URI
    :return: True if the triple does not exist in the graph
    """

    return interfaces.resolve(verify)(graph_uri, triple)
