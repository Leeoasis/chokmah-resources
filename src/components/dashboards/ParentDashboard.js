import React, { useEffect, useState } from "react";
import ModalComponent from "../ModalComponent";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ParentSidebar from "./features/parent/Sidebar";
import Header from "./features/parent/Header";
import CalendarSection from "./features/student/CalenderSection";
import WelcomeSection from "./features/student/WelcomeSection";
import ReportsSection from "./features/parent/Reports";
import StudentProfileSection from "./features/student/ProfileSection";
import NotificationsSection from "./features/student/Notifications";
import ResourcesSection from "./features/parent/ResourcesSection";

import { logoutUser } from "../../redux/auth/logoutSlice";
import { fetchProfile } from "../../redux/profileSlice";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ParentDashboard = () => {
  const [selectedOption, setSelectedOption] = useState("Welcome");
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const profile = useSelector((state) => state.profile?.data);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
    setEventTitle("");
  };

  const handleAddEvent = () => {
    if (eventTitle) {
      setEvents([...events, { date: date.toDateString(), title: eventTitle }]);
      closeModal();
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate("/login");
    });
  };

  const resolvedName =
    profile?.parent_name ||
    profile?.child_name ||
    profile?.name ||
    JSON.parse(localStorage.getItem("user") || "{}")?.email ||
    "Parent";

  const renderContent = () => {
    const contentMap = {
      Reports: <ReportsSection />,
      Profile: <StudentProfileSection />,
      Notifications: <NotificationsSection notifications={notifications} />,
      Calendar: (
        <CalendarSection
          date={date}
          setDate={setDate}
          events={events}
          openModal={openModal}
        />
      ),
      Resources: <ResourcesSection profile={{ role: "parent" }} />,
    };

    return contentMap[selectedOption] || <WelcomeSection />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col lg:flex-row flex-grow">
        <ParentSidebar
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
        <div className="flex-1 p-4 lg:p-8 pt-20 lg:pt-24">
          <Header
            handleLogout={handleLogout}
            profile={{ name: resolvedName }}
          />
          <div className="bg-secondary shadow-lg rounded-lg p-4 lg:p-6 flex-grow">
            {renderContent()}
          </div>
        </div>
      </div>
      <ModalComponent
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        eventTitle={eventTitle}
        setEventTitle={setEventTitle}
        handleAddEvent={handleAddEvent}
      />
    </div>
  );
};

export default ParentDashboard;
