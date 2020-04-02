"""MongoDB driver: Remove triple modifiers

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from bson.objectid import ObjectId

from database.drivers.data.mongo import mongo


def single(document_id: str) -> int:
    """Deletes a triple modifier"""

    return mongo['triples'].delete_one({'_id': ObjectId(document_id.strip('"'))}).deleted_count
