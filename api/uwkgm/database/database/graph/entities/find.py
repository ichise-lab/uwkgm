"""Find entities in the graph database

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from typing import Dict, List, Union

from dorest.managers.struct import generic
from dorest.managers.struct.decorators import endpoint

from database.database.graph import default_graph_uri


@endpoint(['GET'])
def candidates(label: str, limit: Union[int, None] = 10, language: str = 'en', query_limit: int = None,
               perfect_match_only: bool = False, graph: str = default_graph_uri) -> Dict[str, List[Dict[str, Union[str, List[str]]]]]:
    """Finds candidates of entities given a partial or full label

    This endpoint function returns three list of candidates:
        The 'exact_matches' are candidates which labels match the search label perfectly.
        The 'first_matches' are candidates which labels start with the search label
        The 'partial_matches' are candidates which labels partially match the search label

    :param label: The partial or full search label
    :param limit: The maximum number of candidates in each of the response lists
    :param language: A language filter for the candidates' labels
    :param query_limit: The maximum number of candidates specified in the database query command
    :param perfect_match_only: Finds only candidates that exactly match the search label
    :param graph: Graph URI
    :return: The three lists of candidates ({"exact_matches": ..., "first_matches": ..., "partial_matches": ...})
    """

    return generic.resolve(candidates)(graph, label, limit, language, query_limit, perfect_match_only)


@endpoint(['GET'])
def candidates_aggregated(labels: List[str], language: str = 'en', query_limit: int = None, perfect_match_only: bool = True,
                          graph: str = default_graph_uri) -> Dict[str, int]:
    """Lists numbers of candidates that exactly match the given labels

    :param labels: A list of labels
    :param language: A language filter for the candidates' labels
    :param query_limit: The maximum number of candidates specified in the database query command
    :param perfect_match_only: Finds only candidates that exactly match the search label
    :param graph: Graph URI
    :return: A dictionary containing the labels and their numbers of candidates
    """

    aggregated = dict()

    for label in labels:
        if label not in aggregated:
            aggregated[label] = len(candidates(label, limit=None, language=language, query_limit=query_limit,
                                               perfect_match_only=perfect_match_only, graph=graph)['exact_matches'])

    return aggregated


@endpoint(['GET'])
def single(entity: str, as_element: str = None, limit: int = 10000, graph: str = default_graph_uri) -> Dict[str, List[Dict[str, str]]]:
    """Finds triples which the given entity is a part of (as subject, predicate, object, or any)

    :param entity: An entity to find the triples
    :param as_element: Find triples where the entity is their 'subject', 'predicate', or 'object' ('None' will ignore this filter)
    :param limit: The maximum number of returned triples
    :param graph: Graph URI
    :return: Lists of triples pertaining to the entity's role ({'subject': [...], 'predicate': [...], 'object': [...]})
    """

    return generic.resolve(single)(graph, entity, as_element, limit)


# @endpoint(['GET'])
# def relations(source: str, targets: List[str]) -> List[Dict[str, str]]:
#    return generic.resolve(relations)(source, targets)
