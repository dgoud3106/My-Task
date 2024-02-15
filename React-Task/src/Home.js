/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { BiStar, BiTrash } from "react-icons/bi";
import { RiEdit2Fill } from "react-icons/ri";
import { AiOutlinePlusCircle, AiFillStar } from "react-icons/ai";
import { MdOutlineDeleteForever } from "react-icons/md";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function NotesApp() {
  const [notes, setNotes] = useState(() => {
    return JSON.parse(localStorage.getItem("notes")) || [];
  });
  const [currentNote, setCurrentNote] = useState(null);
  const [filteredAllNotes, setFilteredAllNotes] = useState([]);
  const [filteredStarredNotes, setFilteredStarredNotes] = useState([]);
  const [filteredDeletedNotes, setFilteredDeletedNotes] = useState([]);
  const [activeNav, setActiveNav] = useState("all");
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteDescription, setNewNoteDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [addNotesContainer, setaddNotesContainer] = useState(false);
  const [fisrtStarredCounter, setFirstStarredCounter] = useState(0);
  const [fisrtDeletedCounter, setFirstDeletedCounter] = useState(0);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
    filterNotes(activeNav);
  }, [notes]);

  useEffect(() => {
    if (activeNav === "all" && filteredAllNotes.length > 0) {
      setCurrentNote(filteredAllNotes[0]);
    } else if (activeNav === "starred" && filteredStarredNotes.length > 0) {
      setCurrentNote(filteredStarredNotes[0]);
    } else if (activeNav === "deleted" && filteredDeletedNotes.length > 0) {
      setCurrentNote(filteredDeletedNotes[0]);
    }
  }, [activeNav, filteredAllNotes, filteredStarredNotes, filteredDeletedNotes]);

  const handleAddNote = () => {
    if (newNoteTitle.trim() === "") return;

    const newNote = {
      id: Date.now(),
      title: newNoteTitle,
      description: newNoteDescription,
      starred: false,
      deleted: false,
      time: {
        month: new Date().getMonth(),
        day: new Date().getDay(),
        year: new Date().getFullYear(),
        hours: new Date().getHours(),
        minutes: new Date().getMinutes(),
        seconds: new Date().getSeconds(),
      },
    };

    setNotes([...notes, newNote]);
    setNewNoteTitle("");
    setNewNoteDescription("");
  };

  const handleDeleteNote = (note) => {
    const updatedNotes = notes.map((n) =>
      n.id === note.id ? { ...n, deleted: !n.deleted } : n
    );

    setNotes(updatedNotes);
  };

  const handleStarNote = (note) => {
    const updatedNotes = notes.map((n) =>
      n.id === note.id ? { ...n, starred: !n.starred } : n
    );

    setNotes(updatedNotes);
  };

  const handleNoteClick = (note) => {
    setCurrentNote(note);
  };

  const handleFilterChange = (event) => {
    const value = event.target.value.toLowerCase();

    let filtered;
    switch (activeNav) {
      case "all":
        filtered = notes.filter((note) =>
          note.title.toLowerCase().includes(value)
        );
        setFilteredAllNotes(filtered);
        break;
      case "starred":
        filtered = notes
          .filter((note) => note.starred)
          .filter((note) => note.title.toLowerCase().includes(value));
        setFilteredStarredNotes(filtered);
        break;
      case "deleted":
        filtered = notes
          .filter((note) => note.deleted)
          .filter((note) => note.title.toLowerCase().includes(value));
        setFilteredDeletedNotes(filtered);
        break;
      default:
        break;
    }
  };

  const filterNotes = (nav) => {
    setActiveNav(nav);

    let filtered;
    switch (nav) {
      case "all":
        filtered = notes;
        break;
      case "starred":
        filtered = notes.filter((note) => note.starred);
        break;
      case "deleted":
        filtered = notes.filter((note) => note.deleted);
        break;
      default:
        filtered = [];
        break;
    }

    switch (nav) {
      case "all":
        setFilteredAllNotes(filtered);
        break;
      case "starred":
        setFilteredStarredNotes(filtered);
        break;
      case "deleted":
        setFilteredDeletedNotes(filtered);
        break;
      default:
        break;
    }
  };

  const handleEditNote = () => {
    if (currentNote) {
      setIsEditing(true);
      setNewNoteTitle(currentNote.title);
      setNewNoteDescription(currentNote.description);
    }
  };
  const addContainer = () => {
    setaddNotesContainer(!addNotesContainer);
  };
  const handleSaveNote = () => {
    if (!currentNote || newNoteTitle.trim() === "") return;

    const updatedNotes = notes.map((note) =>
      note.id === currentNote.id
        ? {
            ...note,
            title: newNoteTitle,
            description: newNoteDescription,
            time: {
              month: new Date().getMonth(),
              day: new Date().getDay(),
              year: new Date().getFullYear(),
              hours: new Date().getHours(),
              minutes: new Date().getMinutes(),
              seconds: new Date().getSeconds(),
            },
          }
        : note
    );
    setNotes(updatedNotes);
    setIsEditing(false);
    setNewNoteTitle("");
    setNewNoteDescription("");
    addContainer();
  };
  const starredCounting = (note) => {
    if (!note.starred) {
      setFirstStarredCounter(fisrtStarredCounter + 1);
    } else {
      setFirstStarredCounter(fisrtStarredCounter - 1);
    }
  };

  const deletedCounting = (note) => {
    if (!note.deleted) {
      setFirstDeletedCounter(fisrtDeletedCounter + 1);
    } else {
      setFirstDeletedCounter(fisrtDeletedCounter - 1);
    }
  };

  useEffect(() => {
    let counter = 0;
    notes.map((each) => {
      if (each.starred) {
        counter = counter + 1;
      }
    });
    setFirstStarredCounter(counter);
  }, []);

  useEffect(() => {
    let counter = 0;
    notes.map((each) => {
      if (each.deleted) {
        counter = counter + 1;
      }
    });
    setFirstDeletedCounter(counter);
  }, []);

  return (
    <div className="notes-app">
      <div className="navs-container">
        <div className="filter">
          <input
            type="text"
            placeholder="Search"
            onChange={handleFilterChange}
          />
        </div>
        <ul className="navs">
          <li
            className={activeNav === "all" ? "active" : ""}
            onClick={() => {
              filterNotes("all");
              console.log(notes);
            }}
          >
            {`All (${filteredAllNotes.length})`}
          </li>
          <li
            className={activeNav === "starred" ? "active" : ""}
            onClick={() => filterNotes("starred")}
          >
            {`Starred (${fisrtStarredCounter})`}
          </li>
          <li
            className={activeNav === "deleted" ? "active" : ""}
            onClick={() => filterNotes("deleted")}
          >
            {`Deleted (${fisrtDeletedCounter})`}
          </li>
        </ul>
      </div>
      <div className="notes-list">
        {activeNav === "all" ? (
          <h5 className="pb-3">All Notes</h5>
        ) : activeNav === "starred" ? (
          <h5 className="pb-3">Starred Notes</h5>
        ) : (
          <h5 className="pb-3">Deleted Notes</h5>
        )}
        {activeNav === "all" &&
          filteredAllNotes.map((note) => (
            <div
              key={note.id}
              className={`note ${currentNote === note ? "active" : ""}`}
              onClick={() => handleNoteClick(note)}
            >
              <div className="d-flex justify-content-between">
                <h5>
                  {note.title} {note.deleted && <span>Deleted</span>}
                </h5>
                <div className="actions">
                  <button
                    onClick={() => {
                      starredCounting(note);
                      handleStarNote(note);
                    }}
                  >
                    {note.starred ? (
                      <AiFillStar fill="#fbff02" className="note-buttons" />
                    ) : (
                      <BiStar className="note-buttons" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      deletedCounting(note);
                      handleDeleteNote(note);
                    }}
                  >
                    {note.deleted ? (
                      <MdOutlineDeleteForever className="note-buttons" />
                    ) : (
                      <BiTrash className="note-buttons" />
                    )}
                  </button>
                </div>
              </div>
              <h6 style={{ fontWeight: "600" }}>{`${note.description.slice(
                0,
                90
              )}...`}</h6>
            </div>
          ))}
        {activeNav === "starred" &&
          filteredStarredNotes.map((note) => (
            <div
              key={note.id}
              className={`note ${currentNote === note ? "active" : ""}`}
              onClick={() => handleNoteClick(note)}
            >
              <div className="d-flex justify-content-between">
                <h5>
                  {note.title} {note.deleted && <span>Deleted</span>}
                </h5>
                <div className="actions">
                  <button
                    onClick={() => {
                      starredCounting(note);
                      handleStarNote(note);
                    }}
                  >
                    {note.starred ? (
                      <AiFillStar fill="#fbff02" className="note-buttons" />
                    ) : (
                      <BiStar className="note-buttons" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      deletedCounting(note);
                      handleDeleteNote(note);
                    }}
                  >
                    {note.deleted ? (
                      <MdOutlineDeleteForever className="note-buttons" />
                    ) : (
                      <BiTrash className="note-buttons" />
                    )}
                  </button>
                </div>
              </div>
              <h6 style={{ fontWeight: "600" }}>{`${note.description.slice(
                0,
                90
              )}...`}</h6>
            </div>
          ))}
        {activeNav === "deleted" &&
          filteredDeletedNotes.map((note) => (
            <div
              key={note.id}
              className={`note ${currentNote === note ? "active" : ""}`}
              onClick={() => handleNoteClick(note)}
            >
              <div className="d-flex justify-content-between">
                <h5>
                  {note.title} {note.deleted && <span>Deleted</span>}
                </h5>
                <div className="actions">
                  <button
                    onClick={() => {
                      starredCounting(note);
                      handleStarNote(note);
                    }}
                  >
                    {note.starred ? (
                      <AiFillStar fill="#fbff02" className="note-buttons" />
                    ) : (
                      <BiStar className="note-buttons" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      deletedCounting(note);
                      handleDeleteNote(note);
                    }}
                  >
                    {note.deleted ? (
                      <MdOutlineDeleteForever className="note-buttons" />
                    ) : (
                      <BiTrash className="note-buttons" />
                    )}
                  </button>
                </div>
              </div>
              <h6 style={{ fontWeight: "600" }}>{`${note.description.slice(
                0,
                90
              )}...`}</h6>
            </div>
          ))}
      </div>
      <div className="note-details">
        {currentNote ? (
          <div>
            <div className="d-flex justify-content-between">
              <div>
                <h5>{currentNote.title}</h5>
                <h6 style={{ color: "#44daff" }}>{`${
                  months[currentNote.time.month]
                } ${currentNote.time.day}, ${currentNote.time.year} ${
                  currentNote.time.hours
                }:${currentNote.time.minutes}:${currentNote.time.seconds}`}</h6>
              </div>
              <div className="actions">
                {activeNav !== "deleted" ? (
                  <button
                    onClick={() => {
                      addContainer();
                      handleEditNote();
                    }}
                  >
                    <RiEdit2Fill className="note-buttons" />
                  </button>
                ) : (
                  <button>
                    <RiEdit2Fill
                      fill="lightgrey"
                      style={{ cursor: "not-allowed" }}
                      className="note-buttons"
                    />
                  </button>
                )}

                {activeNav === "deleted" ? (
                  <button>
                    {currentNote.starred ? (
                      <AiFillStar
                        style={{ color: "lightgrey", cursor: "not-allowed" }}
                        className="note-buttons"
                      />
                    ) : (
                      <BiStar
                        style={{ color: "lightgrey", cursor: "not-allowed" }}
                        className="note-buttons"
                      />
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      starredCounting(currentNote);
                      handleStarNote(currentNote);
                    }}
                  >
                    {currentNote.starred ? (
                      <AiFillStar fill="#fbff02" className="note-buttons" />
                    ) : (
                      <BiStar className="note-buttons" />
                    )}
                  </button>
                )}
                <button
                  onClick={() => {
                    deletedCounting(currentNote);
                    handleDeleteNote(currentNote);
                  }}
                >
                  {currentNote.deleted ? (
                    <MdOutlineDeleteForever className="note-buttons" />
                  ) : (
                    <BiTrash className="note-buttons" />
                  )}
                </button>
              </div>
            </div>
            <h6
              className="py-3 text-secondary font-weight-bolder"
              style={{ fontWeight: "600" }}
            >
              {currentNote.description}
            </h6>
          </div>
        ) : (
          <div>No Note Selected</div>
        )}
      </div>
      <div
        className={`${
          addNotesContainer ? "d-none" : "d-block"
        } add-notes-button-container`}
      >
        {/* <button className="add-notes-button" onClick={() => addContainer()}>+</button> */}
        <AiOutlinePlusCircle
          className="add-notes-button"
          onClick={() => addContainer()}
        />
      </div>
      <div
        className={`${addNotesContainer ? "d-flex" : "d-none"} add-note ${
          isEditing ? "edit" : ""
        }`}
      >
        <div className="add-note-inner-container">
          <div className="d-flex justify-content-between">
            <h5 className="py-2">Edit Note</h5>
            {currentNote ? (
              <div>
                {isEditing ? (
                  <div className="d-flex justify-content-between">
                    <div className="actions">
                      <p
                        onClick={() => {
                          starredCounting(currentNote);
                          handleStarNote(currentNote);
                        }}
                      >
                        {currentNote.starred ? (
                          <AiFillStar fill="#fbff02" className="note-buttons" />
                        ) : (
                          <BiStar className="note-buttons" />
                        )}
                      </p>
                      <p
                        onClick={() => {
                          deletedCounting(currentNote);
                          handleDeleteNote(currentNote);
                        }}
                      >
                        {currentNote.deleted ? (
                          <MdOutlineDeleteForever className="note-buttons px-3" />
                        ) : (
                          <BiTrash className="note-buttons px-3" />
                        )}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p></p>
                )}
              </div>
            ) : (
              <div>No Note Selected</div>
            )}
          </div>
          <label
            htmlFor="title"
            style={{ fontWeight: "600" }}
            className="font-weight-bold py-2"
          >
            Title<span className="text-danger">*</span>
          </label>
          <br />
          <input
            id="title"
            type="text"
            placeholder="Title"
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
          />
          <br />
          <label
            htmlFor="context"
            style={{ fontWeight: "600" }}
            className="font-weight-bold py-2"
          >
            Context<span className="text-danger">*</span>
          </label>
          <br />
          <textarea
            rows="6"
            id="context"
            placeholder="Description"
            value={newNoteDescription}
            onChange={(e) => setNewNoteDescription(e.target.value)}
          ></textarea>
          <div className="d-flex justify-content-start">
            <button onClick={() => addContainer()}>Cancel</button>
            <button
              className="mx-5"
              onClick={isEditing ? handleSaveNote : handleAddNote}
            >
              {isEditing ? "Save Note" : "Add Note"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotesApp;
