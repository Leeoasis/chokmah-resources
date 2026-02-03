// AdminResources.js (AdminResourceUploadForm)
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

// ✅ Correct: fetch learners from adminLearnerSlice
import { fetchLearners } from "../../../../redux/admin/adminLearnerSlice";
import {
  uploadResource,
  clearResourcesSuccess,
} from "../../../../redux/parent/resourcesSlice";

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
      "text-xs px-2 py-1 rounded-full border transition",
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
    {["subject-type", "type-subject", "year-subject"].map((opt) => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={
          "px-3 py-2 border-r border-white/10 last:border-none " +
          (value === opt ? "bg-amber-400 text-gray-900 font-semibold" : "text-gray-300")
        }
      >
        {opt === "subject-type" ? "Subject ▸ Type" : opt === "type-subject" ? "Type ▸ Subject" : "Year ▸ Subject"}
      </button>
    ))}
  </div>
);

/* ---------- Helpers ---------- */
const uniq = (arr) => [...new Set(arr.filter(Boolean))];
const toStr = (v) => (v ?? "").toString();
const lower = (v) => toStr(v).toLowerCase();
const safeDate = (d) => {
  try {
    const dt = new Date(d);
    return isNaN(dt) ? null : dt;
  } catch {
    return null;
  }
};
const yearOf = (r) => {
  if (r.year) return r.year;
  const dt = safeDate(r.created_at);
  return dt ? dt.getFullYear() : "No year";
};

