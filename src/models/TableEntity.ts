import { ColumnEntity } from "./ColumnEntity";
import { RDF_Node } from "./RDF_Node";

export interface TableEntity {
  uri: RDF_Node;
  identifier: RDF_Node;
  name: RDF_Node;
  title: RDF_Node;
  created: RDF_Node;
  modified: RDF_Node;
  type: RDF_Node; /**Tabela Relacinal ou CSV */
  // columns: ColumnEntity[];
}