import React from "react";
import { useNavigate } from "react-router-dom";
import { useExam } from "../hooks/useExam";

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function TakeExam() {
  const {
    questions,
    currentIndex,
    answers,
    selectAnswer,
    next,
    prev,
    submitExam,
    timeLeft,
  } = useExam();
  const navigate = useNavigate();

  const q = questions[currentIndex];

  const onSubmit = async () => {
    const res = await submitExam();
    if (res) navigate("/result");
  };

  if (!questions.length) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <p className="text-gray-700">No questions loaded. Go to Start Exam.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">
          Question {currentIndex + 1} / {questions.length}
        </h1>
        <div
          className={`px-3 py-1 rounded font-mono ${
            timeLeft <= 60
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>
      <div className="bg-white rounded shadow p-5">
        <p className="text-lg mb-4">{q.questionText}</p>
        <div className="space-y-2">
          {q.options.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-2 border rounded px-3 py-2 cursor-pointer"
            >
              <input
                type="radio"
                name={`q-${currentIndex}`}
                checked={answers[q._id || q.id] === opt.id}
                onChange={() => selectAnswer(q._id || q.id, opt.id)}
              />
              <span>{opt.text}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={prev}
          disabled={currentIndex === 0}
          className={`px-4 py-2 rounded ${
            currentIndex === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Previous
        </button>
        <div className="flex gap-2">
          {currentIndex < questions.length - 1 ? (
            <button
              onClick={next}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={onSubmit}
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
