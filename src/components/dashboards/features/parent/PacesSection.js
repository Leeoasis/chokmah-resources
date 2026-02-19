import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLearnerChildren,
  fetchLearnerPaces,
  startPaceAttempt,
  submitPaceAttempt,
  resetActivePace,
  setSelectedLearner,
} from "../../../../redux/parent/pacesSlice";

/* ---------- UI bits ---------- */
const Section = ({ title, count, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <details
      open={open}
      onToggle={(e) => setOpen(e.currentTarget.open)}
      className="rounded-2xl border border-white/10 bg-white/5"
    >
      <summary className="cursor-pointer select-none px-4 md:px-6 py-4 font-semibold flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="text-amber-400">▸</span>
          <span>{title}</span>
          <span className="ml-2 text-xs text-gray-400">({count})</span>
        </span>
        <span className="ml-4 text-amber-400">{open ? "▾" : "▸"}</span>
      </summary>
      <div className="px-4 md:px-6 pb-4">{children}</div>
    </details>
  );
};

const Chip = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={[
      "text-xs sm:text-sm px-2 py-1 rounded-full border transition",
      active
        ? "border-amber-400/80 bg-amber-400/10 text-amber-200"
        : "border-white/10 bg-white/5 text-gray-300 hover:border-amber-400/40",
    ].join(" ")}
  >
    {children}
  </button>
);

