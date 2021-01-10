export const genLabelFromURI = uri => {
    const uriSections = uri.split('/');
    const identifierSections = uriSections[uriSections.length - 1].split('#');
    const label = identifierSections[identifierSections.length - 1]
        .replace('_', ' ')
        .replace(/ +/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .trim();

    return label.charAt(0).toUpperCase() + label.slice(1);
}

export const shortenURI = uri => {
    const dict = {
        'http://www.w3.org/1999/02/22-rdf-syntax-ns#': 'rdf:',
        'http://www.w3.org/2000/01/rdf-schema#': 'rdfs:',
        'http://xmlns.com/foaf/0.1/': 'foaf:',
        'http://www.w3.org/2002/07/owl#': 'owl:',
        'http://www.w3.org/2001/XMLSchema#': 'xsd:',
        'http://purl.org/dc/elements/1.1/': 'dc:'
    }

    var short = uri;
    var shortened = false;

    for (const [key, value] of Object.entries(dict)) {
        if (uri.includes(key)) {
            shortened = true;
            short = short.replace(key, value);
        }
    }

    return shortened ? short : null;
}

export const rdf = {
    HTML: 'The datatype of RDF literals storing fragments of HTML content.',
    langString: 'The datatype of language-tagged string values.',
    PlainLiteral: 'The class of plain (i.e. untyped) literal values, as used in RIF and OWL 2.',
    type: 'The subject is an instance of a class.',
    Property: 'The class of RDF properties.',
    Statement: 'The class of RDF statements.',
    subject: 'The subject of the subject RDF statement.',
    predicate: 'The predicate of the subject RDF statement.',
    object: 'The object of the subject RDF statement.',
    Bag: 'The class of unordered containers.',
    Seq: 'The class of ordered containers.',
    Alt: 'The class of containers of alternatives.',
    value: 'Idiomatic property used for structured values.',
    List: 'The class of RDF Lists.',
    nil: 'The empty list, with no items in it. If the rest of a list is nil then the list has no more items in it.',
    first: 'The first item in the subject RDF list.',
    rest: 'The rest of the subject RDF list after the first item.',
    XMLLiteral: 'The datatype of XML literal values.',
    JSON: 'The datatype of RDF literals storing JSON content.',
    CompoundLiteral: 'A class representing a compound literal.',
    language: 'The language component of a CompoundLiteral.',
    direction: 'The base direction component of a CompoundLiteral.'
};

export const rdfs = {
    Resource: 'The class resource, everything.',
    Class: 'The class of classes.',
    subClassOf: 'The subject is a subclass of a class.',
    subPropertyOf: 'The subject is a subproperty of a property.',
    comment: 'A description of the subject resource.',
    label: 'A human-readable name for the subject.',
    domain: 'A domain of the subject property.',
    range: 'A range of the subject property.',
    seeAlso: 'Further information about the subject resource.',
    isDefinedBy: 'The defininition of the subject resource.',
    Literal: 'The class of literal values, eg. textual strings and integers.',
    Container: 'The class of RDF containers.',
    ContainerMembershipProperty: "The class of container membership properties, rdf:_1, rdf:_2, ..., all of which are sub-properties of 'member'.",
    member: 'A member of the subject resource.',
    Datatype: 'The class of RDF datatypes.'
};

export const owl = {
    AllDifferent: 'The class of collections of pairwise different individuals.',
    AllDisjointClasses: 'The class of collections of pairwise disjoint classes.',
    AllDisjointProperties: 'The class of collections of pairwise disjoint properties.',
    Annotation: 'The class of annotated annotations for which the RDF serialization consists of an annotated subject, predicate and object.',
    AnnotationProperty: 'The class of annotation properties.',
    AsymmetricProperty: 'The class of asymmetric properties.',
    Axiom: 'The class of annotated axioms for which the RDF serialization consists of an annotated subject, predicate and object.',
    Class: 'The class of OWL classes.',
    DataRange: 'The class of OWL data ranges, which are special kinds of datatypes. Note: The use of the IRI owl:DataRange has been deprecated as of OWL 2. The IRI rdfs:Datatype SHOULD be used instead.',
    DatatypeProperty: 'The class of data properties.',
    DeprecatedClass: 'The class of deprecated classes.',
    DeprecatedProperty: 'The class of deprecated properties.',
    FunctionalProperty: 'The class of functional properties.',
    InverseFunctionalProperty: 'The class of inverse-functional properties.',
    IrreflexiveProperty: 'The class of irreflexive properties.',
    NamedIndividual: 'The class of named individuals.',
    NegativePropertyAssertion: 'The class of negative property assertions.',
    Nothing: 'This is the empty class.',
    ObjectProperty: 'The class of object properties.',
    Ontology: 'The class of ontologies.',
    OntologyProperty: 'The class of ontology properties.',
    ReflexiveProperty: 'The class of reflexive properties.',
    Restriction: 'The class of property restrictions.',
    SymmetricProperty: 'The class of symmetric properties.',
    TransitiveProperty: 'The class of transitive properties.',
    Thing: 'The class of OWL individuals.',
    allValuesFrom: 'The property that determines the class that a universal property restriction refers to.',
    annotatedProperty: 'The property that determines the predicate of an annotated axiom or annotated annotation.',
    annotatedSource: 'The property that determines the subject of an annotated axiom or annotated annotation.',
    annotatedTarget: 'The property that determines the object of an annotated axiom or annotated annotation.',
    assertionProperty: 'The property that determines the predicate of a negative property assertion.',
    backwardCompatibleWith: 'The annotation property that indicates that a given ontology is backward compatible with another ontology.',
    bottomDataProperty: 'The data property that does not relate any individual to any data value.',
    bottomObjectProperty: 'The object property that does not relate any two individuals.',
    cardinality: 'The property that determines the cardinality of an exact cardinality restriction.',
    complementOf: 'The property that determines that a given class is the complement of another class.',
    datatypeComplementOf: 'The property that determines that a given data range is the complement of another data range with respect to the data domain.',
    deprecated: 'The annotation property that indicates that a given entity has been deprecated.',
    differentFrom: 'The property that determines that two given individuals are different.',
    disjointUnionOf: 'The property that determines that a given class is equivalent to the disjoint union of a collection of other classes.',
    disjointWith: 'The property that determines that two given classes are disjoint.',
    distinctMembers: 'The property that determines the collection of pairwise different individuals in a owl:AllDifferent axiom.',
    equivalentClass: 'The property that determines that two given classes are equivalent, and that is used to specify datatype definitions.',
    equivalentProperty: 'The property that determines that two given properties are equivalent.',
    hasKey: 'The property that determines the collection of properties that jointly build a key.',
    hasSelf: 'The property that determines the property that a self restriction refers to.',
    hasValue: 'The property that determines the individual that a has-value restriction refers to.',
    imports: 'The property that is used for importing other ontologies into a given ontology.',
    incompatibleWith: 'The annotation property that indicates that a given ontology is incompatible with another ontology.',
    intersectionOf: 'The property that determines the collection of classes or data ranges that build an intersection.',
    inverseOf: 'The property that determines that two given properties are inverse.',
    maxCardinality: 'The property that determines the cardinality of a maximum cardinality restriction.',
    maxQualifiedCardinality: 'The property that determines the cardinality of a maximum qualified cardinality restriction.',
    members: 'The property that determines the collection of members in either a owl:AllDifferent, owl:AllDisjointClasses or owl:AllDisjointProperties axiom.',
    minCardinality: 'The property that determines the cardinality of a minimum cardinality restriction.',
    minQualifiedCardinality: 'The property that determines the cardinality of a minimum qualified cardinality restriction.',
    onClass: 'The property that determines the class that a qualified object cardinality restriction refers to.',
    onDataRange: 'The property that determines the data range that a qualified data cardinality restriction refers to.',
    onDatatype: 'The property that determines the datatype that a datatype restriction refers to.',
    oneOf: 'The property that determines the collection of individuals or data values that build an enumeration.',
    onProperties: 'The property that determines the n-tuple of properties that a property restriction on an n-ary data range refers to.',
    onProperty: 'The property that determines the property that a property restriction refers to.',
    priorVersion: 'The annotation property that indicates the predecessor ontology of a given ontology.',
    propertyChainAxiom: 'The property that determines the n-tuple of properties that build a sub property chain of a given property.',
    propertyDisjointWith: 'The property that determines that two given properties are disjoint.',
    qualifiedCardinality: 'The property that determines the cardinality of an exact qualified cardinality restriction.',
    sameAs: 'The property that determines that two given individuals are equal.',
    someValuesFrom: 'The property that determines the class that an existential property restriction refers to.',
    sourceIndividual: 'The property that determines the subject of a negative property assertion.',
    targetIndividual: 'The property that determines the object of a negative object property assertion.',
    targetValue: 'The property that determines the value of a negative data property assertion.',
    topDataProperty: 'The data property that relates every individual to every data value.',
    topObjectProperty: 'The object property that relates every two individuals.',
    unionOf: 'The property that determines the collection of classes or data ranges that build a union.',
    versionInfo: 'The annotation property that provides version information for an ontology or another OWL construct.',
    versionIRI: 'The property that identifies the version IRI of an ontology.',
    withRestrictions: 'The property that determines the collection of facet-value pairs that define a datatype restriction.'
};

export const xsd = [
    {
        section: 'Core types',
        items: {
            string: 'Character strings (but not all Unicode character strings)',
            boolean: 'true, false',
            decimal: 'Arbitrary-precision decimal numbers',
            integer: 'Arbitrary-size integer numbers'
        }
    },
    {
        section: 'IEEE floating-point numbers',
        items: {
            double: '64-bit floating point numbers incl. ±Inf, ±0, NaN',
            float: '32-bit floating point numbers incl. ±Inf, ±0, NaN',
        }
    },
    {
        section: 'Time and date',
        items: {
            date: 'Dates (yyyy-mm-dd) with or without timezone',
            time: 'Times (hh:mm:ss.sss…) with or without timezone',
            dateTime: 'Date and time with or without timezone',
            dateTimeStamp: 'Date and time with required timezone'
        }
    },
    {
        section: 'Recurring and partial dates',
        items: {
            gYear: 'Gregorian calendar year',
            gMonth: 'Gregorian calendar month',
            gDay: 'Gregorian calendar day of the month',
            gYearMonth: 'Gregorian calendar year and month',
            gMonthDay: 'Gregorian calendar month and day',
            duration: 'Duration of time',
            yearMonthDuration: 'Duration of time (months and years only)',
            dayTimeDuration: 'Duration of time (days, hours, minutes, seconds only)',
        }
    },
    {
        section: 'Limited-range integer numbers',
        items: {
            byte: '-128 … +127 (8 bit)',
            short: '-32768 … +32767 (16 bit)',
            int: '-2147483648 … +2147483647 (32 bit)',
            long: '-9223372036854775808 … +9223372036854775807 (64 bit)',
            unsignedByte: '0 … 255 (8 bit)',
            unsignedShort: '0 … 65535 (16 bit)',
            unsignedInt: '0 … 4294967295 (32 bit)',
            unsignedLong: '0 … 18446744073709551615 (64 bit)',
            positiveInteger: 'Integer numbers > 0',
            nonNegativeInteger: 'Integer numbers ≥ 0',
            negativeInteger: 'Integer numbers < 0',
            nonPositiveInteger: 'Integer numbers ≤ 0'
        }
    },
    {
        section: 'Encoded binary data',
        items: {
            hexBinary: 'Hex-encoded binary data',
            base64Binary: 'Base64-encoded binary data'
        }
    },
    {
        section: 'Miscellaneous XSD types',
        items: {
            anyURI: 'Absolute or relative URIs and IRIs',
            language: 'Language tags per',
            normalizedString: 'Whitespace-normalized strings',
            token: 'Tokenized strings',
            NMTOKEN: 'XML NMTOKENs',
            Name: 'XML Names',
            NCName: 'XML NCNames'
        }
    }
];