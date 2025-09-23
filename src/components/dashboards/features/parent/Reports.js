// src/pages/.../Reports.js (ParentReportsList)
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReports } from "../../../../redux/admin/reportsSlice";

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
    {["year-term", "term-year"].map((opt) => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={
          "px-3 py-2 border-r border-white/10 last:border-none " +
          (value === opt ? "bg-amber-400 text-gray-900 font-semibold" : "text-gray-300")
        }
      >
        {opt === "year-term" ? "Year ▸ Term" : "Term ▸ Year"}
      </button>
    ))}
  </div>
);

/* ---------- helpers ---------- */
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
  // Prefer explicit `year` if present; else infer from uploaded/created date
  if (r.year) return r.year;
  const dt = safeDate(r.uploaded_at || r.created_at);
  return dt ? dt.getFullYear() : "No year";
};

/* ---------- Component ---------- */
const ParentReportsList = () => {
  const dispatch = useDispatch();
  const { reports = [], isLoading, error } = useSelector((state) => state.reports || {});

  // UI state
  const [q, setQ] = useState("");
  const [groupBy, setGroupBy] = useState("year-term");
  const [activeYear, setActiveYear] = useState(null);
  const [activeTerm, setActiveTerm] = useState(null);
  const [onlyNew, setOnlyNew] = useState(false);

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  // facets
  const allYears = useMemo(() => uniq(reports.map((r) => yearOf(r))), [reports]);
  const allTerms = useMemo(() => uniq(reports.map((r) => r.term)), [reports]);

  // filter + search
  const filtered = useMemo(() => {
    const query = lower(q);
    return reports.filter((r) => {
      const uploaded = safeDate(r.uploaded_at || r.created_at);
      const seenFlag = typeof r.seen === "boolean" ? r.seen : null;
      const isNew =
        seenFlag === null
          ? uploaded
            ? (Date.now() - uploaded.getTime()) / (1000 * 60 * 60 * 24) <= 10
            : false
          : !seenFlag;

      const matchQ =
        !query ||
        lower(r.title).includes(query) ||
        lower(r.subject).includes(query) ||
        lower(r.term).includes(query) ||
        lower(r.teacher || r.teacher_name || r.reported_by).includes(query) ||
        lower(r.type || r.assessment_type || r.category).includes(query);

      const y = yearOf(r);
      const matchYear = !activeYear || y === activeYear;
      const matchTerm = !activeTerm || r.term === activeTerm;

      return matchQ && matchYear && matchTerm && (!onlyNew || isNew);
    });
  }, [reports, q, activeYear, activeTerm, onlyNew]);

  // grouping: YEAR -> TERM (or TERM -> YEAR)
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
      if (groupBy === "year-term") push(year, term, r);
      else push(term, year, r); // term-year
    });

    return map;
  }, [filtered, groupBy]);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-amber-400">My Child’s Reports</h2>
          <p className="text-sm text-gray-400">Grouped by {groupBy === "year-term" ? "Year → Term" : "Term → Year"}.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, subject, teacher…"
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

        <span className="text-xs text-gray-400 mr-1">Term:</span>
        <Chip active={!activeTerm} onClick={() => setActiveTerm(null)}>All</Chip>
        {allTerms.map((t) => (
          <Chip key={t} active={activeTerm === t} onClick={() => setActiveTerm(t)}>
            {t}
          </Chip>
        ))}

        <span className="text-xs text-gray-600 mx-2">|</span>

        <Chip active={onlyNew} onClick={() => setOnlyNew((v) => !v)}>
          {onlyNew ? "Showing: New" : "Filter: New"}
        </Chip>
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
                        const teacher = report.teacher || report.teacher_name || report.reported_by;
                        const type = report.type || report.assessment_type || report.category;
                        const isUnseen =
                          typeof report.seen === "boolean"
                            ? !report.seen
                            : uploaded
                            ? (Date.now() - uploaded.getTime()) / (1000 * 60 * 60 * 24) <= 10
                            : false;

                        return (
                          <li
                            key={report.id}
                            className="rounded-xl border border-white/10 bg-gray-800/50 p-4 hover:border-amber-400/40 transition"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="font-semibold text-white truncate">
                                {report.title || `${report.subject || "Report"} (${report.term || ""})`}
                              </div>
                              {isUnseen && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full border border-amber-400/60 bg-amber-400/10 text-amber-200 shrink-0">
                                  New
                                </span>
                              )}
                            </div>

                            <div className="text-xs text-gray-400 mt-1 flex flex-wrap gap-x-2">
                              {report.subject && <span>{report.subject}</span>}
                              {type && <span>• {type}</span>}
                              {teacher && <span>• {teacher}</span>}
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
                                View Report →
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
  );
};

export default ParentReportsList;
