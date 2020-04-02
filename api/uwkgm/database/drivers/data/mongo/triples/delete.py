"""MongoDB driver: Issue triple modifiers that delete triples from the graph

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from database.drivers.data.mongo import mongo


def single(document: dict) -> str:
    """Adds a document containing a delete-triple modifier"""

    return str(mongo['triples'].insert_one(document).inserted_id)
