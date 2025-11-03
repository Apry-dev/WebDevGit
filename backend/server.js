// server.js — serve frontend/public
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

//  Necesare pentru a folosi __dirname cu module type: "module"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servește fișierele statice din frontend/public
app.use(express.static(path.join(__dirname, "../frontend/public")));

// Trimite index.html când intri pe rădăcină
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});