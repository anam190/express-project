import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Login from "./Login";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Notification
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Show notification
  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  // GET ALL USERS
  const getUsers = () => {
    axios
      .get("http://localhost:5001/api/users")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.error("GET ERROR:", err);
        showMessage("Error loading users", "error");
      });
  };

  // LOAD USERS WHEN PAGE OPENS
  useEffect(() => {
    getUsers();
  }, []);

  // ADD / UPDATE USER
  const addUser = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    // Name validation
    if (!trimmedName) {
      showMessage("Please enter your name", "error");
      return;
    }

    // Email validation
    if (!trimmedEmail) {
      showMessage("Please enter your email", "error");
      return;
    }

    // Email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      showMessage("Please enter a valid email address", "error");
      return;
    }

    try {
      setLoading(true);

      if (editId) {
        // UPDATE USER
        await axios.put(
          `http://localhost:5001/api/users/${editId}`,
          {
            name: trimmedName,
            email: trimmedEmail,
          }
        );

        showMessage("User updated successfully!", "success");

        setEditId(null);
      } else {
        // ADD USER
        await axios.post(
          "http://localhost:5001/api/users/add",
          {
            name: trimmedName,
            email: trimmedEmail,
          }
        );

        showMessage("User added successfully!", "success");
      }

      // Clear form
      setName("");
      setEmail("");

      // Refresh users
      getUsers();
    } catch (err) {
      console.error("SAVE ERROR:", err);

      if (err.response) {
        showMessage(
          err.response.data.error || "Error saving user",
          "error"
        );
      } else {
        showMessage(
          "Server error. Please check if the backend is running.",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // EDIT USER
  const editUser = (user) => {
    setName(user.name);
    setEmail(user.email);
    setEditId(user._id);
  };

  // DELETE USER
  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);

      await axios.delete(
        `http://localhost:5001/api/users/${id}`
      );

      showMessage("User deleted successfully!", "success");

      getUsers();
    } catch (err) {
      console.error("DELETE ERROR:", err);

      if (err.response) {
        showMessage(
          err.response.data.message || "Error deleting user",
          "error"
        );
      } else {
        showMessage(
          "Server error. Please check if the backend is running.",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // FILTER USERS
   const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  // Show Login page if user is not logged in
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="app-container">

      {/* NOTIFICATION */}
      {message && (
        <div className={`message ${messageType}`}>
          {messageType === "success" ? "✓" : "✕"} {message}
        </div>
      )}

      {/* PAGE TITLE */}
      <h1 className="app-title">
        User Management System
      </h1>

      {/* ADD / UPDATE USER */}
      <div className="form-card">

        <h2 className="section-title">
          {editId ? "Update User" : "Add User"}
        </h2>

        <form
          onSubmit={addUser}
          className="user-form"
        >

          <input
            className="user-input"
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            className="user-input"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <div className="form-buttons">

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editId
                ? "Update User"
                : "Add User"}
            </button>

            {editId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setEditId(null);
                  setName("");
                  setEmail("");
                }}
                disabled={loading}
              >
                Cancel
              </button>
            )}

          </div>

        </form>
      </div>

      {/* USERS */}
      <div className="users-card">

        {/* USERS HEADER */}
        <div className="users-header">

          <h2 className="section-title">
            Users
          </h2>

          <span className="user-count">
            Total Users: {users.length}
          </span>

        </div>

        {/* SEARCH */}
        <input
          className="search-input"
          type="text"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {/* USER LIST */}
        {filteredUsers.length === 0 ? (

          <p className="no-users">
            No users found.
          </p>

        ) : (

          filteredUsers.map((user) => (

            <div
              className="user-card"
              key={user._id}
            >

              <p className="user-info">
                <strong>Name:</strong>{" "}
                {user.name}
              </p>

              <p className="user-info">
                <strong>Email:</strong>{" "}
                {user.email}
              </p>

              <div className="button-group">

                {/* EDIT */}
                <button
                  className="edit-btn"
                  onClick={() =>
                    editUser(user)
                  }
                  disabled={loading}
                >
                  Edit
                </button>

                {/* DELETE */}
                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteUser(user._id)
                  }
                  disabled={loading}
                >
                  {loading
                    ? "Deleting..."
                    : "Delete"}
                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default App;