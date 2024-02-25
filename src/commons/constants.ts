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
    WIKIDATA: "https://query.wikidata.org/sparql",
    OD_EKG_SEFAZMA: "http://localhost:7200/repositories/ONTOLOGIA_DOMINIO",
    GRAFOS_PRODUCAO: "http://localhost:7200/repositories/GRAFO_PRODUCAO_MATERIALIZADO",
  },
  PRODUCTION: {
    MOKG: "http://localhost:7200/repositories/metagraph",
    INTERFACE_MASHUP: "http://localhost:7200/repositories/INTERFACE_MASHUP",
    VSKG: "http://localhost:7200/repositories/VSKG_TULIO",
    DBPEDIA: "https://dbpedia.org/sparql",
    WIKIDATA: "https://query.wikidata.org/sparql"
  },

}

export const MAIN_PREFIXIES = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX dcterms: <http://purl.org/dc/terms/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX vann: <http://purl.org/vocab/vann/>
    PREFIX mokg: <http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#>
    PREFIX vskg: <http://www.arida.ufc.br/VSKG#>
    BASE <http://www.arida.ufc.org/resource/>
    `
  
export const PREFIXIES_SPARQL = {
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
  }

export const WIKIDATA = {
    INSTANCIA_DE: "wdt:P31",
    PAIS: "wd:Q6256",
    ORGANIZATION: "wd:Q43229"
  }

  // A list with URIs of highlighted classes
export const HIGHLIGHT_CLASSES = [
    'http://xmlns.com/foaf/0.1/Organization',
    'http://www.sefaz.ma.gov.br/ontology/Estabelecimento',
    'http://xmlns.com/foaf/0.1/Person',
    'http://www.sefaz.ma.gov.br/ontology/Sociedade']





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
  NAVIGATION: "/classes",
  RESOURCES: "/resources",
  PROPERTIES: "/properties",
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
  META_MASHUP_SPARQP_QUERY_PARAMS_FORM: '/meta-mashup/sparql-query-params',
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
export const VSKG_TBOX = {
  CLASS: {
    RELATIONAL_DATABASE: "http://rdbs-o#Relational_Database",
    CSV_FILE: "https://www.ntnu.no/ub/ontologies/csv#CsvDocument"
  },
  P_META_MASHUP_HAS_EXPORTED_VIEW: "http://www.arida.ufc.br/VSKG#hasExportedView"
}

export const DATASOURCE_TYPES = {
  // "Banco de Dados Relacional": `${VSKG}RelationalDataBase_DataSource`,
  "Banco de Dados Relacional": VSKG_TBOX.CLASS.RELATIONAL_DATABASE,
  // "No-SQL": `${VSKG}NoSQL_DataSource`,
  // "Triplestore": `${VSKG}Triplestore_DataSource`,
  "CSV": VSKG_TBOX.CLASS.CSV_FILE,
  // "RDF": `${VSKG}RDF_DataSource`
}

export const FONTE_PRINCIPAL = "http://www.sefaz.ma.gov.br/resource/Cadastro_SEFAZ-MA"
export let APP_HIGIENIZACAO = {
  Estabelecimento: "http://www.sefaz.ma.gov.br/resource/AppEndereco/Estabelecimento"
}