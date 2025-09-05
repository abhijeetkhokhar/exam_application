import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true },
    options: {
      type: [optionSchema],
      required: true,
      validate: (v) => v.length >= 2,
    },
    correctOptionId: { type: String, required: true },
    marks: { type: Number, default: 1, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
