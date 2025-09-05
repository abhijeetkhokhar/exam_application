import { Router } from "express";
import Question from "../models/Question.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

// GET /api/exams/start?limit=10
router.get("/start", authRequired, async (req, res) => {
  try {
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const questions = await Question.aggregate([
      { $sample: { size: limit } },
      {
        $project: {
          questionText: 1,
          options: 1,
          marks: 1,
        },
      },
    ]);

    return res.json({ questions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /api/exams/submit
router.post("/submit", authRequired, async (req, res) => {
  try {
    const { answers } = req.body;
    if (!Array.isArray(answers))
      return res.status(400).json({ message: "answers array required" });

    const qIds = answers.map((a) => a.questionId);
    const questions = await Question.find({ _id: { $in: qIds } });
    const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));

    let score = 0;
    let total = 0;
    const breakdown = [];

    for (const ans of answers) {
      const q = questionMap.get(ans.questionId);
      if (!q) continue;
      total += q.marks;
      const correct = ans.optionId === q.correctOptionId;
      if (correct) score += q.marks;
      breakdown.push({
        questionId: ans.questionId,
        selectedOptionId: ans.optionId,
        correct,
      });
    }
    return res.json({ score, total, breakdown });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
