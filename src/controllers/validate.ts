import { Request, Response } from "express";
import { errorResponse, process } from "../util/methods";
import { logger } from "../util/logger";

export default (req: Request, res: Response) => {
  const { body } = req;

  try {
    process(body, res);
  } catch ({ message }) {
    logger.error(message);
    res.status(400).json(errorResponse(message));
  }
};
