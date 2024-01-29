// src/Dashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [updateNoteTexts, setUpdateNoteTexts] = useState({});
  const history = useHistory();

  useEffect(() => {
    // Check if the authentication cookie is present
    if (!getAuthToken()) {
      // Redirect to the login page if no auth cookie is found
      history.push("/login");

      // Show access denied toast
      toast.error("Access denied. Please log in.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      // Fetch notes from the backend if the user is authenticated
      fetchNotes();
    }
  }, []);

  const fetchNotes = async () => {
    try {
      // Include the authToken in the request headers
      const authToken = getAuthToken();

      const response = await axios.get(
        "https://arrowhead-v6yn.onrender.com//notes",
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      setNotes(response.data.notes);
      setNewNote({ title: "", content: "" });
      setUpdateNoteTexts({});
    } catch (error) {
      console.error("Error fetching notes:", error.response.data);
    }
  };

  const handleCreateNote = async () => {
    // Include the authToken in the request headers
    const authToken = getAuthToken();
    console.log(authToken);
    try {
      // Creating a new note
      const response = await axios.post(
        "https://arrowhead-v6yn.onrender.com//note",
        newNote,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      console.log("New note created:", response.data);

      // Fetch updated notes after creating a new one
      fetchNotes();
    } catch (error) {
      console.error("Error creating a new note:", error.response.data);
    }
  };

  const handleUpdateNote = async (noteId) => {
    const authToken = getAuthToken();

    try {
      // Updating a note
      const response = await axios.put(
        `https://arrowhead-v6yn.onrender.com//note`,
        { id: noteId, newContent: updateNoteTexts[noteId] },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      console.log("Note updated:", response.data);

      // Fetch updated notes after updating one
      fetchNotes();
    } catch (error) {
      console.error("Error updating a note:", error.response.data);
    }
  };

  const handleDeleteNote = async (noteId) => {
    // Include the authToken in the request headers
    const authToken = getAuthToken();

    try {
      // Deleting a note
      const response = await axios.delete(
        `https://arrowhead-v6yn.onrender.com//note/${noteId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      console.log("Note deleted:", response.data);

      // Fetch updated notes after deleting one
      fetchNotes();
    } catch (error) {
      console.error("Error deleting a note:", error.response.data);
    }
  };

  const handleLogout = () => {
    // Remove the auth cookie
    document.cookie =
      "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirect to the login page
    history.push("/login");

    // Show logout success toast
    toast.success("Logout successful!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const getAuthToken = () => {
    const cookieString = document.cookie || "";
    const authTokenCookie = cookieString
      .split("; ")
      .find((cookie) => cookie.startsWith("authToken="));

    return authTokenCookie ? authTokenCookie.split("=")[1] : undefined;
  };

  return (
    <div
      className="dashboard-container"
      style={{ textAlign: "center", padding: "20px" }}
    >
      <h2 style={{ marginBottom: "20px" }}>Dashboard</h2>
      <button
        type="button"
        onClick={handleLogout}
        style={{ marginBottom: "20px", backgroundColor: "#ff3333" }}
      >
        Logout
      </button>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        />
        <p></p>
        <textarea
          placeholder="Content"
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
        />
        <p></p>
        <button
          type="button"
          onClick={handleCreateNote}
          style={{ marginLeft: "10px" }}
        >
          Create Note
        </button>
      </div>
      <div
        className="notes-list"
        style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}
      >
        {notes.map((note) => (
          <div
            key={note.id}
            className="note-item"
            style={{
              margin: "10px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              width: "200px",
            }}
          >
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <textarea
              type="text"
              placeholder="New Content"
              value={updateNoteTexts[note.id] || ""}
              onChange={(e) =>
                setUpdateNoteTexts({
                  ...updateNoteTexts,
                  [note.id]: e.target.value,
                })
              }
              style={{ marginBottom: "10px" }}
            />
            <br />
            <button
              type="button"
              onClick={() => handleUpdateNote(note.id)}
              style={{ backgroundColor: "#4caf50" }}
            >
              Update Note
            </button>
            <button
              type="button"
              onClick={() => handleDeleteNote(note.id)}
              style={{ marginLeft: "5px" }}
            >
              Delete Note
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
