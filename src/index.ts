import express from "express";
import logger from "winston";
import introduction from "./controllers/introduction";

const app = express();

// ROUTES
app.get("/", introduction);

app.listen(3000, () => {
  logger.info("App successfully started");
});

export default app;
