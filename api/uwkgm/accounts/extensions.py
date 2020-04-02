"""Dorest-extension mounting point for 'accounts' app

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from dorest.managers import rest


rest.extend('', at=__name__, to='accounts.rest.urls')
