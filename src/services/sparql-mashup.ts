import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ENDPOINTS, MAIN_PREFIXIES } from '../commons/constants';
import { EkgTulioEntity } from '../models/EkgTulioEntity';
// import { ENDPOINTS, PREFIXIES_SPARQL } from "../commons/constants";
//405 - method not allowed
//415 - mime type

interface IKG_MetadataForm {
  kg_metadata: object;
}

/**Descreve qual ekg o mashup especializa */
export async function add_gk_metadados_on_mashup(kg_metadata: EkgTulioEntity, mashup_uri: string) {
  console.log(kg_metadata)
  console.log(kg_metadata.uri.value)
  console.log(kg_metadata.label.value)

  let query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX dcterms: <http://purl.org/dc/terms/>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      PREFIX mokg: <http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#>
      PREFIX vskg: <http://www.arida.ufc.br/VSKG#>
      BASE <http://www.arida.ufc.org/resource/>
      INSERT DATA { 
          <${mashup_uri}> mokg:specializationOf  <${kg_metadata.uri.value}>.
      }`

  return await axios({
    method: 'POST',
    url: encodeURI(`${ENDPOINTS.DEV.MOKG}/statements`),
    params: { update: query },
    headers: { 'Content-type': 'application/rdf+xml', 'Accept': 'application/json' }
  })
}


export async function findSpecificatedEKG(identifier: string) {
  try {
    let query = `${MAIN_PREFIXIES}
      SELECT * WHERE { 
        ?uri a mokg:SemanticView ; 
          dc:identifier "${identifier}" ;
          dc:identifier ?identifier ;
          rdfs:label ?label ;
          foaf:page ?page ;
          dcterms:created ?created ;
          dcterms:modified ?modifier;
          mokg:belongsTo ?belongsTo .
      }
      limit 1
      `
    // console.log(`identifier: ${identifier}`)
      // mokg:${data.belongsTo} mokg:hasSemanticMetadada mokg:${uuid}.

    const response = await axios({
      method: 'GET',
      url: encodeURI("http://localhost:7200/repositories/metagraph"),
      params: { query }
    });

    return response.data.results.bindings[0];
  } catch (error) {
    console.error(error)
  }
}