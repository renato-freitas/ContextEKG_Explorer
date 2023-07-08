// import { DataSourceEntity } from "./DataSourceEntity";
import { RDF_Node } from "./RDF_Node";

export interface MappingModel {
  identifier: RDF_Node;
  label: RDF_Node;
  prefixies: RDF_Node;
  description: RDF_Node;
  created: RDF_Node;
  modified: RDF_Node;
  uri: RDF_Node;
  belongsTo: RDF_Node;
}