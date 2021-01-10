"""Interfaces for a triple-modifier database

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import os
from typing import List

from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.request import Request

from dorest import interfaces
from dorest.decorators import endpoint
from dorest.permissions import NOT, OR

from accounts.models import CustomUser
from accounts.permissions import IsDemoUser, IsRegularUser, IsTrustedUser


@endpoint(['GET'], requires=[IsAuthenticated])
def find(graph: str) -> List[dict]:
    """Find triple modifiers

    :param graph: Graph name
    :return: A list of triple modifiers
    """

    return interfaces.resolve(find)(graph)


@endpoint(['POST'], requires=[OR(NOT(IsDemoUser), IsRegularUser)], include_request='request')
def add(request: Request, triple: dict, graph: str, doc_id: str = None) -> str:
    """Add an add-triple modifier

    :param request: Django REST Framework's Request object (to get the issuer information)
    :param triple: (subject, predicate, object)
           :ex: ["http://dbpedia.org/resource/Barack_Obama", "http://dbpedia.org/property/birthplace", "http://dbpedia.org/resource/Hawaii"]
    :param graph: Graph name
    :param doc_id: MongoDB's document ID for triple updating
    :return: Added document's id
    """

    return interfaces.resolve(add)(graph, CustomUser.objects.get_by_natural_key(request.user).username,
                                   os.environ['UWKGM_API_VERSION'],
                                   triple, doc_id)


@endpoint(['POST'], requires=[OR(NOT(IsDemoUser), IsRegularUser)], include_request='request')
def edit(request: Request, triple: dict, original_triple: dict, doc_id: str, graph: str) -> str:
    """Add an edit-triple modifier

    :param request: Django REST Framework's Request object (to get the issuer information)
    :param triple: The replacing triple (subject, predicate, object)
           :ex: ["http://dbpedia.org/resource/Barack_Obama", "http://dbpedia.org/property/birthplace", "http://dbpedia.org/resource/United_States"]
    :param original_triple: The original triple to be edited (subject, predicate, object)
           :ex: ["http://dbpedia.org/resource/Barack_Obama", "http://dbpedia.org/property/birthplace", "http://dbpedia.org/resource/Hawaii"]
    :param doc_id: MongoDB's document ID for triple updating
    :param graph: Graph name
    :return: Added document's id
    """

    return interfaces.resolve(edit)(graph, CustomUser.objects.get_by_natural_key(request.user).username,
                                    os.environ['UWKGM_API_VERSION'],
                                    triple, original_triple, doc_id)


@endpoint(['POST'], requires=[OR(NOT(IsDemoUser), IsRegularUser)], include_request='request')
def delete(request: Request, triple: dict, doc_id: str, graph: str) -> str:
    """Add a delete-triple modifier

    :param request: Django REST Framework's Request object (to get the issuer information)
    :param triple: A triple to delete from the graph
           :ex: ["http://dbpedia.org/resource/Barack_Obama", "http://dbpedia.org/property/birthplace", "http://dbpedia.org/resource/Hawaii"]
    :param doc_id: MongoDB's document ID for triple updating
    :param graph: Graph name
    :return: Added document's id
    """

    return interfaces.resolve(delete)(graph, CustomUser.objects.get_by_natural_key(request.user).username,
                                      os.environ['UWKGM_API_VERSION'],
                                      triple, doc_id)


@endpoint(['DELETE'], requires=[OR(NOT(IsDemoUser), IsRegularUser)])
def remove(document_ids: List[str], graph: str) -> int:
    """Remove a triple modifier

    :param document_ids: Document id of the triple modifier
    :param graph: Graph name
    :return: The number of triple modifiers removed in this transaction
    """

    return interfaces.resolve(remove)(document_ids, graph)


@endpoint(['PATCH'], requires=[OR(IsAdminUser, IsTrustedUser)])
def commit(graph: str, graph_uri: str) -> int:
    """Commit triple modifiers that have not been committed before to the graph database

    :param graph: Graph name
    :param graph_uri: Graph URI
    :return: The number of triple modifiers committed in this transaction
    """
    return interfaces.resolve(commit)(graph, graph_uri)
