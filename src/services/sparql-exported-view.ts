import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ENDPOINTS, MAIN_PREFIXIES } from '../commons/constants';
import { SemanticViewEntity } from '../models/SemanticViewEntity';
import { ISemanticViewForm } from './sparql-semantic-view';

export interface IExportedViewForm {
  identifier: string;
  title: string;
  label: string;
  comment: string;
  created: string;
  modified: string;
  prefix: string,
  belongsTo: string
}

/**Criar um Grafo Local na Visão Semântica no EKG */
export async function addExportedView(data: IExportedViewForm) {
  const uuid = uuidv4();
  const currentDate: Date = new Date();

  let query = `${MAIN_PREFIXIES}
    INSERT DATA { 
      mokg:${uuid} a vskg:ExportedView ; 
        dc:identifier "${uuid}" ;
        rdfs:label "${data.title}" ;
        dc:title "${data.title}" ;
        rdfs:comment "${data.comment}" ;
        vann:preferredNamespacePrefix "${data.prefix}" ;
        dcterms:created "${currentDate.toISOString()}" ;
        dcterms:modified "${currentDate.toISOString()}" ;
        mokg:belgonsTo mokg:${uuid}.
      mokg:${data.belongsTo} vskg:hasExportedView mokg:${uuid}.
    }`

  await axios({
    method: 'POST',
    url: encodeURI(`${ENDPOINTS.DEV.MOKG}/statements`),
    params: { update: query },
    headers: { 'Content-type': 'application/rdf+xml', 'Accept': 'application/json' }
  })

  const created = await findOneLocalGraph(uuid);
  return created[0];
}

/**Todo GCL pertence a uma visão semântica */
export async function findAllLocalGraphsBySemanticView(semanticView: SemanticViewEntity) {
  let query = `${MAIN_PREFIXIES}
      SELECT * WHERE { 
          ?uri a vskg:ExportedView ; 
            dc:identifier ?identifier ;
            dc:title ?title ;
            rdfs:label ?label ;
            dcterms:created ?created ;
            dcterms:modified ?modified .
            OPTIONAL { ?uri vann:preferredNamespacePrefix ?prefix . }
            OPTIONAL { ?uri dc:creator ?creator . }
            OPTIONAL { ?uri rdfs:comment ?comment . }
            OPTIONAL { ?uri foaf:page ?comment . }
            OPTIONAL { ?uri mokg:belongsTo ${semanticView.identifier.value} . }
          }`

  const response = await axios({
    method: 'GET',
    url: encodeURI(`${ENDPOINTS.DEV.MOKG}`),
    params: { query }
  })

  return response.data.results.bindings;
}

export async function findAllExportedViews() {
  let query = `${MAIN_PREFIXIES}
      SELECT * WHERE { 
          ?uri a vskg:ExportedView ; 
            dc:identifier ?identifier ;
            dc:title ?title ;
            rdfs:label ?label ;
            dcterms:created ?created ;
            dcterms:modified ?modified .
            OPTIONAL { ?uri vann:preferredNamespacePrefix ?prefix . }
            OPTIONAL { ?uri dc:creator ?creator . }
            OPTIONAL { ?uri rdfs:comment ?comment . }
            OPTIONAL { ?uri foaf:page ?comment . }
            OPTIONAL { ?uri mokg:belongsTo ?belonsTo . }
          }`

  const response = await axios({
    method: 'GET',
    url: encodeURI("http://localhost:7200/repositories/metagraph"),
    params: { query }
  })

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