"""Map predicates from triples or texts

The UWKGM project
:copyright: (c) 2020 Ichise Laboratory at NII & AIST
:author: Rungsiman Nararatwong
"""

import sqlite3
from typing import List, Tuple

import nltk
nltk.download('wordnet')

from nltk.stem import WordNetLemmatizer

from rest_framework.permissions import IsAuthenticated

from dorest import verbose, resources
from dorest.decorators import endpoint

from packages.kgmt.endpoints.verification import verify


@endpoint(['GET'], requires=[IsAuthenticated])
def scoring(triples: List[Tuple[str, str, str]], n_candidates_threshold: int = 5) -> List[Tuple[str, str, str]]:
    """Replace predicates with linked predicates (URIs)

    :param triples: A list of triples to be processed [(subject, predicate, object), ...]
           :ex: [["http://dbpedia.org/resource/Barack_Obama", "bear in", "http://dbpedia.org/resource/Hawaii"]]
    :param n_candidates_threshold: A maximum number of candidates to be verified.
                                   The verification algorithm may take a very long time to verify a large set of candidates
           :ex: 5
    :return: A list of triples with predicates replaced
    """

    verbose.info('Mapping predicates using scoring system', scoring)
    linked_triples = []

    for triple in triples:
        # Find and sort predicate candidates by mapping_score
        candidates = _find_candidates(triple[1])
        candidates = sorted(candidates, key=lambda tup: tup[1], reverse=True)

        # Choose a candidate with highest mapping_score that is also in a domain range
        for candidate in candidates[:n_candidates_threshold]:
            if verify.agreement(triple, candidate[0]):
                linked_triples.append((triple[0], candidate[0], triple[2]))
                break

    return linked_triples


def _find_candidates(predicate: str) -> List[Tuple[str, str]]:
    """Get an unsorted list of candidates of a predicate in form of [(URI, mapping_score), ...]

    :param predicate: to be searched for candidates
    :return: Unsorted list of candidates
    """

    def lemmatize_word(words: str) -> str:
        wordnet_lemmatizer = WordNetLemmatizer()
        return '_'.join([wordnet_lemmatizer.lemmatize(word, pos='v') for word in words.split()])

    rules_db_conn = sqlite3.connect(resources.resolve(__name__, 'rules.sqlite3'))
    rules_db = rules_db_conn.cursor()

    # Perform lemmatization before using the lemmatized word as a key to search in the rules database
    rule_key = lemmatize_word(predicate)

    # The SQLite database contains one table: 'rules'
    # The 'rules' table consists of two columns: 'key' and 'value'
    # 'key': Lemmatized predicates
    # 'value': A list of URI and associated mapping_scores stored as a single string value, each separated by \t
    candidates = []

    for rule_value in rules_db.execute("SELECT value FROM rules WHERE key = '{0}'".format(rule_key)):
        rule_items = rule_value[0].strip().split('\t')

        for i in range(0, len(rule_items), 2):
            candidates.append((rule_items[i], rule_items[i + 1]))

    return candidates


def _migrate_rules() -> None:
    """Migrate predicate-mapping rules in 'tsv' format used in previous version of the project to SQLite"""

    conn = sqlite3.connect(resources.resolve(__name__, 'rules.sqlite3'))
    db = conn.cursor()
    db.execute('CREATE TABLE rules (key text NOT NULL, value text NOT NULL)')
    db.execute('CREATE INDEX key_index ON rules(key);')

    with open(resources.resolve(__name__, 'rules.tsv'), 'r') as file:
        for line in file:
            rules = line.split('\t')
            db.execute("INSERT INTO rules VALUES ('{0}', '{1}')".format(rules[0],
                                                                        '\t'.join(rules[1:])))

    conn.commit()
    conn.close()
