import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeachers, deleteLearner } from "../../../../redux/admin/adminLearnerSlice";

const AdminTeachers = () => {
  const dispatch = useDispatch();
  const { teachers, isLoading, error } = useSelector((state) => state.adminLearners);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch]);

  // Filter teachers by search term
  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      dispatch(deleteLearner(id));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 text-white rounded-2xl border border-white/10">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-amber-400">Manage Teachers</h2>
        <p className="text-sm text-gray-400 mt-1">
          View and manage all teacher accounts in the system.
        </p>
      </header>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search teachers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 rounded border border-red-700 bg-red-900/30 text-red-200">
          {error}
        </div>
      )}

      {/* Teachers List */}
      <div className="space-y-3">
        {filteredTeachers.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            {searchTerm ? "No teachers found matching your search." : "No teachers found."}
          </div>
        ) : (
          filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-gray-800/50 border border-white/10 rounded-xl p-4 hover:bg-gray-800/70 transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-400">
                    {teacher.name || teacher.email}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Email: {teacher.email}
                  </p>
                  <p className="text-sm text-gray-400">
                    Role: {teacher.role}
                  </p>
                  <p className="text-sm text-blue-400">
                    Students assigned: {teacher.student_count || 0}
                  </p>
                  {teacher.created_at && (
                    <p className="text-xs text-gray-500 mt-1">
                      Created: {new Date(teacher.created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(teacher.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <p className="text-sm text-gray-400">
          Total Teachers: {teachers.length}
        </p>
      </div>
    </div>
  );
};

export default AdminTeachers;