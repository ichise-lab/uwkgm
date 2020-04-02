"""Remove triple modifiers

Only triple modifiers that have not been committed to the graph database can be removed.

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from dorest.managers.struct import generic
from dorest.managers.struct.decorators import endpoint


@endpoint(['DELETE'])
def single(document_id: str) -> int:
    """Deletes a triple modifier

    :param document_id: Document id of the triple modifier
    :return: The number of triple modifiers removed in this transaction
    """

    return generic.resolve(single)(document_id)
