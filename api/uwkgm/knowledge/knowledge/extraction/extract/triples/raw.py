"""Extract triples from texts

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import requests
from typing import List, Tuple

from dorest import env, verbose
from dorest.managers.struct.decorators import endpoint


@endpoint(['GET'], throttle='half')
def openie(text: str) -> List[Tuple[str, str, str]]:
    """Extracts triples using Stanford CoreNLP OpenIE library via CoreNLPConnector in Java REST API

    :param text: A string to be extracted
           :ex: Barack Obama born in Hawaii
    :return: A list of triples
    """

    client = env.resolve('servers.java')
    verbose.info('Extracting triples using OpenIE at: ' + client['address'], caller=openie)
    return requests.get('%s/openie/triples' % client['address'], params={'text': text}).json()
