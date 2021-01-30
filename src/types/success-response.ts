import { ResponseData } from "./response-data";

export interface SuccessResponse {
  message: string;
  status: "success";
  data: ResponseData;
}
