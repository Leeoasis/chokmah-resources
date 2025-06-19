// src/pages/StudentDashboard.js
import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../../redux/actions/logout"; // You may want to comment this out too if it causes errors
import ModalComponent from "../ModalComponent";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./features/admin/Sidebar";
import Header from "./features/admin/Header";
import CalendarSection from "./features/student/CalenderSection";
import WelcomeSection from "./features/student/WelcomeSection";
import CreateLearnerForm from "./features/admin/CreateLearnerForm";
import ReportsSection from "./features/admin/AdminReports";
import StudentProfileSection from "./features/student/ProfileSection";
import NotificationsSection from "./features/student/Notifications";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const [selectedOption, setSelectedOption] = useState("Create Learner");
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [notifications, setNotifications] = useState([]);

  // const dispatch = useDispatch();
  const navigate = useNavigate();

  const studentId = 1; // Replace with dynamic auth ID

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

  // Commented out logout dispatch
  const handleLogout = () => {
    // dispatch(logout());
    navigate("/");
  };

  const renderContent = () => {
    const contentMap = {
      "Create Learner": (
        <CreateLearnerForm
          // materials={materials}
          // loading={loadingMaterials}
          // error={errorMaterials}
        />
      ),
      Reports: (
        <ReportsSection
          // reports={reports}
          // loading={loadingReports}
          // error={errorReports}
        />
      ),
      Profile: (
        <StudentProfileSection
          // student={student}
          // loading={loadingStudent}
          // error={errorStudent}
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
      // Messages option removed
    };

    return contentMap[selectedOption] || <WelcomeSection />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col lg:flex-row flex-grow">
        <AdminSidebar
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
        <div className="flex-1 p-4 lg:p-8 pt-20 lg:pt-24">
          <Header
            handleLogout={handleLogout}
            profile={{ name: "Student" }} // fallback profile
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

export default AdminDashboard;
