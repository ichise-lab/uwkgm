package api.connectors;

/*
 * Author: Rungsiman Nararatwong
 * Contact: rungsiman@gmail.com
 *
 * Triple extractor using Stanford CoreNLP's OpenIE
 * Intended to be called by uwkgm.extraction.openie.triples to extract triples from a text
 *
 * Stanford CoreNLP package is included as a Maven dependency
 * See pom.xml for the dependency configuration
 *
 * More information about OpenIE:
 * https://nlp.stanford.edu/software/openie.html
 *
 * Example of working OpenIE code:
 * https://github.com/stanfordnlp/CoreNLP/blob/master/src/edu/stanford/nlp/naturalli/OpenIEDemo.java
 *
 */

import edu.stanford.nlp.ie.util.RelationTriple;
import edu.stanford.nlp.ling.CoreAnnotations;
import edu.stanford.nlp.pipeline.Annotation;
import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import edu.stanford.nlp.util.CoreMap;
import edu.stanford.nlp.util.PropertiesUtils;
import edu.stanford.nlp.naturalli.NaturalLogicAnnotations;

import java.util.Collection;
import java.util.Properties;
import java.util.ArrayList;

public class CoreNLPConnector {

    private Properties props;
    private StanfordCoreNLP pipeline;

    public CoreNLPConnector() {
        // Create the Stanford CoreNLP pipeline
        // All annotators are required to perform triple extraction using OpenIE
        props = PropertiesUtils.asProperties("annotators", "tokenize,ssplit,pos,lemma,depparse,natlog,openie");
        pipeline = new StanfordCoreNLP(props);
    }

    public ArrayList<String[]> getTriples(String text) {
        ArrayList<String[]> triples = new ArrayList<>();

        Annotation doc = new Annotation(text);
        pipeline.annotate(doc);

        for (CoreMap sentence : doc.get(CoreAnnotations.SentencesAnnotation.class)) {
            // Get the OpenIE triples for the sentence
            Collection<RelationTriple> coreNLPTriples = sentence.get(NaturalLogicAnnotations.RelationTriplesAnnotation.class);

            // Convert OpenIE triples into fixed array of [subject, predicate, object]
            for (RelationTriple coreNLPTriple : coreNLPTriples) {
                triples.add(new String[]{coreNLPTriple.subjectLemmaGloss(),
                        coreNLPTriple.relationLemmaGloss(),
                        coreNLPTriple.objectLemmaGloss()});
            }
        }

        return triples;
    }
}
