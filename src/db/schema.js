import { text, integer, numeric, pgTable } from "drizzle-orm/pg-core";

export const productSchema = pgTable("products", {
  co: text("co"),
  partNumber: text("partno").primaryKey(),
  franchise: text("franchise"),
  stockgroup: integer("stockgroup"),
  part: text("part"),
  soh: integer("soh"),
  price: numeric("price"),
  divison: text("division"),
  binLoc: text("binloc"),
  superceededNo: text("superceededno"),
  special: text("special"),
});
