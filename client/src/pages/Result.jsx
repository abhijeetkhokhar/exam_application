import React from "react";
import { Link } from "react-router-dom";
import { useExam } from "../hooks/useExam";

export default function Result() {
  const { result } = useExam();

  if (!result) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <p>No result to show.</p>
        <Link to="/start-exam" className="text-blue-600">
          Go to Start Exam
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-2">Results</h1>
        <p className="mb-2 text-lg">
          Questions Attempted:{" "}
          <span className="font-semibold">{result.breakdown?.length}</span> /{" "}
          <span className="font-semibold">{result.total}</span>
        </p>
        <p className="mb-4 text-lg">
          Score: <span className="font-semibold">{result.score}</span> points
        </p>
        {Array.isArray(result.breakdown) && (
          <div>
            <h2 className="font-semibold mb-2">Summary</h2>
            <ul className="space-y-1 text-sm">
              {result.breakdown.map((b, i) => (
                <li
                  key={i}
                  className={b.correct ? "text-green-700" : "text-red-700"}
                >
                  Q{i + 1}: {b.correct ? "Correct" : "Incorrect"}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-4">
          <Link
            to="/start-exam"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 inline-block"
          >
            Take Again
          </Link>
        </div>
      </div>
    </div>
  );
}
