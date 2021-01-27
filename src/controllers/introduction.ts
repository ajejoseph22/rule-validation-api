import { Request, Response } from "express";
import { IntroductoryObject } from "../types/introductory-object";

export default (req: Request, res: Response) => {
  const responseObject: IntroductoryObject = {
    message: "My Rule-Validation API",
    status: "success",
    data: {
      name: "Joseph Aje",
      github: "@ajejoseph22",
      email: "ajejoseph22@gmail.com",
      mobile: "08131112930",
      twitter: "None",
    },
  };
  res.json(responseObject);
};
