import { pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";
import { timestamps } from "./_common";

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 256 }).notNull(),
  content: text("text").notNull(),
  ...timestamps,
});
