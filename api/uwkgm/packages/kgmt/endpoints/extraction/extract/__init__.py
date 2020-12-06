from dorest import struct

from . import triples


struct.redirect(methods=['GET'], at=__name__, to=triples)
