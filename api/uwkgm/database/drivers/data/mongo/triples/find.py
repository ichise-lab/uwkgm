"""MongoDB driver: Find triple modifiers

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from typing import List

import pymongo

from database.drivers.data.mongo import mongo


def multiple() -> List[dict]:
    """Finds multiple triple modifiers"""

    triples = []

    for triple in mongo['triples'].find().sort('created', pymongo.DESCENDING):
        document = {'id': str(triple.get('_id')),
                    'action': triple.get('action'),
                    'triple': triple.get('triple'),
                    'issuer': triple.get('issuer'),
                    'created': triple.get('created').strftime('%-d %b %Y %-H:%M:%S'),
                    'api': triple.get('api'),
                    'committed': 'committed' in triple}

        if triple.get('action') == 'edit':
            document['originalTriple'] = triple.get('originalTriple')

        triples.append(document)

    return triples
