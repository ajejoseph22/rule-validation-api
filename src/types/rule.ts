import { Condition } from "../enums/condition";

export interface Rule {
  field: string;
  condition: Condition;
  condition_value: any;
}
