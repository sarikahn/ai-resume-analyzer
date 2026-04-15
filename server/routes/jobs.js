const express = require("express");
const router = express.Router();

let jobs = [];

// GET jobs
router.get("/", (req, res) => {
  res.json(jobs);
});

// ADD job (FIXED)
router.post("/", (req, res) => {
  try {
    const { company, role, status } = req.body;

    if (!company || !role) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const newJob = {
      _id: Date.now().toString(),
      company: String(company),
      role: String(role),
      status: status || "Applied",
    };

    jobs.push(newJob);

    res.json(newJob);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// DELETE
router.delete("/:id", (req, res) => {
  jobs = jobs.filter((j) => j._id !== req.params.id);
  res.json({ msg: "Deleted" });
});

// UPDATE
router.put("/:id", (req, res) => {
  const { status } = req.body;

  jobs = jobs.map((j) =>
    j._id === req.params.id ? { ...j, status } : j
  );

  res.json({ msg: "Updated" });
});

module.exports = router;