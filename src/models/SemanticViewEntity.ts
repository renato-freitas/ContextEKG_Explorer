import { RDF_Node } from "./RDF_Node";

export interface SemanticViewEntity {
  identifier: RDF_Node;
  label: RDF_Node;
  page: RDF_Node;
  created: RDF_Node;
  modified: RDF_Node;
  uri: RDF_Node;
  belongsTo: RDF_Node;
}