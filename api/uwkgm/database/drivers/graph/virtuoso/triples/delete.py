"""Virtuoso driver: Delete triples from the graph database

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from typing import Tuple

from database.drivers.graph.virtuoso import client


def single(triple: Tuple[str, str, str], graph: str) -> str:
    """Deletes a triple from the graph database"""

    client.setQuery('DELETE DATA { GRAPH <%s> {<%s> <%s> <%s>} }' % (graph, triple[0], triple[1], triple[2]))

    try:
        return client.query().convert()['results']['bindings'][0]['callret-0']['value']
    except Exception:
        return str(client.query().convert())
