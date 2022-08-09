import { ColumnEntity } from "./ColumnEntity";
import { RDF_Node } from "./RDF_Node";

export interface TableEntity {
  identifier: RDF_Node;
  name: RDF_Node;
  type: RDF_Node; /**Tabela Relacinal ou CSV */
  columns: ColumnEntity[];
}