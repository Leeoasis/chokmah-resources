import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReports } from '../../../../redux/admin/reportsSlice';

const ParentReportsList = () => {
  const dispatch = useDispatch();
  const { reports, isLoading, error } = useSelector((state) => state.reports);

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  if (isLoading) return <p className="text-gray-700">Loading reports...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg text-gray-900">
      <h2 className="text-xl font-bold mb-4 text-gray-900">My Child's Reports</h2>
      {reports.length === 0 ? (
        <p className="text-gray-700">No reports found.</p>
      ) : (
        <ul>
          {reports.map((report) => (
            <li key={report.id} className="mb-3 border-b pb-2">
              <strong className="text-black">{report.title}</strong> — Uploaded on{' '}
              <span className="text-gray-800">
                {new Date(report.uploaded_at).toLocaleDateString()}
              </span>
              <br />
              <a
                href={report.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Report
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ParentReportsList;
