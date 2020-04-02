"""Find triple modifiers

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from typing import List

from dorest.managers.struct import generic
from dorest.managers.struct.decorators import endpoint


@endpoint(['GET'])
def multiple() -> List[dict]:
    """Finds multiple triple modifiers

    :return: A list of triple modifiers
    """

    return generic.resolve(multiple)()
