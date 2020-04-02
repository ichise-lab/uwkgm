"""Add triples to the graph database

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from typing import Tuple

from dorest.managers.struct import generic
from dorest.managers.struct.decorators import endpoint

from database.database.graph import default_graph_uri


@endpoint(['GET'])
def single(triple: Tuple[str, str, str], graph: str = default_graph_uri) -> str:
    """Adds a triple to the graph database

    :param triple: A URI triple (subject, predicate, object)
    :param graph: Graph URI
    :return: Adding status
    """
    return generic.resolve(single)(triple, graph)
