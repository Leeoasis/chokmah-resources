import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyLearners, fetchLearnerDetails, clearSelectedLearner } from '../../../../redux/teacherSlice';
import axiosInstance from '../../../../redux/api/axiosInstance';
import { FaDownload } from 'react-icons/fa';

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

/* ---------- Reports Section ---------- */
const ReportsSection = ({ reports, onDownload }) => {
  const [search, setSearch] = useState("");
  const [groupBy, setGroupBy] = useState("year-term");
  const [filterYear, setFilterYear] = useState("");
  const [filterTerm, setFilterTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("");

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchesSearch = !search || lower(r.title).includes(lower(search));
      const matchesYear = !filterYear || yearOf(r) === filterYear;
      const matchesTerm = !filterTerm || lower(r.term) === lower(filterTerm);
      const matchesSubject = !filterSubject || lower(r.subject) === lower(filterSubject);
      return matchesSearch && matchesYear && matchesTerm && matchesSubject;
    });
  }, [reports, search, filterYear, filterTerm, filterSubject]);

  const groupedReports = useMemo(() => {
    const groups = {};
    filteredReports.forEach((r) => {
      let key;
      switch (groupBy) {
        case "year-term":
          key = `${yearOf(r)} - ${r.term || "No term"}`;
          break;
        case "term-year":
          key = `${r.term || "No term"} - ${yearOf(r)}`;
          break;
        case "subject-year":
          key = `${r.subject || "No subject"} - ${yearOf(r)}`;
          break;
        default:
          key = "All Reports";
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(r);
    });
    return groups;
  }, [filteredReports, groupBy]);

  const allYears = uniq(reports.map(yearOf));
  const allTerms = uniq(reports.map((r) => r.term));
  const allSubjects = uniq(reports.map((r) => r.subject));

  if (reports.length === 0) {
    return (
      <Section title="Reports" count={0}>
        <p className="text-gray-400">No reports available</p>
      </Section>
    );
  }

  return (
    <Section title="Reports" count={reports.length}>
      <div className="space-y-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search reports..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-amber-400 focus:outline-none"
        />

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-amber-400 focus:outline-none"
          >
            <option value="">All Years</option>
            {allYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={filterTerm}
            onChange={(e) => setFilterTerm(e.target.value)}
            className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-amber-400 focus:outline-none"
          >
            <option value="">All Terms</option>
            {allTerms.map((term) => (
              <option key={term} value={term}>
                {term}
              </option>
            ))}
          </select>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-amber-400 focus:outline-none"
          >
            <option value="">All Subjects</option>
            {allSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        {/* Group By */}
        <div className="flex gap-2">
          <Chip active={groupBy === "year-term"} onClick={() => setGroupBy("year-term")}>
            Year → Term
          </Chip>
          <Chip active={groupBy === "term-year"} onClick={() => setGroupBy("term-year")}>
            Term → Year
          </Chip>
          <Chip active={groupBy === "subject-year"} onClick={() => setGroupBy("subject-year")}>
            Subject → Year
          </Chip>
        </div>

        {/* Groups */}
        <div className="space-y-4">
          {Object.entries(groupedReports).map(([groupName, groupReports]) => (
            <div key={groupName} className="space-y-2">
              <h4 className="text-sm font-medium text-amber-300">{groupName}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {groupReports.map((report) => (
                  <div key={report.id} className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-white text-sm">{report.title}</h5>
                      <button
                        onClick={() => onDownload(report.id, report.title)}
                        className="text-amber-400 hover:text-amber-300 p-1"
                        title="Download Report"
                      >
                        <FaDownload size={14} />
                      </button>
                    </div>
                    <div className="text-xs text-gray-400 space-y-1">
                      <p>Term: {report.term || "N/A"}</p>
                      <p>Year: {yearOf(report)}</p>
                      <p>Subject: {report.subject || "N/A"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

/* ---------- Resources Section ---------- */
const ResourcesSection = ({ resources, onDownload }) => {
  const [search, setSearch] = useState("");
  const [groupBy, setGroupBy] = useState("subject-type");
  const [filterYear, setFilterYear] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterType, setFilterType] = useState("");

  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      const matchesSearch = !search || lower(r.title).includes(lower(search));
      const matchesYear = !filterYear || yearOf(r) === filterYear;
      const matchesSubject = !filterSubject || lower(r.subject) === lower(filterSubject);
      const matchesType = !filterType || lower(r.resource_type) === lower(filterType);
      return matchesSearch && matchesYear && matchesSubject && matchesType;
    });
  }, [resources, search, filterYear, filterSubject, filterType]);

  const groupedResources = useMemo(() => {
    const groups = {};
    filteredResources.forEach((r) => {
      let key;
      switch (groupBy) {
        case "subject-type":
          key = `${r.subject || "No subject"} - ${r.resource_type || "No type"}`;
          break;
        case "type-subject":
          key = `${r.resource_type || "No type"} - ${r.subject || "No subject"}`;
          break;
        case "year-subject":
          key = `${yearOf(r)} - ${r.subject || "No subject"}`;
          break;
        default:
          key = "All Resources";
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(r);
    });
    return groups;
  }, [filteredResources, groupBy]);

  const allYears = uniq(resources.map(yearOf));
  const allSubjects = uniq(resources.map((r) => r.subject));
  const allTypes = uniq(resources.map((r) => r.resource_type));

  if (resources.length === 0) {
    return (
      <Section title="Resources" count={0}>
        <p className="text-gray-400">No resources available</p>
      </Section>
    );
  }

  return (
    <Section title="Resources" count={resources.length}>
      <div className="space-y-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-amber-400 focus:outline-none"
        />

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-amber-400 focus:outline-none"
          >
            <option value="">All Years</option>
            {allYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-amber-400 focus:outline-none"
          >
            <option value="">All Subjects</option>
            {allSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-amber-400 focus:outline-none"
          >
            <option value="">All Types</option>
            {allTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Group By */}
        <div className="flex gap-2">
          <Chip active={groupBy === "subject-type"} onClick={() => setGroupBy("subject-type")}>
            Subject → Type
          </Chip>
          <Chip active={groupBy === "type-subject"} onClick={() => setGroupBy("type-subject")}>
            Type → Subject
          </Chip>
          <Chip active={groupBy === "year-subject"} onClick={() => setGroupBy("year-subject")}>
            Year → Subject
          </Chip>
        </div>

        {/* Groups */}
        <div className="space-y-4">
          {Object.entries(groupedResources).map(([groupName, groupResources]) => (
            <div key={groupName} className="space-y-2">
              <h4 className="text-sm font-medium text-amber-300">{groupName}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {groupResources.map((resource) => (
                  <div key={resource.id} className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-white text-sm">{resource.title}</h5>
                      <button
                        onClick={() => onDownload(resource.id, resource.title, resource.resource_type)}
                        className="text-amber-400 hover:text-amber-300 p-1"
                        title="Download Resource"
                      >
                        <FaDownload size={14} />
                      </button>
                    </div>
                    <div className="text-xs text-gray-400 space-y-1">
                      <p>Subject: {resource.subject || "N/A"}</p>
                      <p>Type: {resource.resource_type || "N/A"}</p>
                      <p>Year: {yearOf(resource)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const TeacherLearnersSection = () => {
  const dispatch = useDispatch();
  const { learners, selectedLearner, loading, error } = useSelector((state) => state.teacher);
  const [selectedLearnerId, setSelectedLearnerId] = useState(null);

  useEffect(() => {
    dispatch(fetchMyLearners());
  }, [dispatch]);

  const handleLearnerClick = (learnerId) => {
    if (selectedLearnerId === learnerId) {
      setSelectedLearnerId(null);
      dispatch(clearSelectedLearner());
    } else {
      setSelectedLearnerId(learnerId);
      dispatch(fetchLearnerDetails(learnerId));
    }
  };

  const downloadReport = async (reportId, reportTitle) => {
    try {
      const response = await axiosInstance.get(`/api/v1/reports/${reportId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportTitle}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report');
    }
  };

  const downloadResource = async (resourceId, resourceTitle, resourceType) => {
    try {
      const response = await axiosInstance.get(`/api/v1/resources/${resourceId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const extension = resourceType === 'pdf' ? 'pdf' : resourceType === 'video' ? 'mp4' : 'file';
      link.setAttribute('download', `${resourceTitle}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading resource:', error);
      alert('Failed to download resource');
    }
  };

  // Group learners by grade
  const learnersByGrade = learners.reduce((acc, learner) => {
    const grade = learner.child_grade || 'Ungraded';
    if (!acc[grade]) {
      acc[grade] = [];
    }
    acc[grade].push(learner);
    return acc;
  }, {});

  if (loading) {
    return <div className="text-center py-8">Loading learners...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {typeof error === 'object' ? error.error || JSON.stringify(error) : error}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-amber-400 mb-4">My Learners</h2>

      {Object.keys(learnersByGrade).length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No learners assigned yet.
        </div>
      ) : (
        Object.entries(learnersByGrade)
          .sort(([a], [b]) => {
            // Sort grades numerically, put 'Ungraded' at the end
            if (a === 'Ungraded') return 1;
            if (b === 'Ungraded') return -1;
            return parseInt(a) - parseInt(b);
          })
          .map(([grade, gradeLearners]) => (
            <div key={grade} className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-xl font-semibold text-amber-300 mb-3">
                Grade {grade}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gradeLearners.map((learner) => (
                  <div
                    key={learner.id}
                    className={`bg-gray-700 rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedLearnerId === learner.id
                        ? 'ring-2 ring-amber-400 bg-gray-600'
                        : 'hover:bg-gray-600'
                    }`}
                    onClick={() => handleLearnerClick(learner.id)}
                  >
                    <h4 className="font-medium text-white mb-2">
                      {learner.child_name}
                    </h4>
                    <div className="text-sm text-gray-300 space-y-1">
                      <p>Reports: {learner.reports_count}</p>
                      <p>Resources: {learner.resources_count}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
      )}

      {selectedLearner && (
        <div className="bg-gray-800 rounded-lg p-6 mt-6">
          <h3 className="text-xl font-semibold text-amber-300 mb-4">
            {selectedLearner.child_name}'s Details
          </h3>

          {/* Reports Section */}
          <div className="mb-6">
            <ReportsSection reports={selectedLearner.reports || []} onDownload={downloadReport} />
          </div>

          {/* Resources Section */}
          <div>
            <ResourcesSection resources={selectedLearner.resources || []} onDownload={downloadResource} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherLearnersSection;