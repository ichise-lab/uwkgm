"""Commit triple modifiers to the graph database

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from dorest.managers.struct import generic
from dorest.managers.struct.decorators import endpoint


@endpoint(['PATCH'])
def auto() -> int:
    """Commits triple modifiers that have not been committed before to the graph database

    :return: The number of triple modifiers committed in this transaction
    """
    return generic.resolve(auto)()
