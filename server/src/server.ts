import "dotenv/config";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/database.js";

const port = Number(process.env.PORT ?? 5001);

await connectDatabase();

createApp().listen(port, () => {
  console.log(`Siyu Creativity API listening on http://localhost:${port}`);
});
