import React from "react";

const AdminProfileSection = ({ profile, onUpdate }) => {
  return (
    <div className="p-4 bg-white text-black rounded-lg">
      <h2 className="text-xl font-bold mb-4">Admin Profile</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const name = form.get("name");
        const email = form.get("email");
        onUpdate({ name, email });
      }}>
        <input
          type="text"
          name="name"
          defaultValue={profile.name}
          placeholder="Name"
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          defaultValue={profile.email}
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded"
        />
        <button type="submit" className="bg-amber-600 text-white px-4 py-2 rounded">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default AdminProfileSection;
