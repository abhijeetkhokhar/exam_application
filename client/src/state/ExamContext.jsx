import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "./useAuth";
import { api } from "../utils/api";

// Constants
const TIME_PER_QUESTION = 30;
const STORAGE_KEY = "exam_state";

const ExamContext = createContext(null);

function ExamProvider({ children }) {
  const { token } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [result, setResult] = useState(null);
  const timerRef = useRef(null);
  const startedRef = useRef(false);

  // Restore from session on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const {
          questions: savedQuestions = [],
          answers: savedAnswers = {},
          currentIndex: savedIndex = 0,
          timeLeft: savedTimeLeft = TIME_PER_QUESTION,
          result: savedResult = null,
        } = JSON.parse(saved);

        setQuestions(savedQuestions);
        setAnswers(savedAnswers);
        setCurrentIndex(savedIndex);
        setTimeLeft(savedTimeLeft);
        setResult(savedResult);
        startedRef.current = savedQuestions.length > 0;
      }
    } catch (error) {
      console.error("Error loading exam state:", error);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Persist state changes
  useEffect(() => {
    const payload = { questions, answers, currentIndex, timeLeft, result };
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.error("Error saving exam state:", error);
    }
  }, [questions, answers, currentIndex, timeLeft, result]);

  useEffect(() => {
    if (!startedRef.current || result) return;
    const clearTimer = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    if (questions.length > 0) {
      setTimeLeft(TIME_PER_QUESTION);
      clearTimer();
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearTimer();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return clearTimer;
  }, [currentIndex, questions.length, result]);

  const selectAnswer = useCallback((questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, Math.max(questions.length - 1, 0)));
  }, [questions.length]);

  const prev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  const submitExam = useCallback(async () => {
    if (!questions.length) return null;
    const payload = {
      answers: questions
        .map((q) => ({
          questionId: q._id || q.id,
          optionId: answers[q._id || q.id] || null,
        }))
        .filter((a) => a.optionId),
    };
    const res = await api.post("/api/exams/submit", payload, token);
    const resultWithTotal = {
      ...res,
      total: questions.length,
    };
    setResult(resultWithTotal);
    return resultWithTotal;
  }, [answers, questions, token]);

  const startExam = useCallback(
    async (limit = 10) => {
      const res = await api.get(`/api/exams/start?limit=${limit}`, token);
      setQuestions(res.questions || []);
      setAnswers({});
      setCurrentIndex(0);
      setTimeLeft(30);
      setResult(null);
      startedRef.current = true;
    },
    [token]
  );

  // Handle timer expiration - move to next question or submit
  useEffect(() => {
    if (timeLeft === 0 && questions.length && !result) {
      const timer = setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          next();
        } else if (currentIndex === questions.length - 1) {
          const submit = async () => {
            try {
              await submitExam();
            } catch (error) {
              console.error("Error submitting exam:", error);
            }
          };
          submit();
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [timeLeft, currentIndex, questions.length, result, next, submitExam]);

  const value = useMemo(
    () => ({
      questions,
      answers,
      currentIndex,
      timeLeft,
      result,
      startExam,
      selectAnswer,
      next,
      prev,
      submitExam,
    }),
    [
      answers,
      currentIndex,
      next,
      prev,
      questions,
      result,
      selectAnswer,
      startExam,
      submitExam,
      timeLeft,
    ]
  );

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
}

export { ExamContext, ExamProvider };
