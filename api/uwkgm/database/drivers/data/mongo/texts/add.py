"""MongoDB driver: Add texts to the triple modifier database

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from database.drivers.data.mongo import mongo


def single(document: dict) -> str:
    """Adds a document containing the given text"""

    return str(mongo['texts'].insert_one(document).inserted_id)
