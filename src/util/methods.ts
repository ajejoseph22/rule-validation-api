import { TreeData, TreeObject } from "../types/tree-object";
import { Property } from "../enums/property";
import { Rule } from "../types/rule";
import { ArticleMap, propertyTypeMap } from "./constants";
import { SuccessResponse } from "../types/success-response";
import { Response } from "express";
import { DataType } from "../enums/data-type";
import { Condition } from "../enums/condition";
import { ValidationObject } from "../types/response-data";

// ERRORS
const isMissingError = (field: string, data: string) =>
  `field ${field} is missing from ${data}.`;
const requiredError = (property: Property) => `${property} is required.`;
const wrongTypeError = (property: Property) =>
  `${property} should be ${ArticleMap[property]} ${
    !Array.isArray(propertyTypeMap[property])
      ? propertyTypeMap[property]
      : (propertyTypeMap[property] as string[]).reduce(
          (acc: string, item: string, index: number) => {
            if (index && index === propertyTypeMap[property].length - 1) {
              acc = `${acc} or ${item}`;
            } else if (index) {
              acc = `${acc}, ${item}`;
            }
            return acc;
          },
          propertyTypeMap[property][0]
        )
  }.`;

// HELPERS
const getType = (data: any) => {
  if (isObject(data)) return DataType.Object;
  if (Array.isArray(data)) return DataType.Array;
  if (typeof data === DataType.String) return DataType.String;
};
const isCorrectType = (value: any, property: Property): boolean => {
  if (property === Property.Rule) {
    return isObject(value);
  }

  return propertyTypeMap[property].includes(typeof value);
};
const isObject = (variable: any) => {
  return Object.prototype.toString.call(variable) === "[object Object]";
};
const isUndefined = (property: any) => property === undefined;
const generateLeftOverString = (
  nestedPropertiesArray: string[],
  index: number
): string => {
  return nestedPropertiesArray
    .slice(0, index)
    .reduce((acc: string, property: string) => {
      acc = `${acc}[${property}]`;
      return acc;
    }, "");
};

const validate = (rule: Rule, data: TreeData): void => {
  // RULE
  if (isUndefined(rule)) throw new Error(requiredError(Property.Rule));
  if (!isCorrectType(rule, Property.Rule))
    throw new Error(wrongTypeError(Property.Rule));

  // DATA
  if (isUndefined(data)) throw new Error(requiredError(Property.Data));
  if (!getType(data)) throw new Error(wrongTypeError(Property.Data));

  const { condition, condition_value, field } = rule;

  // FIELD
  if (isUndefined(field)) throw new Error(requiredError(Property.Field));
  if (!isCorrectType(field, Property.Field))
    throw new Error(wrongTypeError(Property.Field));

  // CONDITION
  if (isUndefined(condition))
    throw new Error(requiredError(Property.Condition));
  if (!isCorrectType(condition, Property.Condition))
    throw new Error(wrongTypeError(Property.Condition));

  // CONDITION VALUE
  if (isUndefined(condition_value))
    throw new Error(requiredError(Property.ConditionValue));
};

export const successResponse = (
  message: string,
  tree: TreeObject,
  fieldValue: any
): SuccessResponse => {
  const { field, condition, condition_value } = tree.rule;

  return {
    message,
    status: "success",
    data: {
      validation: {
        error: false,
        field,
        field_value: fieldValue,
        condition,
        condition_value,
      },
    },
  };
};

export const errorResponse = (
  message: string,
  data: ValidationObject | null = null
) => ({
  message,
  status: "error",
  data,
});

const getFieldValue = (
  nestedFieldsArray: string[],
  data: any,
  field: string
): any => {
  let fieldValue;
  if (nestedFieldsArray.length <= 1) {
    fieldValue = data[field];
  } else {
    fieldValue = nestedFieldsArray
      .slice(0, 3)
      .reduce((acc: any, field: string, index: number) => {
        acc = acc[field];
        if (isUndefined(acc))
          throw new Error(
            isMissingError(
              field,
              `data${
                index ? generateLeftOverString(nestedFieldsArray, index) : ""
              }`
            )
          );
        return acc;
      }, data);
  }

  if (isUndefined(fieldValue)) throw new Error(isMissingError(field, "data"));

  return fieldValue;
};

const compare = (
  fieldValue: any,
  condition: Condition,
  conditionValue: any
): boolean => {
  switch (condition) {
    case Condition.Eq:
      return fieldValue === conditionValue;
    case Condition.Neq:
      return fieldValue !== conditionValue;
    case Condition.Gt:
      return fieldValue > conditionValue;
    case Condition.Gte:
      return fieldValue >= conditionValue;
    case Condition.Contains:
      const type = getType(fieldValue);
      if (type === DataType.Object)
        return fieldValue.hasOwnProperty(conditionValue);
      if (type === DataType.Array) return fieldValue.includes(conditionValue);
      return fieldValue === conditionValue;
    default:
      throw new Error("Invalid condition");
  }
};

export const process = (treeObject: TreeObject, res: Response): void => {
  const { rule, data } = treeObject;

  validate(rule, data);

  const { field, condition, condition_value } = rule;
  const nestedFieldsArray = field.split(".");

  const fieldValue = getFieldValue(nestedFieldsArray, data, field);
  const result = compare(fieldValue, condition, condition_value);

  result
    ? res.json(
        successResponse(
          `field ${field} successfully validated.`,
          treeObject,
          fieldValue
        )
      )
    : res.status(400).json(
        errorResponse(`field ${field} failed validation.`, {
          error: true,
          field: field,
          field_value: fieldValue,
          condition,
          condition_value,
        })
      );
};
