import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Question from "../src/models/Question.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URI = process.env.MONGO_URI;

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Mongo connected");

    const jsonPath = path.join(__dirname, "questions.json");
    const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

    await Question.deleteMany({});
    await Question.insertMany(data);
    console.log(`Seeded ${data.length} questions.`);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
