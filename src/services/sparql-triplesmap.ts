import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export interface ITriplesMapForm {
  identifier: string;
  label: string;
  urlMappings: string;
  created: string;
  modified: string;
  belongsTo: string
}