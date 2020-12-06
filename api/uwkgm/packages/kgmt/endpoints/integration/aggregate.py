"""Replace triples' subjects and objects with their entities

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from typing import Dict, List, Tuple

from rest_framework.permissions import IsAuthenticated

from dorest import verbose
from dorest.decorators import endpoint


@endpoint(['GET'], requires=[IsAuthenticated])
def triples(triples: List[Tuple[str, str, str]], entities: Dict[str, str]) -> List[Tuple[str, str, str]]:
    """Replace subjects and objects in a list of triples with entities

    :param triples: A list of triples [(subject, predicate, object), ...]
           :ex: [["Barack Obama", "bear in", "Hawaii"]]
    :param entities: A dictionary of known entities
           :ex: {"Barack Obama": "http://dbpedia.org/resource/Barack_Obama", "Hawaii": "http://dbpedia.org/resource/Hawaii"}
    :return: A list of triples with subjects and objects replaced with their entities
    """

    def replace_entity(term):
        return entities[term] if term in entities else term

    verbose.info('Aggregating triples', globals()['triples'])
    aggregated_triples = []

    for triple in triples:
        aggregated_triples.append((replace_entity(triple[0].strip()),
                                   triple[1],
                                   replace_entity(triple[2].strip())))

    return aggregated_triples
