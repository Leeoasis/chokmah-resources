import React from "react";

const PupilReport = ({ report }) => {
  if (!report) {
    return <p className="text-white">No report available for this pupil.</p>;
  }

  const { pupilName, grade, comments, subjects, date, recommendations } = report;

  return (
    <div className="p-6 bg-secondary-light rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-primary mb-4">Report for {pupilName}</h2>
      <p className="text-white mb-2">
        <strong>Grade:</strong> {grade}
      </p>
      <p className="text-white mb-4">
        <strong>Date:</strong> {new Date(date).toLocaleDateString()}
      </p>

      <section className="mb-6">
        <h3 className="text-xl font-semibold text-primary mb-2">Subject Performance</h3>
        <ul className="list-disc list-inside text-white">
          {subjects.map(({ name, score, remarks }) => (
            <li key={name} className="mb-1">
              <strong>{name}:</strong> {score} — {remarks}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold text-primary mb-2">Teacher’s Comments</h3>
        <p className="text-white">{comments}</p>
      </section>

      {recommendations && recommendations.length > 0 && (
        <section>
          <h3 className="text-xl font-semibold text-primary mb-2">Recommendations</h3>
          <ul className="list-disc list-inside text-white">
            {recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default PupilReport;
