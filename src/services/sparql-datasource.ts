import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export interface IFormInput {
  // uri: string;
  identifier: string;
  title: string;
  // comment: string;
  // page: string;
  // creator: string;
  created: string;
  modified: string;
}

/**Criar uma fonte de dados no GM */
export async function insert(data: IFormInput) {
  const uuid = uuidv4();
  const currentDate: Date = new Date();
  const uri = data.title.replace(/ /g, "_");

  let query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX dcterms: <http://purl.org/dc/terms/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX mokg: <http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#>
    INSERT DATA { 
      mokg:${uri} a mokg:DataSource ; 
        rdfs:label '${data.title}' ;
        dc:identifier '${uuid}' ;
        dc:title '${data.title}' ;
        dcterms:created '${currentDate.toISOString()}' ;
        dcterms:modified '${currentDate.toISOString()}' .
    }`

  // rdfs:comment "${data.comment}" ;
  // foaf:page "${data.page}" ;
  // dc:creator '${data.creator}' ;

  await axios({
    method: 'POST',
    url: encodeURI("http://localhost:7200/repositories/metagraph/statements"),
    params: { update: query },
    headers: { 'Content-type': 'application/rdf+xml', 'Accept': 'application/json' }
  })

  const created = await findOne(uuid);
  return created[0];
}

// export async function update(data: IFormInput) {
//   try {
//     const uri = data.title.replace(/ /g, "_");
//     const currentDate: Date = new Date();
//     let query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
//     PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
//     PREFIX foaf: <http://xmlns.com/foaf/0.1/>
//     PREFIX dcterms: <http://purl.org/dc/terms/>
//     PREFIX dc: <http://purl.org/dc/elements/1.1/>
//     PREFIX mokg: <http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#>
//     DELETE { 
//       ?s dc:identifier "${data.identifier}" ;
//        dcterms:created "${data.created}" .
//     }
//     INSERT { 
//       mokg:${uri} rdf:type mokg:MetadataGraph ; 
//         rdfs:label "${data.title}" ;
//         dc:identifier "${data.identifier}" ;
//         dc:title "${data.title}" ;
//         rdfs:comment "${data.comment}" ;
//         dc:creator "${data.creator}" ;
//         dcterms:created "${data.created}" ;
//         dcterms:modified "${currentDate.toISOString()}" .
//     }
//     WHERE { 
//       ?s dc:identifier "${data.identifier}" ;
//         dcterms:created "${data.created}" .
//     }`

//     return await axios({
//       method: 'POST',
//       url: encodeURI("http://localhost:7200/repositories/metagraph/statements"),
//       params: { update: query },
//       headers: { 'Content-type': 'application/rdf+xml', 'Accept': 'application/json' }
//     })

//   } catch (error) {
//     console.error(error)
//   }
// }

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
  } catch (error) {
    console.error(error)
  }
}


export async function findAllDataSources() {
  try {
    let query = `PREFIX mokg: <http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      PREFIX dcterms: <http://purl.org/dc/terms/>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      SELECT * WHERE { 
          ?uri a mokg:DataSource ; 
            dc:identifier ?identifier ;
            dc:title ?title ;
            dcterms:created ?created ;
            dcterms:modified ?modified .
            OPTIONAL { ?uri dc:creator ?creator . }
            OPTIONAL { ?uri rdfs:comment ?comment . }
            OPTIONAL { ?uri foaf:page ?comment . }
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


/**Esta função retornar um recuros com o ID informado no parâmetro*/
export async function findOne(identifier: string) {
  try {
    let query = `PREFIX mokg: <http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      PREFIX dcterms: <http://purl.org/dc/terms/>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      SELECT * WHERE { 
        ?uri a mokg:DataSource ; 
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


/**TABELAS */
export interface IFormTable {
  identifier: string;
  title: string;
  created: string;
  modified: string;
}

/**Esta função retornar um recuros com o ID informado no parâmetro*/
export async function findOneResourceByIdentifier(identifier: string, owlClass: string) {
  try {
    let query = `PREFIX mokg: <http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      PREFIX dcterms: <http://purl.org/dc/terms/>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      SELECT * WHERE { 
        ?uri a mokg:${owlClass} ; 
          dc:identifier "${identifier}" .
      }
      limit 1
      `
    console.log("identifier")
    console.log(identifier)
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

/**Criar uma tabela no GM */
export async function insertTable(data: IFormTable, datasourceIdentifier: string) {
    console.log("*** Dados de tabale para salvar ****")
    console.log(data)

    const uuid = uuidv4();
    const currentDate: Date = new Date();
    const uri = data.title.replace(/ /g, "_");

    let query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX dcterms: <http://purl.org/dc/terms/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX mokg: <http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#>
    INSERT DATA { 
      mokg:${uri} a mokg:Table ; 
        rdfs:label '${data.title}' ;
        dc:identifier '${uuid}' ;
        dc:title '${data.title}' ;
        dcterms:created '${currentDate.toISOString()}' ;
        dcterms:modified '${currentDate.toISOString()}' .
      mokg:${uri} mokg:belongsToDataSource mokg:${datasourceIdentifier} .
    }`

    await axios({
      method: 'POST',
      url: encodeURI("http://localhost:7200/repositories/metagraph/statements"),
      params: { update: query },
      headers: { 'Content-type': 'application/rdf+xml', 'Accept': 'application/json' }
    })

    const created = await findOneResourceByIdentifier(uuid, "Table");
    return created[0];
}

export async function findAllTables() {
  try {
    let query = `PREFIX mokg: <http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      PREFIX dcterms: <http://purl.org/dc/terms/>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      SELECT * WHERE { 
        ?uri a mokg:Table ;
            dc:title ?title ;
            rdfs:label ?label ;
            dc:identifier ?identifier ;
            dc:title ?title ;
            dcterms:created ?created ;
            dcterms:modified ?modified .
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



/**Criar uma Coluna no GM */
export async function insertColumn(data: IFormTable, datasourceIdentifier: string) {
  console.log("*** Dados de coluna para salvar ****")
  console.log(data)

  const uuid = uuidv4();
  const currentDate: Date = new Date();
  const uri = data.title.replace(/ /g, "_");

  let query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX foaf: <http://xmlns.com/foaf/0.1/>
  PREFIX dcterms: <http://purl.org/dc/terms/>
  PREFIX dc: <http://purl.org/dc/elements/1.1/>
  PREFIX mokg: <http://www.arida.ufc.org/ontologies/metadata-of-knowledge-graph#>
  INSERT DATA { 
    mokg:${uri} a mokg:Column ; 
      rdfs:label '${data.title}' ;
      dc:identifier '${uuid}' ;
      dc:title '${data.title}' ;
      dcterms:created '${currentDate.toISOString()}' ;
      dcterms:modified '${currentDate.toISOString()}' .
    mokg:${uri} mokg:belongsToTable mokg:${datasourceIdentifier} .
  }`

  await axios({
    method: 'POST',
    url: encodeURI("http://localhost:7200/repositories/metagraph/statements"),
    params: { update: query },
    headers: { 'Content-type': 'application/rdf+xml', 'Accept': 'application/json' }
  })

  const created = await findOneResourceByIdentifier(uuid, "Column");
  return created[0];
}