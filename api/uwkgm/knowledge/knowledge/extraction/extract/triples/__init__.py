"""Extract triples from texts

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from typing import List, Tuple

from dorest.managers.struct.decorators import endpoint

from knowledge.knowledge.integration import aggregate, map
from .raw import openie as extract_raw


@endpoint(['GET'])
def linked(text: str) -> List[Tuple[str, str, str]]:
    """Extracts linked triples from a text

    :param text: A string to be extracted
           :ex: Barack Obama born in Hawaii
    :return: A list of triples
    """

    return map.predicates(aggregate.triples(extract_raw(text), map.entities(text)))
