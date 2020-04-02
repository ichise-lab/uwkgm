"""Map entities from texts

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import pickle
import requests
from typing import Dict

import spacy
from fuzzywuzzy import fuzz

from dorest import configs, verbose
from dorest.managers.struct import resources
from dorest.managers.struct.decorators import endpoint as endpoint


@endpoint(['GET'])
def dbpedia_spotlight(text: str, endpoint: str = None, confidence: float = .5) -> Dict[str, str]:
    """Maps entities from a text

    :param text: A string (to be mapped)
           :ex: Barack Obama born in Hawaii
    :param endpoint: Annotator endpoint
           :ex: http://model.dbpedia-spotlight.org/en/annotate
    :param confidence: Minimum threshold of confidence value of found entities
           :ex: 0.5
    :return: A dictionary of mapped entities (URI)
    """

    config = configs.resolve('knowledge.integration.map.entities.dbpedia')
    confidence = confidence or config['confidence']
    endpoint = endpoint or config['endpoint']

    verbose.info('Mapping entities with annotation endpoint: %s' % endpoint, dbpedia_spotlight)
    response = requests.post(endpoint, data={'text': text, 'confidence': str(confidence)}, headers={'Accept': 'application/json'})

    entities = {}
    for item in response.json()['Resources']:
        entities[item['@surfaceForm']] = item['@URI']

    return entities


@endpoint(['GET'])
def string_similarity(text: str) -> Dict[str, str]:
    """Maps entities using string comparison with NERs in DBpedia

    :param text: String (to be mapped)
           :ex: Donald Trump born in New York
    :return: A dictionary of mapped entities (URI)
    """

    def compute_similarity(cand: str, ent) -> int:
        return fuzz.ratio(cand, ent)

    nlp = spacy.load('en_core_web_sm')
    entities = {ent.text: None for ent in nlp(text).ents}
    dbpedia_name_list = pickle.load(open(resources.resolve(string_similarity, 'dbpedia_names.pkl'), 'rb'))

    for entity in entities:
        if entity in dbpedia_name_list:
            entities[entity] = dbpedia_name_list[entity]

        else:
            max_score = 0

            for candidate, uri in dbpedia_name_list.items():
                score = compute_similarity(candidate, entity)

                if score > max_score:
                    max_score = score
                    entities[entity] = uri

    return entities
