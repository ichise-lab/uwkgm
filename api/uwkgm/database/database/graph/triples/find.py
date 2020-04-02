"""Find triples in the graph database

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from typing import Tuple

from dorest.managers.struct import generic
from dorest.managers.struct.decorators import endpoint

from database.database.graph import default_graph_uri


@endpoint(['GET'])
def single(triple: Tuple[str, str, str], graph: str = default_graph_uri) -> bool:
    """Checks whether a triple exists in the graph

    :param triple: Entities of (subject, predicate, object)
    :param graph: Graph URI
    :return: True if the triple exists in the graph
    """

    return generic.resolve(single)(triple, graph)
