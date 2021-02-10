from dorest import interfaces

interfaces.bind('backends.console', to=__name__, using='mongo')
