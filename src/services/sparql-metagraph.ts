import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
// import { ENDPOINTS, PREFIXIES_SPARQL } from "../commons/constants";
//405 - method not allowed
//415 - mime type

interface IFormInput {
  uri: string;
  identifier: string;
  title: string;
  comment: string;
  creator: string;
  created: string;
  modified: string;
}

export async function insert(data: IFormInput) {
  try {
    const uuid = uuidv4();
    const currentDate: Date = new Date();
    const uri = data.title.replace(/ /g, "_");

    let query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dcterms: <http://purl.org/dc/terms/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX mokg: <http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#>
    INSERT DATA { 
      mokg:${uri} rdf:type mokg:MetadataGraph ; 
        rdfs:label '${data.title}' ;
        dc:identifier '${uuid}' ;
        dc:title '${data.title}' ;
        rdfs:comment "${data.comment}" ;
        dc:creator '${data.creator}' ;
        dcterms:created '${currentDate.toISOString()}' ;
        dcterms:modified '${currentDate.toISOString()}' .
    }`

    return await axios({
      method: 'POST',
      url: encodeURI("http://localhost:7200/repositories/metagraph/statements"),
      params: { update: query },
      headers: { 'Content-type': 'application/rdf+xml', 'Accept': 'application/json' }
    })

  } catch (error) {
    console.error(error)
  }
}

export async function update(data: IFormInput) {
  try {
    const uri = data.title.replace(/ /g, "_");
    const currentDate: Date = new Date();
    let query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dcterms: <http://purl.org/dc/terms/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX mokg: <http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#>
    DELETE { 
      ?s dc:identifier "${data.identifier}" ;
       dcterms:created "${data.created}" .
    }
    INSERT { 
      mokg:${uri} rdf:type mokg:MetadataGraph ; 
        rdfs:label "${data.title}" ;
        dc:identifier "${data.identifier}" ;
        dc:title "${data.title}" ;
        rdfs:comment "${data.comment}" ;
        dc:creator "${data.creator}" ;
        dcterms:created "${data.created}" ;
        dcterms:modified "${currentDate.toISOString()}" .
    }
    WHERE { 
      ?s dc:identifier "${data.identifier}" ;
        dcterms:created "${data.created}" .
    }`

    return await axios({
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
export async function remove(identifier: string) {
  try {
    console.log("identifier")
    console.log(identifier)
    const response = await axios({
      method: 'DELETE',
      url: "http://localhost:7200/repositories/metagraph/statements",
      params: { pred: '<http://purl.org/dc/elements/1.1/identifier>', obj: `"${identifier}"` },
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
    let query = `PREFIX mokg: <http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX dcterms: <http://purl.org/dc/terms/>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      SELECT * WHERE { 
          ?uri a mokg:MetadataGraph ; 
            dc:identifier ?identifier ;
            dc:title ?title ;
            dcterms:created ?created ;
            dcterms:modified ?modified .
            OPTIONAL { ?uri dc:creator ?creator . }
            OPTIONAL { ?uri rdfs:comment ?comment . }
          }`
          
    const response = await axios({
      method: 'GET',
      url: encodeURI("http://localhost:7200/repositories/metagraph"),
      params: { query }
    })

    // console.log(response.data.results.bindings)
    return response.data.results.bindings;
  } catch (error) {
    console.error(error)
  }
}