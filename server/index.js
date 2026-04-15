import express from "express";
import cors from "cors";
import multer from "multer";
import pdfParse from "pdf-parse";

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    console.log("API HIT");

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!req.body.jd) {
      return res.status(400).json({ error: "No JD provided" });
    }

    let resumeText = "";

    try {
      const data = await pdfParse(req.file.buffer);
      resumeText = data.text.toLowerCase();
    } catch {
      return res.status(500).json({ error: "PDF read failed" });
    }

    const jdText = req.body.jd.toLowerCase();

    const skills = ["react", "node", "mongodb", "javascript"];

    let matched = [];
    let missing = [];

    skills.forEach((skill) => {
      if (jdText.includes(skill)) {
        if (resumeText.includes(skill)) matched.push(skill);
        else missing.push(skill);
      }
    });

    const score = Math.floor((matched.length / skills.length) * 100);

    return res.json({
      score,
      matched,
      missing,
      suggestions: missing.length
        ? "Add skills: " + missing.join(", ")
        : "Good resume",
    });

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(5000, () => console.log("🚀 Running on 5000"));