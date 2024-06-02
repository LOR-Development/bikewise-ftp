import { exec } from "child_process";
import fs from "fs";

async function deleteLocalFile() {
  const filePath = "./src/soh/BikeWise_10KM_PartsOnHandQty.csv";

  try {
    fs.unlinkSync(filePath);
    console.log("File deleted successfully");
  } catch (err) {
    console.error(`Error deleting file`);
  }

  return;
}

async function sftpDownload() {
  const username = "bikewise";
  const password = "%j9PzQD5^ZKQpRxx";
  const host = "bikewise@BHAuto_SFTP.dimensiondata.com";
  const remotePath =
    "Data/PartsOnHandQty/BikeWise/BikeWise_10KM_PartsOnHandQty.csv";
  const localPath = "./src/soh/";

  deleteLocalFile();

  const command = `lftp -c "set sftp:auto-confirm yes; open -u ${username},${password} sftp://${host}; get ${remotePath} -o ${localPath}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`Standard error: ${stderr}`);
      return;
    }
  });
}

async function waitForFile(filePath, timeout = 30000, interval = 1000) {
  const startTime = Date.now();

  while (true) {
    try {
      await fs.existsSync("../soh/BikeWise_10KM_PartsOnHandQty.csv");
      return;
    } catch (error) {
      if (Date.now() - startTime > timeout) {
        throw new Error(`Timeout waiting for file: ${filePath}`);
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }
}

export async function ftp() {
  sftpDownload();
  await waitForFile()
    .then(() => {
      return;
    })
    .catch((error) => {
      console.error(error.message);
    });
}
