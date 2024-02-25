import { TableEntity } from "./TableEntity";
import { RDF_Node } from "./RDF_Node";

export interface ClassModel {
  identifier?: RDF_Node;
  label?: RDF_Node;
  title?: RDF_Node;
  comment?: RDF_Node;
  created?: RDF_Node;
  modified?: RDF_Node;
  uri: RDF_Node;
  class: RDF_Node;
  subclass?: RDF_Node;
}