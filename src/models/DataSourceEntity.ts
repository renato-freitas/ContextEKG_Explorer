import { TableEntity } from "./TableEntity";
import { RDF_Node } from "./RDF_Node";

export interface DataSourceEntity {
  identifier: RDF_Node;
  title: RDF_Node;
  created: RDF_Node;
  // tables: TableEntity[];
}