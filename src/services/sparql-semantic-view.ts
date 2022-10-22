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
  return created;
}

export async function updateSemanticView(data: ISemanticViewForm) {
  console.log(`*** API UPDATE SV: `, data.belongsTo)
  const currentDate: Date = new Date();
  let query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX dcterms: <http://purl.org/dc/terms/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX mokg: <http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#>
    BASE <http://www.arida.ufc.org/resource/>
    DELETE { 
      mokg:${data.identifier} a mokg:SemanticView ; 
        dc:identifier ?i ;
        rdfs:label ?l ;
        foaf:page ?p;
        dcterms:created ?cre ;
        dcterms:modified ?m ;
        mokg:belongsTo mokg:${data.belongsTo}.
      mokg:${data.belongsTo} mokg:hasSemanticMetadada mokg:${data.identifier}.
    }
    INSERT { 
      mokg:${data.identifier} a mokg:SemanticView ; 
        dc:identifier "${data.identifier}" ;
        rdfs:label "${data.label}" ;
        foaf:page "${data.page}";
        dcterms:created "${data.created}" ;
        dcterms:modified "${currentDate.toISOString()}" ;
        mokg:belongsTo mokg:${data.belongsTo}.
      mokg:${data.belongsTo} mokg:hasSemanticMetadada mokg:${data.identifier}.
    }
    WHERE { 
      mokg:${data.identifier} a mokg:SemanticView ; 
        dc:identifier ?i ;
        rdfs:label ?l ;
        foaf:page ?p;
        dcterms:created ?cre ;
        dcterms:modified ?m ;
        mokg:belongsTo mokg:${data.belongsTo}.
      mokg:${data.belongsTo} mokg:hasSemanticMetadada mokg:${data.identifier}.
    }`

  return await axios({
    method: 'POST',
    url: encodeURI("http://localhost:7200/repositories/metagraph/statements"),
    params: { update: query },
    headers: { 'Content-type': 'application/rdf+xml', 'Accept': 'application/json' }
  });
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