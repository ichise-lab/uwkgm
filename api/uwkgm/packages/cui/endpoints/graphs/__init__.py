from dorest import interfaces

interfaces.bind('backends.graphs', to=__name__, using='virtuoso')
