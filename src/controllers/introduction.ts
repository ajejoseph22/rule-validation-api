import { Request, Response } from "express";
import { IntroductoryObject } from "../types/introductory-object";

export default (req: Request, res: Response) => {
  res.json({
    message: "My Rule-Validation API",
    status: "success",
    data: {
      name: "Joseph Aje",
      github: "@ajejoseph22",
      email: "ajejoseph22@gmail.com",
      mobile: "08131112930",
    },
  } as IntroductoryObject);
};
