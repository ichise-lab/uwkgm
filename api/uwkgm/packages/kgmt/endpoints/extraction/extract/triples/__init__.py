"""Extract triples from texts

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from typing import List, Tuple

from dorest.decorators import endpoint

from rest_framework.permissions import IsAuthenticated

from packages.kgmt.endpoints.integration import aggregate, map
from .raw import openie as extract_raw


@endpoint(['GET'], requires=[IsAuthenticated])
def linked(text: str, graph: str) -> List[Tuple[str, str, str]]:
    """Extract linked triples from a text

    :param text: A string to be extracted
           :ex: Barack Obama born in Hawaii
    :param graph: Graph URI
           :ex: http://dbpedia.org
    :return: A list of triples
    """

    return map.predicates(aggregate.triples(extract_raw(text), map.entities(text)), graph)
