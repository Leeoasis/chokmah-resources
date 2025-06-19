import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLearners, uploadReport } from '../../../../redux/admin/reportsSlice';

const PupilReportUploadForm = () => {
  const dispatch = useDispatch();

  const [selectedLearner, setSelectedLearner] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  // 🛡️ Defensive fallback for safety
  const { learners = [], isLoading, error, success } = useSelector(
    (state) => state.reports || {}
  );

  console.log('Learners:', learners);

  useEffect(() => {
    console.log('Dispatching fetchLearners...');
    dispatch(fetchLearners());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setMessage('Report uploaded successfully.');
      setTitle('');
      setFile(null);
      setSelectedLearner('');
    }
  }, [success]);

  useEffect(() => {
    if (learners.length) {
      console.log('Learners updated:', learners);
    }
  }, [learners]);

  console.log(learners, 'learners');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedLearner || !title || !file) return;

    const formData = new FormData();
    formData.append('report[title]', title);
    formData.append('report[file]', file);
    formData.append('report[learner_id]', selectedLearner);

    dispatch(uploadReport(formData));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Upload Learner Report</h2>
      {message && <p className="mb-4 text-green-700">{message}</p>}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Learner</label>
        <select
          value={selectedLearner}
          onChange={(e) => setSelectedLearner(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
        >
          <option value="">Choose a learner</option>
          {learners.map((learner) => (
            <option key={learner.id} value={learner.id}>
              {learner.child_name} (Grade {learner.child_grade})
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Report Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
        />

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="bg-amber-500 text-white w-full py-2 rounded hover:bg-amber-600"
        >
          {isLoading ? 'Uploading...' : 'Upload Report'}
        </button>
      </form>
    </div>
  );
};

export default PupilReportUploadForm;
