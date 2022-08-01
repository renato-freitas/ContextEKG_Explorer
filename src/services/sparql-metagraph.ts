import axios from 'axios';
// import { ENDPOINTS, PREFIXIES_SPARQL } from "../commons/constants";
//405 - method not allowed
//415 - mime type

interface IMetagraph {
  title: string;
  creator?: string;
  created: string;
  modified: string;
}

export async function insert(data: IMetagraph) {
  try {
    const currentDate: Date = new Date();
    let query = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dcterms: <http://purl.org/dc/terms/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX mokg: <http://arida.ufc.org/metagraph#>
    INSERT DATA { 
      mokg:${data.title} a mokg:MetadataGraph ; 
        dc:title "${data.title}" ;
        dc:creator "${data.creator}" ;
        dcterms:created "${currentDate.toISOString()}" ;
        dcterms:modified "${currentDate.toISOString()}" .
    }`

    const response = await axios({
      method: 'POST',
      url: encodeURI("http://localhost:7200/repositories/metagraph/statements"),
      params: { update: query },
      headers: { 'Content-type': 'application/rdf+xml', 'Accept': 'application/json' }
    })
    
  } catch (error) {
    console.error(error)
  }
}

/**Esta função remove todas as triplas do sujeito informado */
export async function remove(title:string ) {
  try {
    console.log("title")
    console.log(title)
    const response = await axios({
      method: 'DELETE',
      url: "http://localhost:7200/repositories/metagraph/statements",
      params: { subj: `<${title}>` },
      headers: { 'Accept': 'application/json' }
    })

    // console.log(response.status)
    // return response.data.results.bindings;
  } catch (error) {
    console.error(error)
  }
}


export async function findAllMetadataGraphs() {
  try {
    let query = `PREFIX mokg: <http://arida.ufc.org/metagraph#>
      PREFIX dcterms: <http://purl.org/dc/terms/>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      SELECT * WHERE { 
          ?uri a mokg:MetadataGraph ; 
            dc:title ?title ;
            dcterms:created ?created ;
            dcterms:modified ?modified .
            OPTIONAL { ?uri dc:creator ?creator . }
        }`

    const response = await axios({
      method: 'GET',
      url: encodeURI("http://localhost:7200/repositories/metagraph"),
      params: { query }
    })

    console.log(response.data.results.bindings)
    return response.data.results.bindings;
  } catch (error) {
    console.error(error)
  }
}