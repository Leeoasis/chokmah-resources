import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLearners,
  updateLearner,
  deleteLearner,
  clearSuccessMessage,
} from "../../../../redux/admin/adminLearnerSlice";

/* ---------- UI Components ---------- */
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

const GroupToggle = ({ value, onChange }) => (
  <div className="inline-flex rounded-xl border border-white/10 bg-white/5 overflow-hidden text-sm">
    {["grade-class", "class-grade"].map((opt) => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={
          "px-3 py-2 border-r border-white/10 last:border-none " +
          (value === opt ? "bg-amber-400 text-gray-900 font-semibold" : "text-gray-300")
        }
      >
        {opt === "grade-class" ? "Grade ▸ Class" : "Class ▸ Grade"}
      </button>
    ))}
  </div>
);

/* ---------- Helpers ---------- */
const uniq = (arr) => [...new Set(arr.filter(Boolean))];
const toStr = (v) => (v ?? "").toString();
const lower = (v) => toStr(v).toLowerCase();

const AdminLearners = () => {
  const dispatch = useDispatch();
  const { learners = [], isLoading, error, successMessage } = useSelector(
    (state) => state.adminLearners || {}
  );

  const [q, setQ] = useState("");
  const [groupBy, setGroupBy] = useState("grade-class");
  const [activeGrade, setActiveGrade] = useState(null);
  const [activeClass, setActiveClass] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editGrade, setEditGrade] = useState("");
  const [editClass, setEditClass] = useState("");
  const [viewingLearner, setViewingLearner] = useState(null);

  useEffect(() => {
    dispatch(fetchLearners());
  }, [dispatch]);

  // Extract unique grades and classes
  const allGrades = useMemo(() => uniq(learners.map((l) => l.child_grade)), [learners]);
  const allClasses = useMemo(() => uniq(learners.map((l) => l.class_name)), [learners]);

  // Filter learners
  const filtered = useMemo(() => {
    const query = lower(q);
    return learners.filter((l) => {
      const matchQ =
        !query ||
        lower(l.child_name).includes(query) ||
        lower(l.email).includes(query) ||
        lower(l.child_grade).includes(query) ||
        lower(l.class_name || "").includes(query);

      const matchGrade = !activeGrade || l.child_grade === activeGrade;
      const matchClass = !activeClass || l.class_name === activeClass;

      return matchQ && matchGrade && matchClass;
    });
  }, [learners, q, activeGrade, activeClass]);

  // Group filtered learners
  const grouped = useMemo(() => {
    const map = new Map();

    const push = (k1, k2, item) => {
      const a = k1 || "—";
      const b = k2 || "—";
      if (!map.has(a)) map.set(a, new Map());
      const inner = map.get(a);
      if (!inner.has(b)) inner.set(b, []);
      inner.get(b).push(item);
    };

    filtered.forEach((l) => {
      const grade = l.child_grade || "No grade";
      const className = l.class_name || "All Classes";

      if (groupBy === "grade-class") push(grade, className, l);
      else push(className, grade, l);
    });

    return map;
  }, [filtered, groupBy]);

  const startEdit = (learner) => {
    setEditingId(learner.id);
    setEditName(learner.child_name || "");
    setEditGrade(learner.child_grade || "");
    setEditClass(learner.class_name || "");
  };

  const saveEdit = () => {
    dispatch(
      updateLearner({
        id: editingId,
        data: {
          child_name: editName,
          child_grade: editGrade,
          class_name: editClass,
        },
      })
    );
    setEditingId(null);
  };

  const handleDelete = async (learner) => {
    const confirmMessage = `Are you sure you want to delete ${learner.child_name}? This action cannot be undone.`;

    if (window.confirm(confirmMessage)) {
      try {
        await dispatch(deleteLearner(learner.id)).unwrap();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Messages */}
      <div className="p-6 bg-gray-900 text-white rounded-2xl border border-white/10">
        <h2 className="text-2xl font-bold mb-4 text-amber-400">Learners</h2>

        {successMessage && (
          <div className="mb-4 p-3 rounded border border-green-600 bg-green-900/30 text-green-200">
            {successMessage}
            <button
              className="ml-2 text-sm underline"
              onClick={() => dispatch(clearSuccessMessage())}
            >
              Dismiss
            </button>
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded border border-red-700 bg-red-900/30 text-red-200">
            {typeof error === "string" ? error : JSON.stringify(error, null, 2)}
          </div>
        )}
      </div>

      {/* Learners List with Filtering */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-amber-400">All Learners</h2>
            <p className="text-sm text-gray-400">
              Grouped by{" "}
              {groupBy === "grade-class" ? "Grade → Class" : "Class → Grade"}.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, email, grade, class…"
              className="w-full sm:w-72 px-3 py-2 rounded-xl bg-gray-900/70 border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/60 text-sm"
            />
            <GroupToggle value={groupBy} onChange={setGroupBy} />
          </div>
        </div>

        {/* Quick filters */}
        <div className="mt-4 space-y-3 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
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

          <div className="hidden sm:block text-xs text-gray-600 mx-2">|</div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 mr-1">Class:</span>
            <Chip active={!activeClass} onClick={() => setActiveClass(null)}>
              All
            </Chip>
            {allClasses.map((c) => (
              <Chip key={c} active={activeClass === c} onClick={() => setActiveClass(c)}>
                {c}
              </Chip>
            ))}
          </div>
        </div>

        {/* Loading / Error */}
        {isLoading && <div className="mt-4 text-gray-300">Loading…</div>}
        {error && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-700 text-red-300 rounded">
            {typeof error === "string" ? error : JSON.stringify(error)}
          </div>
        )}

        {/* Groups */}
        <div className="mt-6 space-y-4">
          {Array.from(grouped.entries()).map(([level1, innerMap]) => {
            const total = [...innerMap.values()].reduce(
              (acc, arr) => acc + arr.length,
              0
            );
            return (
              <Section key={level1} title={level1} count={total} defaultOpen>
                <div className="space-y-4">
                  {Array.from(innerMap.entries()).map(([level2, arr]) => (
                    <div key={level2}>
                      <div className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                        <span className="text-amber-400">▸</span>
                        <span>{level2}</span>
                        <span className="text-xs text-gray-500">({arr.length})</span>
                      </div>
                      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {arr.map((learner) => (
                          <li
                            key={learner.id}
                            className="rounded-xl border border-white/10 bg-gray-800/50 p-4 hover:border-amber-400/40 transition"
                          >
                            {editingId === learner.id ? (
                              <div className="space-y-2">
                                <div>
                                  <label className="text-xs text-gray-400 block mb-1">
                                    Name
                                  </label>
                                  <input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full px-2 py-1 rounded bg-gray-700 text-white text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-gray-400 block mb-1">
                                    Grade
                                  </label>
                                  <input
                                    value={editGrade}
                                    onChange={(e) => setEditGrade(e.target.value)}
                                    className="w-full px-2 py-1 rounded bg-gray-700 text-white text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-gray-400 block mb-1">
                                    Class
                                  </label>
                                  <input
                                    value={editClass}
                                    onChange={(e) => setEditClass(e.target.value)}
                                    className="w-full px-2 py-1 rounded bg-gray-700 text-white text-sm"
                                  />
                                </div>
                                <div className="flex gap-2 pt-2">
                                  <button
                                    onClick={saveEdit}
                                    className="text-green-400 hover:text-green-300 text-xs"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="text-gray-400 hover:text-gray-300 text-xs"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center justify-between gap-2">
                                  <div className="font-semibold text-white truncate">
                                    {learner.child_name}
                                  </div>
                                </div>

                                <div className="text-xs text-gray-400 mt-1 flex flex-wrap gap-x-2">
                                  {learner.email && <span>{learner.email}</span>}
                                  {learner.child_grade && (
                                    <span>• Grade {learner.child_grade}</span>
                                  )}
                                  {learner.class_name && (
                                    <span>• {learner.class_name}</span>
                                  )}
                                </div>

                                {learner.teacher_name && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    Teacher: {learner.teacher_name}
                                  </div>
                                )}

                                <div className="flex gap-2 mt-3">
                                  <button
                                    onClick={() => setViewingLearner(learner)}
                                    className="inline-block text-amber-400 hover:text-amber-300 text-xs font-medium"
                                  >
                                    View →
                                  </button>
                                  <button
                                    onClick={() => startEdit(learner)}
                                    className="inline-block text-blue-400 hover:text-blue-300 text-xs font-medium"
                                  >
                                    Edit →
                                  </button>
                                  <button
                                    onClick={() => handleDelete(learner)}
                                    className="inline-block text-red-400 hover:text-red-300 text-xs font-medium"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Section>
            );
          })}

          {!isLoading && filtered.length === 0 && !error && (
            <div className="text-gray-400">No learners match your filters.</div>
          )}
        </div>
      </section>

      {/* Viewing Modal */}
      {viewingLearner && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg w-96 shadow-lg border border-white/20">
            <h3 className="text-lg font-bold text-amber-400 mb-4">
              Learner Details
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Name:</strong> {viewingLearner.child_name}
              </p>
              <p>
                <strong>Email:</strong> {viewingLearner.email}
              </p>
              <p>
                <strong>Grade:</strong> {viewingLearner.child_grade}
              </p>
              {viewingLearner.class_name && (
                <p>
                  <strong>Class:</strong> {viewingLearner.class_name}
                </p>
              )}
              {viewingLearner.teacher_name && (
                <p>
                  <strong>Teacher:</strong> {viewingLearner.teacher_name}
                </p>
              )}
            </div>
            <div className="mt-4 p-3 bg-gray-900/60 rounded border border-amber-400/30">
              <p className="text-xs text-gray-400 mb-1">Invitation Token:</p>
              <code className="text-amber-300 break-all block text-xs">
                {viewingLearner.invitation_token || "Not available"}
              </code>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setViewingLearner(null)}
                className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLearners;
