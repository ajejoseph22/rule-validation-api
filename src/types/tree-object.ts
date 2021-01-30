import { Rule } from "./rule";

export interface TreeData {
  name: string;
  crew: string;
  age: number;
  position: string;
  missions: number;
  [key: string]: any;
}

export interface TreeObject {
  rule: Rule;
  data: TreeData;
}
