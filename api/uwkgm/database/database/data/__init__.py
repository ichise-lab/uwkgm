"""Dorest generic-endpoints mounting point for triple-modifier database drivers

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from dorest.managers.struct import generic


generic.register('database.drivers.data', to=__name__, using='mongo')