const AdminResourceUploadForm = () => {
  const dispatch = useDispatch();

  // Local form state
  const [selectedLearner, setSelectedLearner] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [resourceType, setResourceType] = useState("Homework");
  const [term, setTerm] = useState("Term 1");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [file, setFile] = useState(null);

  // UI state for filtering and grouping
  const [q, setQ] = useState("");
  const [groupBy, setGroupBy] = useState("subject-type");
  const [activeYear, setActiveYear] = useState(null);
  const [activeSubject, setActiveSubject] = useState(null);
  const [activeType, setActiveType] = useState(null);

  // ✅ Learners from adminLearners slice
  const { learners = [], isLoading: learnersLoading, error: learnersError } =
    useSelector((state) => state.adminLearners || {});

  // Filter to only show actual learners (not teachers)
  const actualLearners = learners.filter(learner => learner.role === 'learner');

  // Resources slice (upload + messages)
  const {
    isLoading: resourcesLoading,
    error: resourcesError,
    successMessage,
    items = [],
  } = useSelector((state) => state.resources || {});

  useEffect(() => {
    dispatch(fetchLearners());
  }, [dispatch]);

  // facets for filtering
  const allYears = useMemo(() => uniq(items.map((r) => yearOf(r))), [items]);
  const allSubjects = useMemo(() => uniq(items.map((r) => r.subject)), [items]);
  const allTypes = useMemo(() => uniq(items.map((r) => r.resource_type)), [items]);

  // filter + search
  const filtered = useMemo(() => {
    const query = lower(q);
    return items.filter((r) => {
      const matchQ =
        !query ||
        lower(r.title).includes(query) ||
        lower(r.subject).includes(query) ||
        lower(r.description).includes(query) ||
        lower(r.resource_type).includes(query);

      const y = yearOf(r);
      const matchYear = !activeYear || y === activeYear;
      const matchSubject = !activeSubject || r.subject === activeSubject;
      const matchType = !activeType || r.resource_type === activeType;

      return matchQ && matchYear && matchSubject && matchType;
    });
  }, [items, q, activeYear, activeSubject, activeType]);

  // grouping logic
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

    filtered.forEach((r) => {
      const subj = r.subject || "No subject";
      const type = r.resource_type || "No type";
      const year = yearOf(r);

      if (groupBy === "subject-type") push(subj, type, r);
      else if (groupBy === "type-subject") push(type, subj, r);
      else push(year, subj, r); // year-subject
    });

    return map;
  }, [filtered, groupBy]);

  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(() => dispatch(clearResourcesSuccess()), 3000);
      return () => clearTimeout(t);
    }
  }, [successMessage, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedLearner || !title || !file) return;

    const formData = new FormData();
    formData.append("resource[title]", title);
    if (description) formData.append("resource[description]", description);
    if (subject) formData.append("resource[subject]", subject);
    if (resourceType) formData.append("resource[resource_type]", resourceType);
    if (term) formData.append("resource[term]", term);
    if (year) formData.append("resource[year]", year);
    formData.append("resource[file]", file);
    formData.append("resource[teacher_id]", selectedLearner);

    dispatch(uploadResource(formData)).then((res) => {
      if (res.meta?.requestStatus === "fulfilled") {
        setTitle("");
        setDescription("");
        setSubject("");
        setResourceType("Homework");
        setTerm("Term 1");
        setYear(String(new Date().getFullYear()));
        setFile(null);
        setSelectedLearner("");
      }
    });
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user?.role !== "admin") {
    return (
      <div className="p-6 bg-gray-900 text-white rounded-2xl border border-white/10">
        <h2 className="text-xl font-bold mb-2 text-amber-400">
          Upload Learner Resource
        </h2>
        <p className="p-3 rounded border border-yellow-600 bg-yellow-900/30 text-yellow-200">
          You must be an admin to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 text-white rounded-2xl border border-white/10">
      <h2 className="text-2xl font-bold mb-4 text-amber-400">
        Admin — Upload Resources
      </h2>

      {/* Success & error banners */}
      {successMessage && (
        <p className="mb-4 p-3 rounded border border-green-600 bg-green-900/30 text-green-200">
          {successMessage}
        </p>
      )}
      {learnersError && (
        <p className="mb-4 p-3 rounded border border-red-700 bg-red-900/30 text-red-200">
          {String(learnersError)}
        </p>
      )}
      {resourcesError && (
        <p className="mb-4 p-3 rounded border border-red-700 bg-red-900/30 text-red-200">
          {String(resourcesError)}
        </p>
      )}

      {/* Upload Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">
            Select Learner *
          </label>
          <select
            value={selectedLearner}
            onChange={(e) => setSelectedLearner(e.target.value)}
            required
            className="w-full p-2 border border-white/10 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          >
            <option value="">Choose a learner</option>
            {actualLearners.map((learner) => (
              <option key={learner.id} value={learner.id}>
                {learner.child_name || learner.email}
                {learner.child_grade ? ` (Grade ${learner.child_grade})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            type="text"
            placeholder="e.g., Fractions Study Guide"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border border-white/10 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Description (optional)
          </label>
          <textarea
            placeholder="Short note for parents/learners"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-2 border border-white/10 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Subject (optional)
          </label>
          <input
            type="text"
            placeholder="e.g., Mathematics"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border border-white/10 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Resource Type *
          </label>
          <select
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value)}
            required
            className="w-full p-2 border border-white/10 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          >
            {["Homework", "Textbook", "Worksheet", "Exam Paper", "Notes"].map(
              (rt) => (
                <option key={rt} value={rt}>
                  {rt}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Term *</label>
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full p-2 border border-white/10 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/60"
            required
          >
            {["Term 1", "Term 2", "Term 3", "Term 4"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Year *</label>
          <input
            type="number"
            inputMode="numeric"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-2 border border-white/10 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/60"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">File *</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.png,.ppt,.pptx,.mp4"
            onChange={(e) => setFile(e.target.files[0])}
            required
            className="w-full p-2 border border-white/10 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={resourcesLoading || learnersLoading}
            className="bg-amber-500 text-gray-900 font-semibold w-full py-2 rounded hover:bg-amber-400 transition disabled:opacity-50"
          >
            {resourcesLoading ? "Uploading…" : "Upload Resource"}
          </button>
        </div>
      </form>

      {items.length > 0 && (
        <>
          {/* Resources List with Filtering */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white mt-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-amber-400">All Resources</h2>
                <p className="text-sm text-gray-400">
                  Grouped by {groupBy === "subject-type" ? "Subject → Type" : groupBy === "type-subject" ? "Type → Subject" : "Year → Subject"}.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search title, subject, description…"
                  className="w-full sm:w-72 px-3 py-2 rounded-xl bg-gray-900/70 border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/60 text-sm"
                />
                <GroupToggle value={groupBy} onChange={setGroupBy} />
              </div>
            </div>

            {/* Quick filters */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-400 mr-1">Year:</span>
              <Chip active={!activeYear} onClick={() => setActiveYear(null)}>All</Chip>
              {allYears.map((y) => (
                <Chip key={y} active={activeYear === y} onClick={() => setActiveYear(y)}>
                  {y}
                </Chip>
              ))}

              <span className="text-xs text-gray-600 mx-2">|</span>

              <span className="text-xs text-gray-400 mr-1">Subject:</span>
              <Chip active={!activeSubject} onClick={() => setActiveSubject(null)}>All</Chip>
              {allSubjects.map((s) => (
                <Chip key={s} active={activeSubject === s} onClick={() => setActiveSubject(s)}>
                  {s}
                </Chip>
              ))}

              <span className="text-xs text-gray-600 mx-2">|</span>

              <span className="text-xs text-gray-400 mr-1">Type:</span>
              <Chip active={!activeType} onClick={() => setActiveType(null)}>All</Chip>
              {allTypes.map((t) => (
                <Chip key={t} active={activeType === t} onClick={() => setActiveType(t)}>
                  {t}
                </Chip>
              ))}
            </div>

            {/* Loading / Error */}
            {resourcesLoading && <div className="mt-4 text-gray-300">Loading…</div>}
            {resourcesError && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-700 text-red-300 rounded">
                {typeof resourcesError === "string" ? resourcesError : JSON.stringify(resourcesError)}
              </div>
            )}

            {/* Groups */}
            <div className="mt-6 space-y-4">
              {Array.from(grouped.entries()).map(([level1, innerMap]) => {
                const total = [...innerMap.values()].reduce((acc, arr) => acc + arr.length, 0);
                return (
                  <Section key={level1} title={level1} count={total} defaultOpen>
                    <div className="space-y-3">
                      {Array.from(innerMap.entries()).map(([level2, arr]) => (
                        <Section key={level2} title={level2} count={arr.length}>
                          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {arr.map((resource) => {
                              const uploaded = safeDate(resource.created_at);

                              return (
                                <li
                                  key={resource.id}
                                  className="rounded-xl border border-white/10 bg-gray-800/50 p-4 hover:border-amber-400/40 transition"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="font-semibold text-white truncate">
                                      {resource.title}
                                    </div>
                                  </div>

                                  <div className="text-xs text-gray-400 mt-1 flex flex-wrap gap-x-2">
                                    {resource.subject && <span>{resource.subject}</span>}
                                    {resource.resource_type && <span>• {resource.resource_type}</span>}
                                    {resource.term && <span>• {resource.term}</span>}
                                  </div>

                                  <div className="text-xs text-gray-400 mt-1">
                                    {resource.description && <div>{resource.description}</div>}
                                  </div>

                                  <div className="text-xs text-gray-500 mt-1">
                                    {uploaded && <span>Uploaded: {uploaded.toLocaleDateString()}</span>}
                                  </div>

                                  {resource.url && (
                                    <a
                                      href={resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-block mt-2 text-amber-400 hover:text-amber-300 font-medium"
                                    >
                                      Download Resource →
                                    </a>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </Section>
                      ))}
                    </div>
                  </Section>
                );
              })}

              {!resourcesLoading && filtered.length === 0 && !resourcesError && (
                <div className="text-gray-400">No resources match your filters.</div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default AdminResourceUploadForm;
