import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadPace,
  fetchAdminPaces,
  togglePaceActive,
  fetchPaceResults,
  clearPaceMessage,
} from "../../../../redux/admin/pacesSlice";

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

const AdminPaces = () => {
  const dispatch = useDispatch();
  const { pacesByGrade, resultsByPace, isLoading, error, successMessage } = useSelector(
    (state) => state.adminPaces
  );

  const [uploadMode, setUploadMode] = useState("builder");
  const [file, setFile] = useState(null);
  const [selectedResultsId, setSelectedResultsId] = useState(null);
  const [builderError, setBuilderError] = useState(null);
  const [activeGrade, setActiveGrade] = useState(null);
  const [paceForm, setPaceForm] = useState({
    title: "",
    description: "",
    subject: "",
    grade_level: "",
    class_name: "",
    passing_score: 60,
    time_limit_minutes: "",
    questions: [
      { question_text: "", options: ["", ""], correct_answer: "", points: 1 },
    ],
  });

  useEffect(() => {
    dispatch(fetchAdminPaces());
  }, [dispatch]);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) return;

    dispatch(uploadPace(file)).then(() => {
      dispatch(fetchAdminPaces());
      setFile(null);
    });
  };

  const handleToggle = (paceId) => {
    dispatch(togglePaceActive(paceId));
  };

  const handleViewResults = (paceId) => {
    setSelectedResultsId(paceId);
    dispatch(fetchPaceResults(paceId));
  };

  const results = selectedResultsId ? resultsByPace[selectedResultsId] : null;

  const allPaces = useMemo(
    () => Object.values(pacesByGrade || {}).flat(),
    [pacesByGrade]
  );

  const allGrades = useMemo(
    () => [...new Set(allPaces.map((p) => p.grade_level).filter(Boolean))],
    [allPaces]
  );

  const filteredPaces = useMemo(() => {
    return allPaces.filter((p) => !activeGrade || p.grade_level === activeGrade);
  }, [allPaces, activeGrade]);

  const groupedPaces = useMemo(() => {
    const map = new Map();

    const push = (k1, k2, k3, item) => {
      const a = k1 || "No grade";
      const b = k2 === true ? "Active" : "Inactive";
      const c = k3 || "No subject";
      if (!map.has(a)) map.set(a, new Map());
      const level2 = map.get(a);
      if (!level2.has(b)) level2.set(b, new Map());
      const level3 = level2.get(b);
      if (!level3.has(c)) level3.set(c, []);
      level3.get(c).push(item);
    };

    filteredPaces.forEach((p) => {
      const grade = p.grade_level || "No grade";
      const isActive = p.active ?? false;
      const subject = p.subject || "No subject";
      push(grade, isActive, subject, p);
    });

    return map;
  }, [filteredPaces]);

  const updatePaceField = (field, value) => {
    setPaceForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateQuestionField = (index, field, value) => {
    setPaceForm((prev) => {
      const updated = [...prev.questions];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, questions: updated };
    });
  };

  const updateOption = (qIndex, optIndex, value) => {
    setPaceForm((prev) => {
      const updated = [...prev.questions];
      const options = [...updated[qIndex].options];
      options[optIndex] = value;
      updated[qIndex] = { ...updated[qIndex], options };
      return { ...prev, questions: updated };
    });
  };

  const addOption = (qIndex) => {
    setPaceForm((prev) => {
      const updated = [...prev.questions];
      updated[qIndex] = {
        ...updated[qIndex],
        options: [...updated[qIndex].options, ""],
      };
      return { ...prev, questions: updated };
    });
  };

  const removeOption = (qIndex, optIndex) => {
    setPaceForm((prev) => {
      const updated = [...prev.questions];
      const options = updated[qIndex].options.filter((_, i) => i !== optIndex);
      updated[qIndex] = { ...updated[qIndex], options };
      return { ...prev, questions: updated };
    });
  };

  const addQuestion = () => {
    setPaceForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { question_text: "", options: ["", ""], correct_answer: "", points: 1 },
      ],
    }));
  };

  const removeQuestion = (index) => {
    setPaceForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleBuilderUpload = (e) => {
    e.preventDefault();
    setBuilderError(null);

    if (!paceForm.title || !paceForm.subject || !paceForm.grade_level) {
      setBuilderError("Title, Subject, and Grade Level are required.");
      return;
    }

    if (!paceForm.questions.length) {
      setBuilderError("Please add at least one question.");
      return;
    }

    const questions = paceForm.questions.map((q, idx) => {
      const options = q.options.map((o) => o.trim()).filter(Boolean);
      return {
        question_number: idx + 1,
        question_text: q.question_text,
        options,
        correct_answer: q.correct_answer,
        points: Number(q.points || 1),
      };
    });

    if (questions.some((q) => !q.question_text || q.options.length < 2 || !q.correct_answer)) {
      setBuilderError("Each question needs text, at least 2 options, and a correct answer.");
      return;
    }

    if (questions.some((q) => !q.options.includes(q.correct_answer))) {
      setBuilderError("Correct answer must match one of the options.");
      return;
    }

    const payload = {
      title: paceForm.title,
      description: paceForm.description,
      subject: paceForm.subject,
      grade_level: paceForm.grade_level,
      class_name: paceForm.class_name || null,
      passing_score: Number(paceForm.passing_score || 60),
      time_limit_minutes: paceForm.time_limit_minutes ? Number(paceForm.time_limit_minutes) : null,
      questions,
    };

    const fileBlob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const fileName = `${paceForm.title.replace(/\s+/g, "-").toLowerCase()}.json`;
    const jsonFile = new File([fileBlob], fileName, { type: "application/json" });

    dispatch(uploadPace(jsonFile)).then(() => {
      dispatch(fetchAdminPaces());
      setPaceForm({
        title: "",
        description: "",
        subject: "",
        grade_level: "",
        class_name: "",
        passing_score: 60,
        time_limit_minutes: "",
        questions: [
          { question_text: "", options: ["", ""], correct_answer: "", points: 1 },
        ],
      });
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setUploadMode("builder")}
            className={`px-3 py-2 rounded text-sm ${uploadMode === "builder" ? "bg-amber-500 text-gray-900" : "bg-gray-700 text-gray-200"}`}
          >
            Build PACE
          </button>
          <button
            onClick={() => setUploadMode("json")}
            className={`px-3 py-2 rounded text-sm ${uploadMode === "json" ? "bg-amber-500 text-gray-900" : "bg-gray-700 text-gray-200"}`}
          >
            Upload File (JSON/Excel)
          </button>
        </div>

        {uploadMode === "builder" ? (
          <form onSubmit={handleBuilderUpload} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Title"
                value={paceForm.title}
                onChange={(e) => updatePaceField("title", e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Subject"
                value={paceForm.subject}
                onChange={(e) => updatePaceField("subject", e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Grade Level"
                value={paceForm.grade_level}
                onChange={(e) => updatePaceField("grade_level", e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Class Name (e.g., 8A, 8B, or leave blank for all)"
                value={paceForm.class_name}
                onChange={(e) => updatePaceField("class_name", e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="Passing Score (%)"
                value={paceForm.passing_score}
                onChange={(e) => updatePaceField("passing_score", e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="Time Limit (minutes)"
                value={paceForm.time_limit_minutes}
                onChange={(e) => updatePaceField("time_limit_minutes", e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Description"
                value={paceForm.description}
                onChange={(e) => updatePaceField("description", e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-4">
              {paceForm.questions.map((q, qIndex) => (
                <div key={qIndex} className="border border-gray-700 rounded p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Question {qIndex + 1}</h4>
                    {paceForm.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-sm text-red-400"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Question text"
                    value={q.question_text}
                    onChange={(e) => updateQuestionField(qIndex, "question_text", e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
                  />

                  <div className="space-y-2">
                    {q.options.map((opt, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder={`Option ${optIndex + 1}`}
                          value={opt}
                          onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                          className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
                        />
                        {q.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(qIndex, optIndex)}
                            className="text-xs text-red-400"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addOption(qIndex)}
                      className="text-xs text-gray-300 underline"
                    >
                      Add option
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Correct answer (must match an option)"
                      value={q.correct_answer}
                      onChange={(e) => updateQuestionField(qIndex, "correct_answer", e.target.value)}
                      className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Points"
                      value={q.points}
                      onChange={(e) => updateQuestionField(qIndex, "points", e.target.value)}
                      className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addQuestion}
              className="text-sm text-gray-300 underline"
            >
              Add question
            </button>

            {builderError && <p className="text-red-400">{builderError}</p>}

            <button
              type="submit"
              className="bg-amber-500 text-gray-900 px-4 py-2 rounded hover:bg-amber-400 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Create PACE"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleUpload} className="space-y-3">
            <input
              type="file"
              accept="application/json"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-300 file:bg-amber-500 file:text-gray-900 file:px-4 file:py-2 file:rounded file:border-0"
            />
            <button
              type="submit"
              disabled={!file || isLoading}
              className="bg-amber-500 text-gray-900 px-4 py-2 rounded hover:bg-amber-400 disabled:opacity-50"
            >
              {isLoading ? "Uploading..." : "Upload PACE"}
            </button>
          </form>
        )}

        {successMessage && (
          <p className="text-green-400 mt-2" onClick={() => dispatch(clearPaceMessage())}>
            {successMessage}
          </p>
        )}
        {error && <p className="text-red-400 mt-2">{error?.error || error}</p>}
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-xl font-bold mb-3">Uploaded PACEs</h3>

        {allPaces.length === 0 ? (
          <p className="text-gray-400">No PACEs uploaded yet.</p>
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
              {Array.from(groupedPaces.entries()).map(([grade, activeMap]) => {
                const gradeTotal = [...activeMap.values()].reduce(
                  (acc, subjectMap) => acc + [...subjectMap.values()].reduce((s, arr) => s + arr.length, 0),
                  0
                );
                return (
                  <Section key={grade} title={`Grade ${grade}`} count={gradeTotal} defaultOpen>
                    <div className="space-y-3">
                      {Array.from(activeMap.entries()).map(([status, subjectMap]) => {
                        const statusTotal = [...subjectMap.values()].reduce((acc, arr) => acc + arr.length, 0);
                        return (
                          <Section key={status} title={status} count={statusTotal} defaultOpen>
                            <div className="space-y-3">
                              {Array.from(subjectMap.entries()).map(([subject, arr]) => (
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
                                        </div>

                                        <div className="text-xs text-gray-400 mt-1 flex flex-wrap gap-x-2">
                                          {pace.subject && <span>{pace.subject}</span>}
                                          {pace.grade_level && <span>• Grade {pace.grade_level}</span>}
                                          {pace.total_questions != null && (
                                            <span>• {pace.total_questions} Questions</span>
                                          )}
                                        </div>

                                        <div className="text-xs text-gray-500 mt-1">
                                          Passing Score: {pace.passing_score}% • Attempts: {pace.attempts_count || 0}
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-3">
                                          <button
                                            onClick={() => handleToggle(pace.id)}
                                            className={`px-3 py-2 rounded text-sm ${
                                              pace.active ? "bg-green-600" : "bg-gray-600"
                                            }`}
                                          >
                                            {pace.active ? "Active" : "Inactive"}
                                          </button>
                                          <button
                                            onClick={() => handleViewResults(pace.id)}
                                            className="px-3 py-2 rounded text-sm bg-blue-600 hover:bg-blue-500"
                                          >
                                            View Results
                                          </button>
                                        </div>

                                        {selectedResultsId === pace.id && results && (
                                          <div className="mt-4 border-t border-gray-700 pt-4">
                                            <h5 className="font-semibold mb-2">Results</h5>
                                            {results?.results?.length ? (
                                              <div className="space-y-2">
                                                {results.results.map((r, idx) => (
                                                  <div key={idx} className="text-sm text-gray-300">
                                                    {r.learner_name} ({r.learner_email}) • Attempt {r.attempt_number} • {r.percentage}% ({r.passed ? "Passed" : "Failed"})
                                                  </div>
                                                ))}
                                              </div>
                                            ) : (
                                              <p className="text-gray-400 text-sm">No attempts yet.</p>
                                            )}
                                          </div>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                </Section>
                              ))}
                            </div>
                          </Section>
                        );
                      })}
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
    </div>
  );
};

export default AdminPaces;
