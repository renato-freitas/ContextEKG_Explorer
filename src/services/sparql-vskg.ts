import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ENDPOINTS } from '../commons/constants';


/**KG do grafo de metadado do Tulio */
export async function findAllKGOfMetadata() {
  try {
    let query = `PREFIX mokg: <http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX dcterms: <http://purl.org/dc/terms/>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      PREFIX vskg: <http://www.arida.ufc.br/VSKG#>
      SELECT * WHERE { 
          ?uri a vskg:Metadata_Graph ;
          rdfs:label ?label.
      }`

    const response = await axios({
      method: 'GET',
      url: encodeURI(`${ENDPOINTS.DEV.VSKG}`),
      params: { query }
    })

    // console.log(response.data.results.bindings)
    return response.data.results.bindings;
  } catch (error) {
    console.error(error)
  }
}