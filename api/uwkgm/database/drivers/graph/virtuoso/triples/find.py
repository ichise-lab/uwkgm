"""Virtuoso driver: Find triples in the graph database

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from typing import Tuple

from database.drivers.graph.virtuoso import client


def single(triple: Tuple[str, str, str], graph: str) -> bool:
    """Checks whether a triple exists in the graph"""

    client.setQuery('SELECT DISTINCT ?predicate WHERE { GRAPH <%s> {<%s> ?predicate <%s>} }' %
                    (graph, triple[0], triple[2]))
    response = client.query().convert()['results']['bindings']

    for item in response:
        if triple[1] == item['predicate']['value']:
            return True

    return False
