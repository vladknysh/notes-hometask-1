// notes.js

import { notesData, extractDatesFromNoteContent } from './data.js';

let activeNotes = [...notesData];
let archivedNotes = [];

// Add a new note
export const addNote = (note) => {
  activeNotes.push(note);
};

// Edit a note
export const editNote = (noteId, updatedNote) => {
  const noteIndex = activeNotes.findIndex((note) => note.id === noteId);
  if (noteIndex !== -1) {
    activeNotes[noteIndex] = updatedNote;
  }
};

// Remove a note
export const removeNote = (noteId) => {
  activeNotes = activeNotes.filter((note) => note.id !== noteId);
};

// Archive a note
export const archiveNote = (noteId) => {
  const noteIndex = activeNotes.findIndex((note) => note.id === noteId);
  if (noteIndex !== -1) {
    const archivedNote = activeNotes.splice(noteIndex, 1)[0];
    archivedNotes.push(archivedNote);
  }
};

// Unarchive a note
export const unarchiveNote = (noteId) => {
  const noteIndex = archivedNotes.findIndex((note) => note.id === noteId);
  if (noteIndex !== -1) {
    const unarchivedNote = archivedNotes.splice(noteIndex, 1)[0];
    activeNotes.push(unarchivedNote);
  }
};

// Get all active notes
export const getActiveNotes = () => activeNotes;

// Get all archived notes
export const getArchivedNotes = () => archivedNotes;

// Get the summary of notes by category
export const getSummary = () => {
  const summary = {
    active: {},
    archived: {},
  };

  const categories = ['Task', 'Random Thought', 'Idea'];

  categories.forEach((category) => {
    summary.active[category] = activeNotes.filter((note) => note.category === category).length;
    summary.archived[category] = archivedNotes.filter((note) => note.category === category).length;
  });

  return summary;
};

// Initialize the notes with the prepopulated data
export const initializeNotes = () => {
  activeNotes = [...notesData];
  archivedNotes = [];
};
