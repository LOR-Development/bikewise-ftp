import { ftp } from "./src/functions/sftpDownload.js";
import { prepareSheet } from "./src/functions/dbUpdate.js";
import express from "express";
import fs from "fs";

const app = express();
const port = 3000;

app.get("/test", (req, res) => {
  prepareSheet();
  res.send("Server active.");
});

app.get("/ftp-download", async (req, res) => {
  await ftp();

  res.send(`File successfully downloaded @ ${new Date()}`);
});

app.get("/db-upload", async (req, res) => {
  await prepareSheet();

  res.send(`Database successfully updated @ ${new Date()}`);
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
