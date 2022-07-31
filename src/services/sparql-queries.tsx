import { useState } from "react"
import axios from "axios"
import { PREFIXIES_SPARQL, WIKIDATA, ENDPOINTS } from '../commons/constants';

interface ElementOfRdfClass {
  value: string,
  type: string
}

export async function findAllMetadataGraphs() {
  try {
    let query = `PREFIX mokg: <http://arida.ufc.org/metagraph#>
      PREFIX dcterms: <http://purl.org/dc/terms/>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      SELECT * WHERE { 
          ?s a mokg:MetadataGraph ; 
            rdfs:label ?l ;
            dcterms:created ?c ;
            dcterms:modified ?m .
        }`

    const response = await axios({
      method: 'GET',
      url: ENDPOINTS.MOKG,
      params: { query }
    })

    //console.log(response.data.results.bindings)
    return response.data.results.bindings;
  } catch (error) {
    console.error(error)
  }
}

export async function loadCountries() {
  try {
    let query =
      PREFIXIES_SPARQL.RDFS +
      PREFIXIES_SPARQL.WIKIDATA_ENTITY +
      PREFIXIES_SPARQL.WIKIDATA_PROPS +
      `SELECT DISTINCT ?s ?label WHERE { 
          ?s ${WIKIDATA.INSTANCIA_DE} ${WIKIDATA.PAIS} .
          ?s rdfs:label ?label .
          FILTER (LANG(?label) = "pt") .
        }
        ORDER BY ?label
      `;
    // console.log(query)

    const response = await axios({
      method: 'GET',
      url: ENDPOINTS.WIKIDATA,
      params: { query }
    })

    // console.log("loadCountries::")
    // console.log(response.data.results.bindings)
    return response.data.results.bindings;
  } catch (error) {
    console.error(error)
  }
}

// export async function findOrganizations(name: string) {
//   try {
//     let query = PREFIXIES_SPARQL.RDFS +
//       PREFIXIES_SPARQL.WIKIBASE +
//       PREFIXIES_SPARQL.BLAZEGRAPH_BD +
//       `SELECT DISTINCT ?s ?l WHERE { 
//         ?item ${WIKIDATA.INSTANCIA_DE} ${WIKIDATA.ORGANIZATION} ;
//           rdfs:label ?l .
//           FILTER regex(?l, "${name}", "i")
//           SERVICE wikibase:label { bd:serviceParam wikibase:language "pt, en". } 
//       }
//       `;
//     // console.log(query)

//     const response = await axios({
//       method: 'GET',
//       url: "https://query.wikidata.org/sparql",
//       params: { query }
//     })

//     console.log(response.data.results.bindings)
//     return response.data.results.bindings;
//   } catch (error) {
//     console.error(error)
//   }
// }

export async function findOrganisationFromDBPedia(name: string) {
  try {
    const query = PREFIXIES_SPARQL.RDFS +
      `SELECT DISTINCT ?label
      WHERE {
        ?s a dbo:Organisation ;
           rdfs:label ?label .
        FILTER (LANG(?label) = "pt")
        FILTER regex(?label, "${name}", "i")
      }
      LIMIT 50`;

    const response = await axios({
      method: 'GET',
      url: ENDPOINTS.DBPEDIA,
      params: { query }
    })

    //console.log(response.data.results.bindings)
    return response.data.results.bindings;
  } catch (error) {
    console.error(error)
  }
}


export async function getComment(label: String) {
  try {
    const query = PREFIXIES_SPARQL.RDFS +
      `SELECT DISTINCT ?comment
      WHERE {
        ?s a dbo:Organisation ;
           rdfs:label "${label}" ;
           rdfs:comment .
        FILTER (LANG(?label) = "pt")
      }
      LIMIT 1`;

    const response = await axios({
      method: 'GET',
      url: ENDPOINTS.DBPEDIA,
      params: { query }
    })

    //console.log(response.data.results.bindings)
    return response.data.results.bindings;
  } catch (error) {
    console.error(error)
  }
}

