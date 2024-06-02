import fs from "fs";
import readline from "readline";
import { sql } from "drizzle-orm";
import { db } from "../db/dbConnection.js";
import { productSchema } from "../db/schema.js";

async function uploadData(array) {
  array.forEach(async (x) => {
    const partNumber = `%${x[1]}%`;
    await db
      .insert(productSchema)
      .values({
        co: x[0],
        partNumber: x[1],
        franchise: x[2],
        stockgroup: x[3],
        part: x[4],
        soh: x[5],
        price: x[6],
        binLoc: x[7],
        superceededNo: x[8],
      })
      .onConflictDoUpdate({
        target: productSchema.partNumber,
        targetWhere: sql`${productSchema.partNumber} like ${partNumber}`,
        setWhere: sql`${productSchema.partNumber} like ${partNumber}`,
        set: {
          co: x[0],
          franchise: x[2],
          stockgroup: x[3],
          part: x[4],
          soh: x[5],
          price: x[6],
          binLoc: x[7],
          superceededNo: x[8],
        },
      });
  });

  console.log("Database updated successfully");
}

export async function prepareSheet() {
  const path = "./src/soh/BikeWise_10KM_PartsOnHandQty.csv";
  const ignoreList = [5, 12, 23, 24, 27, 28, 29];

  const readStream = fs.createReadStream(path);
  const readInterface = readline.createInterface({ input: readStream });

  const output = [];
  let csv;

  readInterface.on("line", (line) => {
    const row = line.split(",");

    if (
      parseInt(row[3].replaceAll('"', "")) < 30 &&
      !ignoreList.includes(row[3].replaceAll('"', ""))
    ) {
      output.push([
        row[0].replaceAll('"', ""),
        row[1].replaceAll('"', ""),
        row[2].replaceAll('"', ""),
        parseInt(row[3].replaceAll('"', "")),
        row[4].replaceAll('"', ""),
        parseInt(row[5].replaceAll('"', "")),
        parseInt(row[6].replaceAll('"', "")),
        row[7].replaceAll('"', ""),
        row[8].replaceAll('"', ""),
        row[9].replaceAll('"', ""),
      ]);
    }
  });

  readInterface.on("close", () => {
    csv = output
      .map((x) => {
        x.map((y) => {
          return y;
        }).join(";");
        return x;
      })
      .join("\n");

    fs.writeFile("./src/soh/soh.csv", csv, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("SOH file processed and saved");
        uploadData(output);
      }
    });
  });

  readInterface.on("error", (err) => {
    console.error("Error reading the CSV file:", err);
  });

  return;
}
