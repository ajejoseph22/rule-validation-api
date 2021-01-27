import express from "express";
import logger from "winston";
import introduction from "./controllers/introduction";
import validate from "./routes/validate";

const app = express();

app.use("/", validate);

// ROUTES
app.get("/", introduction);

app.listen(3000, () => {
  logger.info("App successfully started");
});

export default app;
