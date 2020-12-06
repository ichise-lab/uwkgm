from dorest import interfaces

interfaces.bind('backends.docs', to=__name__, using='mongo')
