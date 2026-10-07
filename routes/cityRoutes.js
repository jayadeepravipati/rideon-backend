import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/', (req, res) => {
  try {
    const cities = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/cities.json')));
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cities" });
  }
});

export default router;