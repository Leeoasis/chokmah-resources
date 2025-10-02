import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLearners,
  updateLearner,
  deleteLearner,
  clearSuccessMessage,
} from "../../../../redux/admin/adminLearnerSlice";

const AdminLearners = () => {
  const dispatch = useDispatch();
  const { learners = [], isLoading, error, successMessage } = useSelector(
    (state) => state.adminLearners || {}
  );

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editGrade, setEditGrade] = useState("");
  const [viewingLearner, setViewingLearner] = useState(null);

  useEffect(() => {
    dispatch(fetchLearners());
  }, [dispatch]);

  const startEdit = (learner) => {
    setEditingId(learner.id);
    setEditName(learner.child_name || "");
    setEditGrade(learner.child_grade || "");
  };

  const saveEdit = () => {
    dispatch(updateLearner({ id: editingId, data: { child_name: editName, child_grade: editGrade } }));
    setEditingId(null);
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-xl border border-white/10">
      <h2 className="text-xl font-bold mb-4 text-amber-400">Learners</h2>

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

      {isLoading && <p className="text-gray-300">Loading learners…</p>}

      <ul className="space-y-2">
        {learners.map((learner) => (
          <li
            key={learner.id}
            className="flex justify-between items-center border border-white/10 bg-gray-800 p-3 rounded"
          >
            {editingId === learner.id ? (
              <div className="flex gap-2 items-center">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="px-2 py-1 rounded bg-gray-700"
                  placeholder="Learner name"
                />
                <input
                  value={editGrade}
                  onChange={(e) => setEditGrade(e.target.value)}
                  className="px-2 py-1 rounded bg-gray-700"
                  placeholder="Grade"
                />
                <button onClick={saveEdit} className="text-green-400 hover:text-green-300">
                  Save
                </button>
                <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-300">
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <span>{learner.child_name} (Grade {learner.child_grade})</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewingLearner(learner)}
                    className="text-amber-400 hover:text-amber-300"
                  >
                    View
                  </button>
                  <button
                    onClick={() => startEdit(learner)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => dispatch(deleteLearner(learner.id))}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {learners.length === 0 && !isLoading && (
        <p className="text-gray-400">No learners found.</p>
      )}

      {viewingLearner && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg w-96 shadow-lg border border-white/20">
            <h3 className="text-lg font-bold text-amber-400 mb-4">Learner Details</h3>
            <p><strong>Name:</strong> {viewingLearner.child_name}</p>
            <p><strong>Grade:</strong> {viewingLearner.child_grade}</p>
            <p><strong>Invitation Token:</strong> {viewingLearner.invitation_token}</p>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setViewingLearner(null)}
                className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
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
