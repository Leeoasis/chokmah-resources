// src/components/dashboards/TeacherDashboard.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/auth/logoutSlice";
import { fetchProfile } from "../../redux/profileSlice";
import ModalComponent from "../ModalComponent";
import { useNavigate } from "react-router-dom";
import TeacherSidebar from "./features/student/TeacherSidebar";
import Header from "./features/student/Header";
import CalendarSection from "./features/student/CalenderSection";
import WelcomeSection from "./features/student/WelcomeSection";
import TeacherProfileSection from "./features/student/TeacherProfileSection";
import NotificationsSection from "./features/student/Notifications";
import TeacherLearnersSection from "./features/student/TeacherLearnersSection";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TeacherDashboard = () => {
  const [selectedOption, setSelectedOption] = useState("My Learners");
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [notifications] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    profile?.name ||
    JSON.parse(localStorage.getItem("user") || "{}")?.email ||
    "Teacher";

  const renderContent = () => {
    const contentMap = {
      "My Learners": (
        <TeacherLearnersSection />
      ),
      Profile: (
        <TeacherProfileSection
          profile={profile}
          onUpdate={(data) => console.log('Update profile:', data)}
          loading={false}
          error={null}
          successMessage={null}
        />
      ),
      Notifications: (
        <NotificationsSection notifications={notifications} />
      ),
      Calendar: (
        <CalendarSection
          date={date}
          setDate={setDate}
          events={events}
          openModal={openModal}
        />
      ),
    };

    return contentMap[selectedOption] || <TeacherLearnersSection />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col lg:flex-row flex-grow">
        <TeacherSidebar
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
        <div className="flex-1 p-4 lg:p-8 pt-20 lg:pt-24">
          <Header
            title="Teacher Dashboard"
            handleLogout={handleLogout}
            profile={{ name: resolvedName }}
            notifications={notifications}
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

export default TeacherDashboard;
