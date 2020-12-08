"""The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from dorest import packages
from dorest.permissions import NOT

from accounts.permissions import IsDemoUser

packages.link(__name__)
packages.requires(__name__, permissions=[NOT(IsDemoUser)])
