import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ENDPOINTS, MAIN_PREFIXIES } from '../commons/constants';
// import { ENDPOINTS, PREFIXIES_SPARQL } from "../commons/constants";
//405 - method not allowed
//415 - mime type

export interface IMetadataGraphForm {
  uri: string;
  identifier: string;
  title: string;
  label: string;
  description: string;
  creator: string;
  created: string;
  modified: string;
  semanticView?: string;
  type: string;
}



export async function addtMetadataGraph(data: IMetadataGraphForm) {
  const uuid = uuidv4();
  const currentDate: Date = new Date();

  let query = `${MAIN_PREFIXIES}
      INSERT DATA { 
          mokg:${uuid} rdf:type mokg:MetadataGraph, mokg:${data.type} ; 
          rdfs:label '${data.title}' ;
          dc:identifier '${uuid}' ;
          dc:title '${data.title}' ;
          dc:creator '${data.creator}' ;
          dcterms:created '${currentDate.toISOString()}' ;
          dcterms:modified '${currentDate.toISOString()}' .
      }`

  return await axios({
    method: 'POST',
    url: encodeURI(`${ENDPOINTS.DEV.MOKG}/statements`),
    params: { update: query },
    headers: { 'Content-type': 'application/rdf+xml', 'Accept': 'application/json' }
  })
}

export async function updateMetadataGraph(data: IMetadataGraphForm) {
  const currentDate: Date = new Date();
  let query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dcterms: <http://purl.org/dc/terms/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX mokg: <http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#>
    BASE <http://www.arida.ufc.org/resource/>
    DELETE { 
      mokg:${data.identifier} rdf:type mokg:MetadataGraph, mokg:${data.type} ; 
        rdfs:label ?l ;
        dc:identifier ?i ;
        dc:title ?t ;
        rdfs:comment ?c ;
        dc:creator ?cr ;
        dcterms:created ?cre ;
        dcterms:modified ?m .
    }
    INSERT { 
      mokg:${data.identifier} rdf:type mokg:MetadataGraph, mokg:${data.type} ; 
        rdfs:label "${data.title}" ;
        dc:identifier "${data.identifier}" ;
        dc:title "${data.title}" ;
        dc:creator "${data.creator}" ;
        dcterms:created "${data.created}" ;
        dcterms:modified "${currentDate.toISOString()}" .
    }
    WHERE { 
      mokg:${data.identifier} rdf:type mokg:MetadataGraph, mokg:${data.type} ; 
        rdfs:label ?l ;
        dc:identifier ?i ;
        dc:title ?t ;
        rdfs:comment ?c ;
        dc:creator ?cr ;
        dcterms:created ?cre ;
        dcterms:modified ?m .
    }`

  return await axios({
    method: 'POST',
    url: encodeURI(`${ENDPOINTS.DEV.MOKG}/statements`),
    params: { update: query },
    headers: { 'Content-type': 'application/rdf+xml', 'Accept': 'application/json' }
  });
}


/**Esta função remove todas as triplas do sujeito informado 
 * NÃO ESTÁ EXCLUIR NO GRAPHDB EXPLORAÇÃO
*/
export async function removeMetadataGraph(identifier: string, type: string) {
  try {
    let query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dcterms: <http://purl.org/dc/terms/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX mokg: <http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#>
    BASE <http://www.arida.ufc.org/resource/>
    DELETE { 
      mokg:${identifier} rdf:type mokg:MetadataGraph, mokg:${type} ; 
        rdfs:label ?l ;
        dc:identifier ?i ;
        dc:title ?t ;
        rdfs:comment ?c ;
        dc:creator ?cr ;
        dcterms:created ?cre ;
        dcterms:modified ?m .
    }
    WHERE { 
      mokg:${identifier} rdf:type mokg:MetadataGraph, mokg:${type} ; 
        rdfs:label ?l ;
        dc:identifier ?i ;
        dc:title ?t ;
        rdfs:comment ?c ;
        dc:creator ?cr ;
        dcterms:created ?cre ;
        dcterms:modified ?m .
    }`

  return await axios({
    method: 'POST',
    url: encodeURI(`${ENDPOINTS.DEV.MOKG}/statements`),
    params: { update: query },
    headers: { 'Content-type': 'application/rdf+xml', 'Accept': 'application/json' }
  });
  } catch (error) {
    console.error(error)
  }
}
// export async function removeMetadataGraph(identifier: string) {
//   try {
//     const response = await axios({
//       method: 'DELETE',
//       url: "http://localhost:7200/repositories/metagraph/statements",
//       params: { pred: '<http://purl.org/dc/elements/1.1/identifier>', obj: `"${identifier}"` },
//       headers: { 'Accept': 'application/json' }
//     })
//   } catch (error) {
//     console.error(error)
//   }
// }


// export async function findAllMetadataGraphs(type: string) {
//   try {
//     let query = `PREFIX mokg: <http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#>
//       PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
//       PREFIX dcterms: <http://purl.org/dc/terms/>
//       PREFIX dc: <http://purl.org/dc/elements/1.1/>
//       SELECT * WHERE { 
//           ?uri a mokg:MetadataGraph, mokg:${type} ; 
//             dc:identifier ?identifier ;
//             rdfs:label ?label ;
//             dc:title ?title ;
//             dcterms:created ?created ;
//             dcterms:modified ?modified .
//             OPTIONAL { ?uri dc:creator ?creator . }
//             OPTIONAL { ?uri rdfs:comment ?comment . }
//             OPTIONAL { ?uri mokg:hasSemanticMetadada ?semanticView . }
//             OPTIONAL { ?uri mokg:specializationOf ?kg_metadata . }
//           }`

//     const response = await axios({
//       method: 'GET',
//       url: encodeURI(`${ENDPOINTS.DEV.MOKG}`),
//       params: { query }
//     })

//     // console.log(response.data.results.bindings)
//     return response.data.results.bindings;
//   } catch (error) {
//     console.error(error)
//   }
// }



/**Esta função retornar a uri do GM a partir do título*/
// export async function findOneMetadataGraphByIdentifier(uuid: string) {
//   console.log(`*** Verificando se já existe a URI que quer criar`)
//   try {
//     let query = `PREFIX mokg: <http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#>
//       PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
//       PREFIX foaf: <http://xmlns.com/foaf/0.1/>
//       PREFIX dcterms: <http://purl.org/dc/terms/>
//       PREFIX dc: <http://purl.org/dc/elements/1.1/>
//       BASE <http://www.arida.ufc.org/resource/>
//       SELECT * WHERE { 
//         ?uri a mokg:MetadataGraph .
//         mokg:${uuid} ?p ?o .
//       }
//       limit 1
//       `
//     const response = await axios({
//       method: 'GET',
//       url: encodeURI(`${ENDPOINTS.DEV.MOKG}`),
//       params: { query }
//     });

//     return response.data.results.bindings;
//   } catch (error) {
//     console.error(error)
//   }
// }