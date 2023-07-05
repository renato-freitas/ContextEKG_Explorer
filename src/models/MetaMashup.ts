import { RDF_Node } from "./RDF_Node";

export interface MetaMashup {
  uri: RDF_Node;
  uri_l: RDF_Node;
  identifier: RDF_Node;
  label?: RDF_Node;
  comment?: RDF_Node;
  creator?: RDF_Node;
  created?: RDF_Node;
  modified?: RDF_Node;
  semanticView?: RDF_Node;
  uri_metaEKG?: RDF_Node;
  uri_mashup_view?: RDF_Node;
  reuse_metadata_from?: RDF_Node;
}