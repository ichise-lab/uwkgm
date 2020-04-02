"""Dorest-extension mounting point for 'database' app

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from dorest.managers import rest


rest.forward(r'.*', at=__name__, to='database.database', using=rest.Managers.STRUCTURED_ENDPOINTS)
