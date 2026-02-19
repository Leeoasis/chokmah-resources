import React, { useEffect, useState } from "react";
import ModalComponent from "../ModalComponent";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../landingSite/Navbar";

import AdminSidebar from "./features/admin/Sidebar";
import Header from "./features/admin/Header";
import CalendarSection from "./features/student/CalenderSection";
import WelcomeSection from "./features/student/WelcomeSection";
import CreateLearnerForm from "./features/admin/CreateLearnerForm";
import CreateTeacherForm from "./features/admin/CreateTeacherForm";
import ReportsSection from "./features/admin/AdminReports";
import AdminProfileSection from "./features/admin/AdminProfileSection";
import NotificationsSection from "./features/student/Notifications";
import ResourcesSection from "./features/admin/AdminResources";
import AdminLearners from "./features/admin/AdminLearners";
import AdminTeachers from "./features/admin/AdminTeachers";
import AdminPaces from "./features/admin/AdminPaces";

import { logoutUser } from "../../redux/auth/logoutSlice";
import { fetchProfile } from "../../redux/profileSlice";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const [selectedOption, setSelectedOption] = useState("Create Learner");
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
    "Admin";

  const renderContent = () => {
    const contentMap = {
      "Create Learner": <CreateLearnerForm />,
      "Create Teacher": <CreateTeacherForm />,    // ✅ new section
      Learners: <AdminLearners />,                 // ✅ new section
      Teachers: <AdminTeachers />,                 // ✅ new section
      Reports: <ReportsSection />,
      Resources: <ResourcesSection />,
      PACEs: <AdminPaces />,
      Profile: (
        <AdminProfileSection
          profile={profile}
          onUpdate={(data) => console.log('Update profile:', data)}
          loading={false}
          error={null}
          successMessage={null}
        />
      ),
      Notifications: <NotificationsSection notifications={notifications} />,
      Calendar: (
        <CalendarSection
          date={date}
          setDate={setDate}
          events={events}
          openModal={openModal}
        />
      ),
    };

    return contentMap[selectedOption] || <WelcomeSection />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col lg:flex-row flex-grow pt-16">
        <AdminSidebar
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
        <div className="flex-1 p-4 lg:p-8">
          <Header
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

export default AdminDashboard;
