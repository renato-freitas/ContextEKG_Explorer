import axios from 'axios';
import { ENDPOINTS, MAIN_PREFIXIES, PREFIXIES_SPARQL } from '../commons/constants';
import { double_encode_uri, printt } from '../commons/utils';


/**Função para obter as classes da ontologia de domínio */
export async function findClasses() {
  try {
    const PREFIXIES = PREFIXIES_SPARQL.OWL + PREFIXIES_SPARQL.RDFS
    const query = `${PREFIXIES} SELECT ?class ?label (MAX(?c) as ?comment) ?subclass WHERE { 
      {
        ?class a owl:Class.
      }
      UNION
      {
        ?class a rdfs:Class.
      }
      OPTIONAL{
        ?subclass rdfs:subClassOf ?class.
      }
      OPTIONAL{
        ?class rdfs:label ?l.
        FILTER(lang(?l)="pt")
      }
      OPTIONAL{
        ?class rdfs:comment ?c1.
        FILTER(lang(?c1)="pt")
      }
      BIND(COALESCE(?l,?class) AS ?label)
      BIND(COALESCE(?c1,"") AS ?c)
      FILTER(!CONTAINS(STR(?class),"http://www.w3.org/2000/01/rdf-schema#"))
      FILTER(!CONTAINS(STR(?class),"http://www.w3.org/2001/XMLSchema#"))
      FILTER(!CONTAINS(STR(?class),"http://www.w3.org/1999/02/22-rdf-syntax-ns#"))
      FILTER(!CONTAINS(STR(?class),"http://www.w3.org/2002/07/owl#"))
    }
    GROUP BY ?class ?label ?subclass
    ORDER BY ?label
  `
    const response = await axios({
      method: 'GET',
      url: encodeURI(ENDPOINTS.DEV.OD_EKG_SEFAZMA),
      params: { query },
    })

    return response.data.results.bindings;
    // return "response.data.results.bindings";
  } catch (error) {
    console.log(`error in findClasses()`, error)
  }
}


/**Função para obter os recursos do tipo da classes da ontologia de domínio selecionada */
export async function findResources(page: number, classRDF: string, USE_LABELS = true) {
  try {
    let offset = page * 50

    let query = ""
    let label_query = ""
    let filterSearch = ""
    if (USE_LABELS) {
      label_query = `OPTIONAL{
        ?resource rdfs:label ?l.
      } `
    }
    // if (search && search != '') {
    //   filterSearch = `FILTER(REGEX(STR(?resource),"{ search } ","i") || REGEX(STR(?label),"{ search } ","i"))`
    // }
    if (classRDF && classRDF != '') {
      query = `
        prefix owl: <http://www.w3.org/2002/07/owl#>
        prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        select ?resource ?label where {
          ?resource a <${classRDF}>.
          ${label_query}
          BIND(COALESCE(?l,?resource) AS ?label)
        }
        LIMIT 50
        OFFSET ${offset}
    `
    }
    // else {
    //   query = `
    //     prefix owl: <http://www.w3.org/2002/07/owl#>
    //     prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    //     select ?resource ?label where {
    //       ?resource ?p _:x2.
    //       ${label_query}
    //       BIND(COALESCE(?l, ?resource) AS ?label)
    //       ${filterSearch}
    //   }
    //   LIMIT 100
    //   OFFSET { offset }
    // `
    // }
    printt(``, query)
    const response = await axios({
      method: 'GET',
      url: encodeURI(ENDPOINTS.DEV.GRAFOS_PRODUCAO),
      params: { query },
    })

    return response.data.results.bindings;
    // return "response.data.results.bindings";
  } catch (error) {
    console.log(`error in findClasses()`, error)
  }
}
