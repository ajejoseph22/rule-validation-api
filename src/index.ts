import express, { json, urlencoded } from "express";
import logger from "winston";
import morgan from "morgan";
import cors from "cors";
import introduction from "./controllers/introduction";
import validate from "./routes/validate";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(json());
app.use(urlencoded());

// ROUTES
app.get("/", introduction);
app.use("/validate", validate);

app.listen(3000, () => {
  logger.info("App successfully started");
});

export default app;
