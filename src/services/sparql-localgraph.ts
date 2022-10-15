import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export interface ILocalGraphForm {
  identifier: string;
  title: string;
  label: string;
  comment: string;
  created: string;
  modified: string;
  prefix: string
}

/**Criar um Grafo Local na Visão Semântica no EKG */
export async function addLocalGraph(data: ILocalGraphForm) {
  const uuid = uuidv4();
  const currentDate: Date = new Date();
  // const uri = data.title.replace(/ /g, "_");

  let query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX dcterms: <http://purl.org/dc/terms/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX vann: <http://purl.org/vocab/vann/>
    PREFIX mokg: <http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#>
    INSERT DATA { 
      mokg:${uuid} a mokg:LocalGraph ; 
        dc:identifier "${uuid}" ;
        rdfs:label "${data.title}" ;
        dc:title "${data.title}" ;
        rdfs:comment "${data.comment}" ;
        vann:preferredNamespacePrefix "${data.prefix}" ;
        dcterms:created "${currentDate.toISOString()}" ;
        dcterms:modified "${currentDate.toISOString()}" .
    }`

  await axios({
    method: 'POST',
    url: encodeURI("http://localhost:7200/repositories/metagraph/statements"),
    params: { update: query },
    headers: { 'Content-type': 'application/rdf+xml', 'Accept': 'application/json' }
  })

  const created = await findOneLocalGraph(uuid);
  return created[0];
}

export async function findAllLocalGraphs() {
  let query = `PREFIX mokg: <http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      PREFIX dcterms: <http://purl.org/dc/terms/>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      PREFIX vann: <http://purl.org/vocab/vann/>
      SELECT * WHERE { 
          ?uri a mokg:LocalGraph ; 
            dc:identifier ?identifier ;
            dc:title ?title ;
            rdfs:label ?label ;
            dcterms:created ?created ;
            dcterms:modified ?modified .
            OPTIONAL { ?uri vann:preferredNamespacePrefix ?prefix . }
            OPTIONAL { ?uri dc:creator ?creator . }
            OPTIONAL { ?uri rdfs:comment ?comment . }
            OPTIONAL { ?uri foaf:page ?comment . }
          }`

  const response = await axios({
    method: 'GET',
    url: encodeURI("http://localhost:7200/repositories/metagraph"),
    params: { query }
  })

  console.log(response.data.results.bindings)
  return response.data.results.bindings;
}

/**Esta função retornar um recuros com o ID informado no parâmetro*/
export async function findOneLocalGraph(identifier: string) {
  try {
    let query = `PREFIX mokg: <http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      PREFIX dcterms: <http://purl.org/dc/terms/>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      SELECT * WHERE { 
        ?uri a sfz:LocalGraph ; 
          dc:identifier "${identifier}" .
      }
      limit 1
      `
    console.log(`identifier: ${identifier}`)

    const response = await axios({
      method: 'GET',
      url: encodeURI("http://localhost:7200/repositories/metagraph"),
      params: { query }
    });

    return response.data.results.bindings;
  } catch (error) {
    console.error(error)
  }
}