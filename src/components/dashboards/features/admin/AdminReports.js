import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  uploadReport,
  fetchReports,
  clearSuccessMessage,
} from '../../../../redux/admin/reportsSlice';
import { fetchLearners } from '../../../../redux/admin/adminLearnerSlice';

const Badge = ({ children }) => (
  <span className="text-[10px] px-2 py-0.5 rounded-full border border-amber-400/60 bg-amber-400/10 text-amber-200">
    {children}
  </span>
);

const AdminReports = () => {
  const dispatch = useDispatch();
  const { reports = [], isLoading, error, successMessage } = useSelector(
    (state) => state.reports || {}
  );
  const { learners = [] } = useSelector((state) => state.adminLearners || {});

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

      {/* Upload Form */}
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
            {learners.map((learner) => (
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

      {/* Reports List */}
      <h3 className="text-lg font-semibold mb-3">Recent Reports</h3>
      {isLoading && <p className="text-gray-300">Loading…</p>}
      <ul className="space-y-2">
        {reports.map((report) => (
          <li key={report.id} className="border border-white/10 bg-gray-800 p-3 rounded">
            <div className="font-semibold">{report.title}</div>
            <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
              {report.year && <Badge>{report.year}</Badge>}
              {report.term && <Badge>{report.term}</Badge>}
              {report.subject && <Badge>{report.subject}</Badge>}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Learner: {report.learner_name || 'Unknown'}
            </div>
            {report.url && (
              <a
                href={report.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 font-medium"
              >
                Download →
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminReports;
