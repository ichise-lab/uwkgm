"""Extract triples from texts

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import os
import requests
from typing import List, Tuple

from rest_framework.permissions import IsAuthenticated

from dorest import verbose
from dorest.decorators import endpoint


@endpoint(['GET'], requires=[IsAuthenticated])
def openie(text: str) -> List[Tuple[str, str, str]]:
    """Extract triples using Stanford CoreNLP OpenIE library via CoreNLPConnector in Java REST API

    :param text: A string to be extracted
           :ex: Barack Obama born in Hawaii
    :return: A list of triples
    """

    server = '%s%s' % (os.environ['UWKGM_PKG_CORENLP_HOST'],
                       ':%d' % int(os.environ['UWKGM_PKG_CORENLP_PORT'])
                       if 'UWKGM_PKG_CORENLP_PORT' in os.environ else '')

    verbose.info('Extracting triples using OpenIE at: %s' % server, caller=openie)
    return requests.get('%s/openie/triples' % server, params={'text': text}).json()
