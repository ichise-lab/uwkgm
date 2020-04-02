"""Virtuoso driver for graph database

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

from dorest import env
from SPARQLWrapper import SPARQLWrapper, JSON

from database.database.graph import default_graph_uri


config = env.resolve('database.virtuoso')

if 'port' in config:
    client = SPARQLWrapper('%s:%s/sparql/' % (config['address'], config['port']))
else:
    client = SPARQLWrapper('%s/sparql/' % config['address'])

client.addDefaultGraph(default_graph_uri)
client.setReturnFormat(JSON)
