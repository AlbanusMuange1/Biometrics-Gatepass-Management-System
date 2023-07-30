require("dotenv").config();
const env = process.env;
const db = env.DATABASE_URL;

module.exports = db;
