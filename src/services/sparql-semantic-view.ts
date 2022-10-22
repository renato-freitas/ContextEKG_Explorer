import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export interface ISemanticViewForm {
  identifier: string;
  label: string;
  page: string;
  created: string;
  modified: string;
  belongsTo: string;
}

/**Criar a Camada Semântica do EKG */
export async function addSemanticView(data: ISemanticViewForm) {
  const uuid = uuidv4();
  const currentDate: Date = new Date();

  let query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX dcterms: <http://purl.org/dc/terms/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX mokg: <http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#>
    INSERT DATA { 
      mokg:${uuid} a mokg:SemanticView ; 
        dc:identifier "${uuid}" ;
        rdfs:label "${data.label}" ;
        foaf:page "${data.page}";
        dcterms:created "${currentDate.toISOString()}" ;
        dcterms:modified "${currentDate.toISOString()}" ;
        mokg:belongsTo mokg:${data.belongsTo}.
      mokg:${data.belongsTo} mokg:hasSemanticMetadada mokg:${uuid}.
    }`

  await axios({
    method: 'POST',
    url: encodeURI("http://localhost:7200/repositories/metagraph/statements"),
    params: { update: query },
    headers: { 'Content-type': 'application/rdf+xml', 'Accept': 'application/json' }
  })

  const created = await findOneSemanticView(uuid);
  return created[0];
}

/**Esta função retornar um recuros com o ID informado no parâmetro*/
export async function findOneSemanticView(identifier: string) {
  try {
    let query = `PREFIX mokg: <http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      PREFIX dcterms: <http://purl.org/dc/terms/>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      SELECT * WHERE { 
        ?uri a mokg:SemanticView ; 
          dc:identifier "${identifier}" ;
          dc:identifier ?identifier ;
          rdfs:label ?label ;
          foaf:page ?webpage ;
          mokg:belongsTo ?belongsTo .
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