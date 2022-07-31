import axios from 'axios';
import { ENDPOINTS, PREFIXIES_SPARQL } from "../commons/constants";

interface IMetagraph {
  name: string;
  label: string;
}
export async function insert(data: IMetagraph) {
  try {
    const currentDate: Date = new Date();
    console.log(currentDate.toISOString())
    let query = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dcterms: <http://purl.org/dc/terms/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX mokg: <http://arida.ufc.org/metagraph#>
    INSERT DATA { 
      mokg:${data.name} a mokg:MetadataGraph ; 
        rdfs:label "${data.label || data.name}" ;
        dcterms:created "${currentDate.toISOString()}" ;
        dcterms:modified "${currentDate.toISOString()}" .
    }`

    let q = `PREFIX mokg: <http://arida.ufc.org/metagraph#>     INSERT DATA {  mokg:${data.name} a mokg:MetadataGraph . }`

    //405 metohd not allowed
    //415 mime type
    const response = await axios({
      method: 'POST',
      url: encodeURI("http://localhost:7200/repositories/metagraph/statements"),
      params: { update: query },
      headers: { 'Content-type': 'application/rdf+xml', 'Accept': 'application/json' }
    })

    console.log(response.status)
    // return response.data.results.bindings;
  } catch (error) {
    console.error(error)
  }
}