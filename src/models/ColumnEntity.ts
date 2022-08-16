import { RDF_Node } from "./RDF_Node";

export interface ColumnEntity {
  identifier: RDF_Node;
  name: RDF_Node;
  title: RDF_Node;
  created: RDF_Node;
  modified: RDF_Node;
  type: RDF_Node;
}