"""Dorest generic-endpoints mounting point for graph database drivers

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from typing import Union

from dorest import configs
from dorest.managers.struct import generic


def get_default_graph() -> Union[dict, None]:
    for graph in graphs:
        if graph['default']:
            return graph

    return None


generic.register('database.drivers.graph', to=__name__, using='virtuoso')
graphs = configs.resolve('database.graphs')
default_graph_uri = get_default_graph()['uri']
