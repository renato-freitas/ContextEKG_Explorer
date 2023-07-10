/**SEMANTIC WEB */
const TXT_PREFIX = "PREFIX"
const MOKG = "http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#";
export const VSKG = "http://www.arida.ufc.br/VSKG/";

export const NAMESPACES = {
  DC: "http://purl.org/dc/elements/1.1/",
  VSKG: "http://www.arida.ufc.br/VSKG/",
  SEFAZMA: "http://www.sefaz.ma.gov.br/ontology/",
  BASE: "http://www.sefaz.ma.gov.br/resource/",
  VSKGR: "http://www.arida.ufc.br/VSKG/resource/",
  META_EKG: "http://www.arida.ufc.br/meta-ekg/resource/"
}

export const ENDPOINTS = {
  DEV: {
    MOKG: "http://localhost:7200/repositories/metagraph",
    INTERFACE_MASHUP: "http://localhost:7200/repositories/INTERFACE_MASHUP",
    VSKG: "http://localhost:7200/repositories/VSKG_TULIO",
    DBPEDIA: "https://dbpedia.org/sparql",
    WIKIDATA: "https://query.wikidata.org/sparql"
  },
  PRODUCTION: {
    MOKG: "http://localhost:7200/repositories/metagraph",
    INTERFACE_MASHUP: "http://localhost:7200/repositories/INTERFACE_MASHUP",
    VSKG: "http://localhost:7200/repositories/VSKG_TULIO",
    DBPEDIA: "https://dbpedia.org/sparql",
    WIKIDATA: "https://query.wikidata.org/sparql"
  },

},
  MAIN_PREFIXIES = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX dcterms: <http://purl.org/dc/terms/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX vann: <http://purl.org/vocab/vann/>
    PREFIX mokg: <http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#>
    PREFIX vskg: <http://www.arida.ufc.br/VSKG#>
    BASE <http://www.arida.ufc.org/resource/>
    `
,
PREFIXIES_SPARQL = {
  MOKG: TXT_PREFIX + " mokg: <http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#>\n",
  VSKG: TXT_PREFIX + " vsgk: <http://www.arida.ufc.br/VSKG#>\n",
  DC: TXT_PREFIX + " dc: <http://purl.org/dc/elements/1.1/>\n",
  DCT: TXT_PREFIX + " dcterms: <http://purl.org/dc/terms/>\n",
  OWL: TXT_PREFIX + " owl: <http://www.w3.org/2002/07/owl#>\n",
  RDFS: TXT_PREFIX + " rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n",
  RDF: TXT_PREFIX + " rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n",
  FOAF: TXT_PREFIX + " foaf: <http://xmlns.com/foaf/0.1/>\n",
  DBO: TXT_PREFIX + " dbo: <http://dbpedia.org/ontology/>\n",
  VANN: TXT_PREFIX + " vann: <http://purl.org/vocab/vann/>",
  WIKIDATA_ENTITY: TXT_PREFIX + " wd: <http://www.wikidata.org/entity/>\n",
  WIKIDATA_PROPS: TXT_PREFIX + " wdt: <http://www.wikidata.org/prop/direct/>\n",
  WIKIBASE: TXT_PREFIX + " wikibase: <http://wikiba.se/ontology#>\n",
  BLAZEGRAPH_BD: TXT_PREFIX + " bd: <http://www.bigdata.com/rdf#>\n"
},

  WIKIDATA = {
    INSTANCIA_DE: "wdt:P31",
    PAIS: "wd:Q6256",
    ORGANIZATION: "wd:Q43229"
  },

  DATASOURCE_TYPES = {
    "Banco de Dados Relacional": `${VSKG}RelationalDataBase_DataSource`,
    "No-SQL": `${VSKG}NoSQL_DataSource`,
    "Triplestore": `${VSKG}Triplestore_DataSource`,
    "CSV": `${VSKG}CSV_DataSource`,
    "RDF": `${VSKG}RDF_DataSource`
  };

/**APPLICATION */
export const ROUTES = {
  HOME: "/",
  ABOUT: '/about',
  METAGRAPHS: "/metagrahs",
  METAGRAPHS_FORM: "/metagraph-form",
  ORGANIZATION_LIST: "/organizations",
  ORGANIZATION_FORM: "/organization-form",
  ORGANIZATION_DOC: "/organization-doc",

  ORGANIZATION_LIST_: "/organizations",
  ORGANIZATION_FORM_: "/organization-form",
  ORGANIZATION_DOC_: "/organization-doc",
  PERSONS: "/persons",
  USERS: "/users",
  DATASOURCE_LIST: "/datasources",
  DATASOURCE_FORM: "/datasources-form",

  DATASOURCE_LIST_: "/datasources",
  DATASOURCE_FORM_: "/datasources-form",

  TABLE_LIST: "/tables",
  TABLE_FORM: "/table-form",
  COLUMN_LIST: "/columns",
  COLUMN_FORM: "/column-form",
  TOPICS: "/topics",
  MANAGE_METAGRAPH: '/manage-metagraph',
  MANAGE_META_DATASOURCES: '/manage-meta-datasources',

  SEMANTIC_VIEW: '/semantic-view',
  LOCAL_GRAPH_CONSTRUCT: '/localgraph-construct',
  LOCAL_GRAPH_FORM: '/localgraph-form',
  EXPORTED_VIEW_LIST: '/exportedviews',
  EXPORTED_VIEW_MANAGE: '/exportedview-manage',

  MAPPINGS_LIST: '/mappings',

  TRIPLES_MAP_FORM: '/triplesmap-form',

  META_MASHUP_LIST: '/meta-mashups',
  META_MASHUP_FORM: '/meta-mashup-form',
  META_MASHUP_MANAGE: '/meta-mashup-manage',
},

  USER_TYPE = {
    ADMIN: "ADMIN",
    COLAB: "COLAB"
  },

  METADATA_GRAHP_TYPE = {
    EKG: "EKG",
    MASHUP: "Mashup"
  };

  /**Ontologia de Domínio */
export const OVSGK = {
  P_META_MASHUP_HAS_EXPORTED_VIEW: "http://www.arida.ufc.br/VSKG/hasExportedView"
}