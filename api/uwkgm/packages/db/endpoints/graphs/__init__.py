from dorest import interfaces
from . import triples

interfaces.bind('backends.graphs', to=__name__, using='virtuoso')
