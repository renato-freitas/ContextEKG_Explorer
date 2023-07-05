import { RDF_Node } from "./RDF_Node";

export interface DataSourceModel {
  identifier: RDF_Node;
  label: RDF_Node;
  uri: RDF_Node;
  comment: RDF_Node;
  created: RDF_Node;
  modified: RDF_Node;
  type: RDF_Node;
  subject_datasource?: RDF_Node;
  connection_url: RDF_Node;
  username: RDF_Node;
  password: RDF_Node;
  jdbc_driver: RDF_Node;
  csv_file: RDF_Node;
  s: RDF_Node;
  l: RDF_Node;
}

