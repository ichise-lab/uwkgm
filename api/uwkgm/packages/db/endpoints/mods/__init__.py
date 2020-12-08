from dorest import interfaces

interfaces.bind('backends.mods', to=__name__, using='mongo')
