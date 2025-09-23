import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../../../redux/profileSlice";

const QuickStat = ({ label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
    <div className="text-xl font-extrabold text-amber-400">{value}</div>
    <div className="text-xs uppercase tracking-wider text-gray-400">{label}</div>
  </div>
);

const QuickAction = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 rounded-xl border border-amber-400/60 text-amber-300 hover:bg-amber-400/10 text-sm"
  >
    {label}
  </button>
);

const WelcomeSection = ({ setSelectedOption }) => {
  const dispatch = useDispatch();
  const profile = useSelector((s) => s.profile?.data);

  const [notifications] = useState([]);
  const [events] = useState([]);

  const didRequest = useRef(false);
  useEffect(() => {
    if (!didRequest.current) {
      didRequest.current = true;
      dispatch(fetchProfile());
    }
  }, [dispatch]);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const displayName =
    profile?.parent_name ||
    profile?.child_name ||
    storedUser?.parent_name ||
    storedUser?.child_name ||
    storedUser?.email ||
    "User";

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-white/5 to-transparent p-5">
      <h2 className="text-xl md:text-2xl font-bold">Welcome, {displayName} 👋</h2>
      <p className="text-gray-300 mt-1 text-sm">
        Here’s your snapshot. Open <span className="text-amber-300 font-semibold">Resources</span>{" "}
        to check notes & homework, or head to <span className="text-amber-300 font-semibold">Reports</span>{" "}
        for marks and teacher comments.
      </p>

      {/* Quick stats */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <QuickStat label="New uploads" value="3" />
        <QuickStat label="Reports available" value="2" />
        <QuickStat label="Upcoming items" value={events.length} />
        <QuickStat label="Notifications" value={notifications.length} />
      </div>

      {/* Quick actions */}
      {setSelectedOption && (
        <div className="mt-4 flex flex-wrap gap-2">
          <QuickAction label="View Resources" onClick={() => setSelectedOption("Resources")} />
          <QuickAction label="Open Reports" onClick={() => setSelectedOption("Reports")} />
          <QuickAction label="Calendar" onClick={() => setSelectedOption("Calendar")} />
          <QuickAction label="Profile" onClick={() => setSelectedOption("Profile")} />
        </div>
      )}

      {/* Helpful tip */}
      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
        Tip: Use your mobile number to reset your password anytime. Need help linking a learner? Contact the school office.
      </div>
    </div>
  );
};

export default WelcomeSection;
