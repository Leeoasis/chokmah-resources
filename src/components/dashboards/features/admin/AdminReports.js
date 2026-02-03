import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  uploadReport,
  fetchReports,
  clearSuccessMessage,
} from '../../../../redux/admin/reportsSlice';
import { fetchLearners } from '../../../../redux/admin/adminLearnerSlice';

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
    {["year-term", "term-year", "subject-year"].map((opt) => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={
          "px-3 py-2 border-r border-white/10 last:border-none " +
          (value === opt ? "bg-amber-400 text-gray-900 font-semibold" : "text-gray-300")
        }
      >
        {opt === "year-term" ? "Year ▸ Term" : opt === "term-year" ? "Term ▸ Year" : "Subject ▸ Year"}
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
  const dt = safeDate(r.uploaded_at || r.created_at);
  return dt ? dt.getFullYear() : "No year";
};

const AdminReports = () => {
  const dispatch = useDispatch();
  const { reports = [], isLoading, error, successMessage } = useSelector(
    (state) => state.reports || {}
  );
  const { learners = [] } = useSelector((state) => state.adminLearners || {});

  // Filter to only show actual learners (not teachers)
  const actualLearners = learners.filter(learner => learner.role === 'learner');

  // UI state for filtering and grouping
  const [q, setQ] = useState("");
  const [groupBy, setGroupBy] = useState("year-term");
  const [activeYear, setActiveYear] = useState(null);
  const [activeTerm, setActiveTerm] = useState(null);
  const [activeSubject, setActiveSubject] = useState(null);

  // Form state
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [learnerId, setLearnerId] = useState('');
  const [term, setTerm] = useState('Term 1');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [subject, setSubject] = useState('');

  useEffect(() => {
    dispatch(fetchReports());
    dispatch(fetchLearners());
  }, [dispatch]);

  // facets for filtering
  const allYears = useMemo(() => uniq(reports.map((r) => yearOf(r))), [reports]);
  const allTerms = useMemo(() => uniq(reports.map((r) => r.term)), [reports]);
  const allSubjects = useMemo(() => uniq(reports.map((r) => r.subject)), [reports]);

  // filter + search
  const filtered = useMemo(() => {
    const query = lower(q);
    return reports.filter((r) => {
      const matchQ =
        !query ||
        lower(r.title).includes(query) ||
        lower(r.subject).includes(query) ||
        lower(r.term).includes(query) ||
        lower(r.learner_name).includes(query);

      const y = yearOf(r);
      const matchYear = !activeYear || y === activeYear;
      const matchTerm = !activeTerm || r.term === activeTerm;
      const matchSubject = !activeSubject || r.subject === activeSubject;

      return matchQ && matchYear && matchTerm && matchSubject;
    });
  }, [reports, q, activeYear, activeTerm, activeSubject]);

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
      const year = yearOf(r);
      const term = r.term || "No term";
      const subj = r.subject || "No subject";

      if (groupBy === "year-term") push(year, term, r);
      else if (groupBy === "term-year") push(term, year, r);
      else push(subj, year, r); // subject-year
    });

    return map;
  }, [filtered, groupBy]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !file || !learnerId) {
      alert('Please fill all required fields and attach a file.');
      return;
    }

    const formData = new FormData();
    formData.append('report[title]', title);
    formData.append('report[file]', file);
    formData.append('report[learner_id]', learnerId);
    if (term) formData.append('report[term]', term);
    if (year) formData.append('report[year]', year);
    if (subject) formData.append('report[subject]', subject);

    dispatch(uploadReport(formData)).then((res) => {
      if (res.meta?.requestStatus === 'fulfilled') {
        setTitle('');
        setFile(null);
        setLearnerId('');
        setTerm('Term 1');
        setYear(String(new Date().getFullYear()));
        setSubject('');
        dispatch(fetchReports());
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <div className="p-6 bg-gray-900 text-white rounded-2xl border border-white/10">
        <h2 className="text-2xl font-bold mb-4 text-amber-400">Admin — Upload Reports</h2>

        {successMessage && (
          <div className="mb-4 p-3 rounded border border-green-600 bg-green-900/30 text-green-200">
            {successMessage}{' '}
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
            {typeof error === 'string' ? error : JSON.stringify(error, null, 2)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-white/10 bg-gray-800 text-white p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-amber-400/60"
              placeholder="e.g., Term 1 Progress Report"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Select Learner *</label>
            <select
              value={learnerId}
              onChange={(e) => setLearnerId(e.target.value)}
              className="border border-white/10 bg-gray-800 text-white p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-amber-400/60"
              required
            >
              <option value="">— Choose Learner —</option>
              {actualLearners.map((learner) => (
                <option key={learner.id} value={learner.id}>
                  {learner.child_name || learner.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Term *</label>
            <select
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="border border-white/10 bg-gray-800 text-white p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-amber-400/60"
              required
            >
              {['Term 1', 'Term 2', 'Term 3', 'Term 4'].map((t) => (
                <option key={t} value={t}>{t}</option>
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
              className="border border-white/10 bg-gray-800 text-white p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-amber-400/60"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Subject (optional)</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border border-white/10 bg-gray-800 text-white p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-amber-400/60"
              placeholder="e.g., Mathematics"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">File *</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="border border-white/10 bg-gray-800 text-white p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-amber-400/60"
              required
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-amber-500 text-gray-900 font-semibold px-4 py-2 rounded hover:bg-amber-400 transition disabled:opacity-50"
            >
              {isLoading ? 'Uploading…' : 'Upload Report'}
            </button>
          </div>
        </form>
      </div>

      {/* Reports List with Filtering */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-amber-400">All Reports</h2>
            <p className="text-sm text-gray-400">
              Grouped by {groupBy === "year-term" ? "Year → Term" : groupBy === "term-year" ? "Term → Year" : "Subject → Year"}.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title, subject, learner…"
              className="w-full sm:w-72 px-3 py-2 rounded-xl bg-gray-900/70 border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/60 text-sm"
            />
            <GroupToggle value={groupBy} onChange={setGroupBy} />
          </div>
        </div>

        {/* Quick filters */}
        <div className="mt-4 space-y-3 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 mr-1">Year:</span>
            <Chip active={!activeYear} onClick={() => setActiveYear(null)}>All</Chip>
            {allYears.map((y) => (
              <Chip key={y} active={activeYear === y} onClick={() => setActiveYear(y)}>
                {y}
              </Chip>
            ))}
          </div>

          <div className="hidden sm:block text-xs text-gray-600 mx-2">|</div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 mr-1">Term:</span>
            <Chip active={!activeTerm} onClick={() => setActiveTerm(null)}>All</Chip>
            {allTerms.map((t) => (
              <Chip key={t} active={activeTerm === t} onClick={() => setActiveTerm(t)}>
                {t}
              </Chip>
            ))}
          </div>

          <div className="hidden sm:block text-xs text-gray-600 mx-2">|</div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 mr-1">Subject:</span>
            <Chip active={!activeSubject} onClick={() => setActiveSubject(null)}>All</Chip>
            {allSubjects.map((s) => (
              <Chip key={s} active={activeSubject === s} onClick={() => setActiveSubject(s)}>
                {s}
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
            const total = [...innerMap.values()].reduce((acc, arr) => acc + arr.length, 0);
            return (
              <Section key={level1} title={level1} count={total} defaultOpen>
                <div className="space-y-3">
                  {Array.from(innerMap.entries()).map(([level2, arr]) => (
                    <Section key={level2} title={level2} count={arr.length}>
                      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {arr.map((report) => {
                          const uploaded = safeDate(report.uploaded_at || report.created_at);

                          return (
                            <li
                              key={report.id}
                              className="rounded-xl border border-white/10 bg-gray-800/50 p-4 hover:border-amber-400/40 transition"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="font-semibold text-white truncate">
                                  {report.title || `${report.subject || "Report"} (${report.term || ""})`}
                                </div>
                              </div>

                              <div className="text-xs text-gray-400 mt-1 flex flex-wrap gap-x-2">
                                {report.subject && <span>{report.subject}</span>}
                                {report.term && <span>• {report.term}</span>}
                                {report.learner_name && <span>• {report.learner_name}</span>}
                              </div>

                              <div className="text-xs text-gray-500 mt-1">
                                {uploaded && <span>Uploaded: {uploaded.toLocaleDateString()}</span>}
                              </div>

                              {report.url && (
                                <a
                                  href={report.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block mt-2 text-amber-400 hover:text-amber-300 font-medium"
                                >
                                  Download Report →
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

          {!isLoading && filtered.length === 0 && !error && (
            <div className="text-gray-400">No reports match your filters.</div>
          )}
        </div>
      </section>
    </div>
  );
};


export default AdminReports;
