import { RDF_Node } from "./RDF_Node";

export interface MetaEKGModel {
  uri: RDF_Node;
  identifier: RDF_Node;
  title: RDF_Node;
  label: RDF_Node;
  comment: RDF_Node;
  description: RDF_Node;
  creator: RDF_Node;
  created: RDF_Node;
  modified: RDF_Node;
  semanticView: RDF_Node;
  kg_metadata?: RDF_Node;
}