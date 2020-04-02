"""Dorest-extension mounting point for 'knowledge' app

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from dorest.managers import rest


rest.forward(r'.*', at=__name__, to='knowledge.knowledge', using=rest.Managers.STRUCTURED_ENDPOINTS)
