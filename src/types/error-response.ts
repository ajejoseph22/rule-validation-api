import { ValidationObject } from "./response-data";

export default interface ErrorResponse {
  message: string;
  status: "error";
  data: ValidationObject | null;
}
