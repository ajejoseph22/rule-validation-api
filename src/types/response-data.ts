import { Condition } from "../enums/condition";

export interface ValidationObject {
  error: boolean;
  field: string;
  field_value: string;
  condition: Condition;
  condition_value: any;
}

export interface ResponseData {
  validation: ValidationObject;
}
