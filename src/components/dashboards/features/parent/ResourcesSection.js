// src/pages/.../ResourcesSection.js
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResources } from "../../../../redux/parent/resourcesSlice";

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
    {["subject-type", "type-subject"].map((opt) => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={
          "px-3 py-2 border-r border-white/10 last:border-none " +
          (value === opt ? "bg-amber-400 text-gray-900 font-semibold" : "text-gray-300")
        }
      >
        {opt === "subject-type" && "Subject ▸ Type"}
        {opt === "type-subject" && "Type ▸ Subject"}
      </button>
    ))}
  </div>
);

const uniq = (arr) => [...new Set(arr.filter(Boolean))];
const lower = (v) => (v ?? "").toString().toLowerCase();

const ResourcesSection = () => {
  const dispatch = useDispatch();
  const { items = [], isLoading, error } = useSelector((s) => s.resources || {});
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role || "guest";

  const [q, setQ] = useState("");
  const [groupBy, setGroupBy] = useState("subject-type");
  const [activeSubject, setActiveSubject] = useState(null);
  const [activeType, setActiveType] = useState(null);

  useEffect(() => {
    dispatch(fetchResources());
  }, [dispatch]);

  const allSubjects = useMemo(() => uniq(items.map((it) => it.subject)), [items]);
  const allTypes = useMemo(() => uniq(items.map((it) => it.resource_type)), [items]);

  const filtered = useMemo(() => {
    const query = lower(q);
    return items.filter((r) => {
      const type = r.resource_type;
      const matchQ =
        !query ||
        lower(r.title).includes(query) ||
        lower(r.subject).includes(query) ||
        lower(type).includes(query);
      const matchSubject = !activeSubject || r.subject === activeSubject;
      const matchType = !activeType || type === activeType;
      return matchQ && matchSubject && matchType;
    });
  }, [items, q, activeSubject, activeType]);

  const grouped = useMemo(() => {
    const map = new Map();
    const push = (k1, k2, item) => {
      if (!map.has(k1)) map.set(k1, new Map());
      const inner = map.get(k1);
      if (!inner.has(k2)) inner.set(k2, []);
      inner.get(k2).push(item);
    };

    filtered.forEach((it) => {
      const s = it.subject || "No Subject";
      const t = it.resource_type || "Other";

      if (groupBy === "subject-type") push(s, t, it);
      else push(t, s, it);
    });

    return map;
  }, [filtered, groupBy]);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-amber-400">Resources</h2>
          <p className="text-sm text-gray-400">
            You are signed in as <span className="font-semibold text-white">{role}</span>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title, subject, type…"
            className="w-full sm:w-64 px-3 py-2 rounded-xl bg-gray-900/70 border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/60 text-sm"
          />
          <GroupToggle value={groupBy} onChange={setGroupBy} />
        </div>
      </div>

      {/* Quick filters */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
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
                      {arr.map((resource) => {
                        const uploaded = resource.uploaded_at
                          ? new Date(resource.uploaded_at).toLocaleDateString()
                          : null;
                        return (
                          <li
                            key={resource.id}
                            className="rounded-xl border border-white/10 bg-gray-800/50 p-4 hover:border-amber-400/40 transition"
                          >
                            <div className="font-semibold text-white truncate">
                              {resource.title}
                            </div>
                            <div className="text-xs text-gray-400 mt-1 flex flex-wrap gap-x-2">
                              {resource.subject && <span>{resource.subject}</span>}
                              {resource.resource_type && <span>• {resource.resource_type}</span>}
                              {uploaded && <span>• {uploaded}</span>}
                            </div>
                            {resource.learner_name && (
                              <div className="text-xs text-gray-500 mt-1">
                                For: {resource.learner_name}
                              </div>
                            )}
                            {resource.url && (
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-2 text-amber-400 hover:text-amber-300 font-medium"
                              >
                                Download →
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
          <div className="text-gray-400">No resources match your filters.</div>
        )}
      </div>
    </section>
  );
};

export default ResourcesSection;