const PacesSection = () => {
  const dispatch = useDispatch();
  const {
    paces,
    children,
    selectedLearnerId,
    activePace,
    activeAttempt,
    questions,
    results,
    isLoading,
    error,
  } = useSelector((state) => state.learnerPaces);

  const [answers, setAnswers] = useState({});
  const [activeGrade, setActiveGrade] = useState(null);

  useEffect(() => {
    dispatch(fetchLearnerChildren());
  }, [dispatch]);

  useEffect(() => {
    if (selectedLearnerId) {
      dispatch(fetchLearnerPaces(selectedLearnerId));
    }
  }, [dispatch, selectedLearnerId]);

  useEffect(() => {
    if (questions.length) {
      setAnswers({});
    }
  }, [questions]);

  useEffect(() => {
    if (selectedLearnerId && results?.remaining_attempts <= 0) {
      dispatch(fetchLearnerPaces(selectedLearnerId));
    }
  }, [dispatch, results?.remaining_attempts, selectedLearnerId]);

  const handleStart = (paceId) => {
    dispatch(startPaceAttempt({ paceId, learnerId: selectedLearnerId }));
  };

  const handleAnswer = (questionNumber, answer) => {
    setAnswers((prev) => ({ ...prev, [questionNumber]: answer }));
  };

  const handleSubmit = () => {
    if (!activePace) return;
    dispatch(submitPaceAttempt({ paceId: activePace.id, answers, learnerId: selectedLearnerId }));
  };

  const unansweredCount = useMemo(() => {
    return questions.filter((q) => !answers[q.question_number]).length;
  }, [questions, answers]);

  const allGrades = useMemo(
    () => [...new Set(paces.map((p) => p.grade_level).filter(Boolean))],
    [paces]
  );

  const filteredPaces = useMemo(() => {
    return paces.filter((p) => !activeGrade || p.grade_level === activeGrade);
  }, [paces, activeGrade]);

  const groupedPaces = useMemo(() => {
    const map = new Map();

    const push = (k1, k2, item) => {
      const a = k1 || "No grade";
      const b = k2 || "No subject";
      if (!map.has(a)) map.set(a, new Map());
      const inner = map.get(a);
      if (!inner.has(b)) inner.set(b, []);
      inner.get(b).push(item);
    };

    filteredPaces.forEach((p) => {
      const grade = p.grade_level || "No grade";
      const subject = p.subject || "No subject";
      push(grade, subject, p);
    });

    return map;
  }, [filteredPaces]);

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-xl font-bold">PACEs</h3>
        <p className="text-sm text-gray-400">Complete the online PACE. You have up to 3 attempts.</p>
      </div>

      {error && <div className="text-red-400">{error?.error || error}</div>}

      {!activePace && (
        <div className="bg-gray-800 p-4 rounded-lg">
          {children.length > 1 && (
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">Select Learner</label>
              <select
                value={selectedLearnerId || ""}
                onChange={(e) => dispatch(setSelectedLearner(Number(e.target.value)))}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
              >
                {children.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.child_name || "Learner"} {c.child_grade ? `(${c.child_grade})` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}
          {paces.length === 0 ? (
            <p className="text-gray-400">No PACEs available yet.</p>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-400 mr-1">Grade:</span>
                <Chip active={!activeGrade} onClick={() => setActiveGrade(null)}>
                  All
                </Chip>
                {allGrades.map((g) => (
                  <Chip key={g} active={activeGrade === g} onClick={() => setActiveGrade(g)}>
                    {g}
                  </Chip>
                ))}
              </div>

              <div className="mt-2 space-y-4">
                {Array.from(groupedPaces.entries()).map(([grade, innerMap]) => {
                  const total = [...innerMap.values()].reduce((acc, arr) => acc + arr.length, 0);
                  return (
                    <Section key={grade} title={grade} count={total} defaultOpen>
                      <div className="space-y-3">
                        {Array.from(innerMap.entries()).map(([subject, arr]) => (
                          <Section key={subject} title={subject} count={arr.length}>
                            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {arr.map((pace) => (
                                <li
                                  key={pace.id}
                                  className="rounded-xl border border-white/10 bg-gray-800/50 p-4 hover:border-amber-400/40 transition"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="font-semibold text-white truncate">
                                      {pace.title}
                                    </div>
                                    {pace.remaining_attempts <= 0 && (
                                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-red-400/60 bg-red-400/10 text-red-200 shrink-0">
                                        No attempts
                                      </span>
                                    )}
                                  </div>

                                  <div className="text-xs text-gray-400 mt-1 flex flex-wrap gap-x-2">
                                    {pace.subject && <span>{pace.subject}</span>}
                                    {pace.grade_level && <span>• Grade {pace.grade_level}</span>}
                                    {pace.total_questions != null && (
                                      <span>• {pace.total_questions} questions</span>
                                    )}
                                  </div>

                                  <div className="text-xs text-gray-500 mt-1">
                                    Passing: {pace.passing_score}% • Attempts left: {pace.remaining_attempts}
                                  </div>

                                  <button
                                    className="inline-block mt-2 text-amber-400 hover:text-amber-300 font-medium text-sm"
                                    disabled={pace.remaining_attempts <= 0 || isLoading}
                                    onClick={() => handleStart(pace.id)}
                                  >
                                    {pace.remaining_attempts <= 0 ? "No attempts left" : "Start →"}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </Section>
                        ))}
                      </div>
                    </Section>
                  );
                })}

                {!isLoading && filteredPaces.length === 0 && (
                  <div className="text-gray-400">No PACEs match your filters.</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activePace && (
        <div className="bg-gray-800 p-4 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-amber-400">{activePace.title}</h4>
              <p className="text-sm text-gray-300">
                Attempt {activeAttempt?.attempt_number} • Time limit: {activeAttempt?.time_limit_minutes || activePace.time_limit_minutes || "N/A"} min
              </p>
            </div>
            <button
              className="text-sm text-gray-300 underline"
              onClick={() => dispatch(resetActivePace())}
            >
              Back to list
            </button>
          </div>

          {results ? (
            <div className="space-y-4">
              <div className="p-3 rounded bg-gray-900">
                <p className="text-lg font-semibold">
                  Score: {results.attempt?.score} / {results.pace?.total_points}
                </p>
                <p className="text-sm text-gray-300">
                  Percentage: {results.attempt?.percentage}% • {results.attempt?.passed ? "Passed" : "Failed"}
                </p>
                <p className="text-sm text-gray-400">
                  Remaining attempts: {results.remaining_attempts}
                </p>
                {results.remaining_attempts > 0 && !results.attempt?.passed && (
                  <button
                    className="bg-amber-500 text-gray-900 px-4 py-2 rounded hover:bg-amber-400 disabled:opacity-50 w-full sm:w-auto mt-3"
                    disabled={isLoading}
                    onClick={() => {
                      dispatch(resetActivePace());
                      handleStart(activePace.id);
                    }}
                  >
                    Retake Test
                  </button>
                )}
                {results.remaining_attempts <= 0 && !results.attempt?.passed && (
                  <p className="text-sm text-red-400 mt-3">No attempts left</p>
                )}
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 w-full sm:w-auto mt-3"
                  onClick={() => {
                    dispatch(resetActivePace());
                    if (selectedLearnerId) {
                      dispatch(fetchLearnerPaces(selectedLearnerId));
                    }
                  }}
                >
                  Done
                </button>
              </div>

              <div className="space-y-3">
                {results.results?.map((r) => (
                  <div key={r.question_number} className="border border-gray-700 rounded p-3">
                    <p className="font-medium">{r.question_number}. {r.question_text}</p>
                    <p className={`text-sm ${r.is_correct ? "text-green-400" : "text-red-400"}`}>
                      Your answer: {r.student_answer || "No answer"}
                    </p>
                    {results.should_show_answers && (
                      <p className="text-sm text-gray-300">Correct answer: {r.correct_answer}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q) => (
                <div key={q.question_number} className="border border-gray-700 rounded p-3">
                  <p className="font-medium">{q.question_number}. {q.question_text}</p>
                  <div className="mt-2 space-y-2">
                    {q.options.map((opt, idx) => (
                      <label key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                        <input
                          type="radio"
                          name={`q-${q.question_number}`}
                          value={opt}
                          checked={answers[q.question_number] === opt}
                          onChange={() => handleAnswer(q.question_number, opt)}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <button
                className="bg-amber-500 text-gray-900 px-4 py-2 rounded hover:bg-amber-400 disabled:opacity-50"
                disabled={unansweredCount > 0 || isLoading}
                onClick={handleSubmit}
              >
                {unansweredCount > 0 ? `Answer ${unansweredCount} more` : "Submit"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PacesSection;
