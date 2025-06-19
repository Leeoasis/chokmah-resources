import React from 'react';
import Modal from 'react-modal';

const ModalComponent = ({ isOpen, onRequestClose, eventTitle, setEventTitle, handleAddEvent }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Add Event"
    className="bg-secondary p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  >
    <h2 className="text-2xl font-semibold text-primary mb-4">Schedule Appointments</h2>
    <input
      type="text"
      value={eventTitle}
      onChange={(e) => setEventTitle(e.target.value)}
      placeholder="Event Title"
      className="w-full p-2 mb-4 rounded bg-secondary-light text-primary"
    />
    <div className="flex justify-end space-x-4">
      <button onClick={onRequestClose} className="bg-secondary-light text-primary px-4 py-2 rounded hover:bg-primary-light">
        Cancel
      </button>
      <button onClick={handleAddEvent} className="bg-primary text-secondary px-4 py-2 rounded hover:bg-primary-light">
        Add Event
      </button>
    </div>
  </Modal>
);

export default ModalComponent;