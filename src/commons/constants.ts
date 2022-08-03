/**SEMANTIC WEB */
const TXT_PREFIX = "PREFIX"

export const ENDPOINTS = {
  MOKG: "http://localhost:7200/repositories/metagraph",
  DBPEDIA: "https://dbpedia.org/sparql",
  WIKIDATA: "https://query.wikidata.org/sparql"
},

  PREFIXIES_SPARQL = {
    MOKG: TXT_PREFIX + " mokg: <http://arida.ufc.org/metagraph#>\n",
    DC: TXT_PREFIX + " dc: <http://purl.org/dc/elements/1.1/>\n",
    DCT: TXT_PREFIX + " dcterms: <http://purl.org/dc/terms/>\n",
    OWL: TXT_PREFIX + " owl: <http://www.w3.org/2002/07/owl#>\n",
    RDFS: TXT_PREFIX + " rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n",
    RDF: TXT_PREFIX + " rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n",
    FOAF: TXT_PREFIX + " foaf: <http://xmlns.com/foaf/0.1/>\n",
    DBO: TXT_PREFIX + " dbo: <http://dbpedia.org/ontology/>\n",
    WIKIDATA_ENTITY: TXT_PREFIX + " wd: <http://www.wikidata.org/entity/>\n",
    WIKIDATA_PROPS: TXT_PREFIX + " wdt: <http://www.wikidata.org/prop/direct/>\n",
    WIKIBASE: TXT_PREFIX + " wikibase: <http://wikiba.se/ontology#>\n",
    BLAZEGRAPH_BD: TXT_PREFIX + " bd: <http://www.bigdata.com/rdf#>\n"
  },

  WIKIDATA = {
    INSTANCIA_DE: "wdt:P31",
    PAIS: "wd:Q6256",
    ORGANIZATION: "wd:Q43229"
  };

/**APPLICATION */
export const ROUTES = {
  HOME: "/",
  ABOUT: '/about',
  METAGRAPHS: "/metagrahs",
  METAGRAPHS_FORM: "/metagraph-form",
  ORGANIZATIONS: "/organizations",
  PERSONS: "/persons",
  USERS: "/users",
  DATASOURCES: "/datasources",
  TOPICS: "/topics",
  MANAGE_METAGRAPH: '/manage-metagraph'
},

  USER_TYPE = {
    ADMIN: "ADMIN",
    COLAB: "COLAB"
  };