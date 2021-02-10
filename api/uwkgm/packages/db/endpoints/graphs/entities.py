"""Interfaces for a graph database

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from typing import Dict, List, Union

from rest_framework.permissions import IsAuthenticated

from dorest import interfaces
from dorest.decorators import endpoint


LABEL_ENTITIES = ['http://xmlns.com/foaf/0.1/name',
                  'http://www.w3.org/2000/01/rdf-schema#label',
                  'http://dbpedia.org/property/name',
                  'http://dbpedia.org/ontology/title']
TYPE_ENTITIES = ['http://www.w3.org/1999/02/22-rdf-syntax-ns#type']

PREDICATES = {
                'incomings': {
                        'predicates': {'label': LABEL_ENTITIES},
                        'targets': {'label': LABEL_ENTITIES}
                    },
                'outgoings': {
                        'predicates': {'label': LABEL_ENTITIES},
                        'targets': {'label': LABEL_ENTITIES, 'type': TYPE_ENTITIES}
                    }
             }


@endpoint(['GET'], requires=[IsAuthenticated])
def find(uris: List[str], graph: str, language: str = 'en', query_limit: Union[int, None] = None,
         include_incomings: bool = False, include_outgoings: bool = True) -> Dict[str, List[Dict[str, str]]]:
    """Find triples of which the given entity is a subject or an object

    :param uris: A list of entity URIs to be used to find the triples
    :param graph: Graph URI
    :param language: A language filter for the candidates' labels
    :param query_limit: The maximum number of candidates specified in the database query command
    :param include_incomings: Include entities' incoming links (triples)
    :param include_outgoings: Include entities' outgoing links (triples)
    :return: Lists of triples pertaining to the entity's role ({'subject': [...], 'predicate': [...], 'object': [...]})
    """
    
    return interfaces.resolve(find)(graph, uris, language, query_limit, include_incomings, include_outgoings)


@endpoint(['GET'], requires=[IsAuthenticated])
def candidates(search: str, graph: str, limit: Union[int, None] = 50, query_limit: Union[int, None] = None,
               label_entities: List[str] = LABEL_ENTITIES, type_entities: str = TYPE_ENTITIES, have_types_only: bool = False,
               perfect_match_only: bool = False)\
        -> Dict[str, List[Dict[str, Union[str, List[str]]]]]:
    """Find candidates of entities given a partial or full label

    This endpoint function returns three list of candidates:
        The 'exact_matches' are candidates which labels match the search label perfectly.
        The 'first_matches' are candidates which labels start with the search label
        The 'partial_matches' are candidates which labels partially match the search label

    :param search: Search term (URI or partial/full label)
    :param graph: Graph URI
    :param limit: The maximum number of candidates in each of the response lists
    :param query_limit: The maximum number of candidates specified in the database query command
    :param label_entities: Entities of predicate 'label'
    :param type_entities: Entities of predicate 'type'
    :param have_types_only: Find only candidates that have types
    :param perfect_match_only: Find only candidates that exactly match the search label
    :return: The three lists of candidates ({"exact_matches": ..., "first_matches": ..., "partial_matches": ...})
    """

    return interfaces.resolve(candidates)(graph, search, limit, query_limit, label_entities, type_entities,
                                          have_types_only, perfect_match_only)


@endpoint(['GET'], requires=[IsAuthenticated])
def candidates_aggregated(labels: List[str], graph: str, language: str = 'en', query_limit: int = None,
                          perfect_match_only: bool = True) \
        -> Dict[str, int]:
    """List numbers of candidates that exactly match the given labels

    :param labels: A list of labels
    :param graph: Graph URI
    :param language: A language filter for the candidates' labels
    :param query_limit: The maximum number of candidates specified in the database query command
    :param perfect_match_only: Find only candidates that exactly match the search label
    :return: A dictionary containing the labels and their numbers of candidates
    """

    aggregated = dict()

    for label in labels:
        if label not in aggregated:
            aggregated[label] = len(candidates(label, limit=None, language=language, query_limit=query_limit,
                                               perfect_match_only=perfect_match_only, graph=graph)['exact_matches'])

    return aggregated


@endpoint(['GET'], requires=[IsAuthenticated])
def entity(subject: str, graph: str, label_entities: List[str] = LABEL_ENTITIES, type_entities: str = TYPE_ENTITIES,):
    """Find objects or an attribute given subject and predicate

    :param subject: Subject URI
    :param graph: Graph URI
    :param label_entities: Entities of predicate 'label'
    :param type_entities: Entities of predicate 'type'
    :return: A list of objects or an attribute value
    """

    return interfaces.resolve(entity)(graph, subject, label_entities, type_entities)
