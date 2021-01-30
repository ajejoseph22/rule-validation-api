// todo: write tests :)
// todo: dockerize :)
import express, { json, NextFunction, Response, urlencoded } from "express";
import morgan from "morgan";
import cors from "cors";
import introduction from "./controllers/introduction";
import validate from "./routes/validate";
import { logger } from "./util/logger";
import { ExpressError } from "./types/express-error";

const app = express();

app.use(morgan("combined"));
app.use(cors());
app.use(json());

app.use(
  // @ts-ignore
  (err: ExpressError, req: Request, res: Response, next: NextFunction) => {
    // express will set this to 400 if the json is in error
    if (err.status === 400) {
      logger.error(err);
      return res.status(err.status).json({
        message: "Invalid JSON payload passed.",
        status: "error",
        data: null,
      });
    }

    // if it's not a 400, let the default error handling do it.
    return next(err);
  }
);

app.use(urlencoded({ extended: true }));

// ROUTES
app.get("/", introduction);
app.use("/validate-rule", validate);

app.listen(process.env.PORT || 3000, () => {
  logger.info("App successfully started");
});

export default app;
