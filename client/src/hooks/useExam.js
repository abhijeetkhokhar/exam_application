import { useContext } from "react";
import { ExamContext } from "../state/ExamContext";

export function useExam() {
  const ctx = useContext(ExamContext);
  if (!ctx) throw new Error("useExam must be used within ExamProvider");
  return ctx;
}
