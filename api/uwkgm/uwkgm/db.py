import os
import sys
from typing import Any

from SPARQLWrapper import SPARQLWrapper, JSON
from pymongo import MongoClient


class DBClient:
    address: str
    port: int
    username: str
    password: str
    connector: Any = None

    def connect(self):
        pass

    @property
    def client(self):
        if self.connector is not None:
            return self.connector
        else:
            self.connect()
            return self.connector


class DocDBClient(DBClient):
    def __init__(self, address: str = None, port: int = None, username: str = None, password: str = None):
        self.address = address or (os.environ['UWKGM_DB_DOCS_ADDRESS'] if 'UWKGM_DB_DOCS_ADDRESS' in os.environ else None)
        self.port = port or (int(os.environ['UWKGM_DB_DOCS_PORT']) if 'UWKGM_DB_DOCS_PORT' in os.environ and os.environ['UWKGM_DB_DOCS_PORT'] != '' else None)
        self.username = username or (os.environ['UWKGM_DB_DOCS_USERNAME'] if 'UWKGM_DB_DOCS_USERNAME' in os.environ else None)
        self.password = password or (os.environ['UWKGM_DB_DOCS_PASSWORD'] if 'UWKGM_DB_DOCS_PASSWORD' in os.environ else None)


class GraphDBClient(DBClient):
    def __init__(self, address: str = None, port: int = None, username: str = None, password: str = None):
        self.address = address or (os.environ['UWKGM_DB_GRAPHS_ADDRESS'] if 'UWKGM_DB_GRAPHS_ADDRESS' in os.environ else None)
        self.port = port or (int(os.environ['UWKGM_DB_GRAPHS_PORT']) if 'UWKGM_DB_GRAPHS_PORT' in os.environ and os.environ['UWKGM_DB_GRAPHS_PORT'] != '' else None)
        self.username = username or (os.environ['UWKGM_DB_GRAPHS_USERNAME'] if 'UWKGM_DB_GRAPHS_USERNAME' in os.environ else None)
        self.password = password or (os.environ['UWKGM_DB_GRAPHS_PASSWORD'] if 'UWKGM_DB_GRAPHS_PASSWORD' in os.environ else None)


class Mongo(DocDBClient):
    def connect(self):
        endpoint = 'mongodb://%s%s' % (self.address, ':%d' % self.port if self.port is not None else '')

        if self.username == '' and self.password == '':
            self.connector: MongoClient = MongoClient(endpoint)
        else:
            self.connector: MongoClient = MongoClient(endpoint, username=self.username, password=self.password)

    @property
    def client(self) -> MongoClient:
        return super().client

    @property
    def uwkgm(self):
        return super().client['uwkgm']


class Virtuoso(GraphDBClient):
    default_graph_uri: str

    def __init__(self, address: str = None, port: int = None, username: str = None, password: str = None,
                default_graph_uri: str = None):
        super().__init__(address, port, username, password)
        self.default_graph_uri = default_graph_uri or os.environ['UWKGM_DB_GRAPHS_DEFAULT_GRAPH'] \
            if 'UWKGM_DB_GRAPHS_DEFAULT_GRAPH' in os.environ else None

    def connect(self):
        endpoint = '%s/sparql/' % self.address if self.port is None else '%s:%d/sparql/' % (self.address, self.port)
        self.connector: SPARQLWrapper = SPARQLWrapper(endpoint)

        if self.default_graph_uri is not None:
            self.connector.addDefaultGraph(self.default_graph_uri)

        self.connector.setReturnFormat(JSON)
        self.connector.setTimeout(30)

    @property
    def client(self) -> SPARQLWrapper:
        return super().client


docs = Mongo()
graphs = Virtuoso()
