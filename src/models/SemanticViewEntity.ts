import { RDF_Node } from "./RDF_Node";

export interface LocalGraphEntity {
  identifier: RDF_Node;
  label: RDF_Node;
  webpage: RDF_Node;
  created: RDF_Node;
  modified: RDF_Node;
  uri: RDF_Node;
  belongsTo: RDF_Node;
}