/**SEMANTIC WEB */
const TXT_PREFIX = "PREFIX"
const MOKG = "http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#";

export const ENDPOINTS = {
  MOKG: "http://localhost:7200/repositories/metagraph",
  DBPEDIA: "https://dbpedia.org/sparql",
  WIKIDATA: "https://query.wikidata.org/sparql"
},

  PREFIXIES_SPARQL = {
    MOKG: TXT_PREFIX + " mokg: <http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#>\n",
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
    "Banco de Dados Relacional": `${MOKG}RelationalDataBase_DataSource`,
    "No-SQL": `${MOKG}NoSQL_DataSource`,
    "Triplestore": `${MOKG}Triplestore_DataSource`,
    "CSV": `${MOKG}CSV_DataSource`,
    "RDF": `${MOKG}RDF_DataSource`
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
  LOCAL_GRAPH_LIST: '/localgraphs',
},

  USER_TYPE = {
    ADMIN: "ADMIN",
    COLAB: "COLAB"
  };