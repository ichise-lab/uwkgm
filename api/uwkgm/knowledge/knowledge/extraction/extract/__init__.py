from dorest.managers.struct import rest

from . import triples


rest.redirect(methods=['GET'], at=__name__, to=triples)
