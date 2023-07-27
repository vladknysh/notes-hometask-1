// render.js

import { getActiveNotes, getSummary, archiveNote, unarchiveNote, removeNote, editNote, addNote, getArchivedNotes } from './notes.js';
import { categoriesData, extractDatesFromNoteContent } from './data.js';
import { nanoid } from 'nanoid';

// Global variable to store the selected note for editing
let selectedNote = null;

// Render the "Add Note" form
let addNoteForm = null; // Declare a variable to store the reference to the "Add Note" form

const renderAddNoteForm = () => {
  if (addNoteForm) {
    // If the form already exists, show it and return
    addNoteForm.style.display = 'block';
    return;
  }

  addNoteForm = document.createElement('form');
  addNoteForm.addEventListener('submit', handleAddNoteSubmit);

  const titleLabel = document.createElement('label');
  titleLabel.textContent = 'Title:';
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.required = true;
  addNoteForm.appendChild(titleLabel);
  addNoteForm.appendChild(titleInput);

  const contentLabel = document.createElement('label');
  contentLabel.textContent = 'Content:';
  const contentInput = document.createElement('textarea');
  contentInput.required = true;
  addNoteForm.appendChild(contentLabel);
  addNoteForm.appendChild(contentInput);

  const categoryLabel = document.createElement('label');
  categoryLabel.textContent = 'Category:';
  const categorySelect = document.createElement('select');
  const categories = ['Task', 'Random Thought', 'Idea'];
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.textContent = category;
    categorySelect.appendChild(option);
  });
  categorySelect.required = true;
  addNoteForm.appendChild(categoryLabel);
  addNoteForm.appendChild(categorySelect);

  const addButton = document.createElement('button');
  addButton.textContent = 'Create Note';
  addNoteForm.appendChild(addButton);

  const appDiv = document.getElementById('app');
  appDiv.appendChild(addNoteForm);
};

// Render the notes table
const renderNotes = (container) => {
  const notesTable = document.createElement('table');

  const tableHeaders = ['Time of Creation', 'Title', 'Note Content', 'Note Category', 'Dates Mentioned', 'Actions'];
  const headerRow = document.createElement('tr');

  tableHeaders.forEach((header) => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });

  notesTable.appendChild(headerRow);

  const activeNotes = getActiveNotes();
  activeNotes.forEach((note) => {
    const row = document.createElement('tr');
    const date = new Date(note.time);
    const datesMentioned = extractDatesFromNoteContent(note.content).join(', ');

    const rowData = [date.toLocaleString(), note.title, note.content, note.category, datesMentioned];

    rowData.forEach((data) => {
      const cell = document.createElement('td');
      cell.textContent = data;
      row.appendChild(cell);
    });

    const actionsCell = document.createElement('td');
    const editButton = createButton('Edit', () => handleEdit(note));
    const archiveButton = createButton('Archive', () => handleArchive(note));
    const removeButton = createButton('Remove', () => handleRemove(note));

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(archiveButton);
    actionsCell.appendChild(removeButton);
    row.appendChild(actionsCell);

    notesTable.appendChild(row);
  });

  container.appendChild(notesTable);
};

// Helper function to create buttons
const createButton = (label, onClick) => {
  const button = document.createElement('button');
  button.textContent = label;
  button.addEventListener('click', onClick);
  button.classList.add('btn'); // Add the class for button styling
  return button;
};

// Event handler for edit button
const handleEdit = (note) => {
  selectedNote = note;
  renderNotesTableAndSummary();
  showEditFormOverlay();
};

// Event handler for archive button
const handleArchive = (note) => {
  archiveNote(note.id);
  renderNotesTableAndSummary();
};

// Event handler for remove button
const handleRemove = (note) => {
  removeNote(note.id);
  renderNotesTableAndSummary();
};

// Show the edit form overlay
const showEditFormOverlay = () => {
  // Check if an edit form for the selected note is already visible
  const existingEditForm = document.getElementById('edit-form-overlay');
  if (existingEditForm) {
    // Update the content of the existing form with the current note details
    const titleInput = existingEditForm.querySelector('input[name="title"]');
    const contentInput = existingEditForm.querySelector('textarea[name="content"]');
    const categorySelect = existingEditForm.querySelector('select[name="category"]');
    titleInput.value = selectedNote.title;
    contentInput.value = selectedNote.content;
    categorySelect.value = selectedNote.category;
    return;
  }

  const editFormOverlay = document.createElement('div');
  editFormOverlay.id = 'edit-form-overlay';

  const formContainer = document.createElement('div');
  formContainer.classList.add('form-container');

  const titleLabel = document.createElement('label');
  titleLabel.textContent = 'Title:';
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.value = selectedNote.title;
  titleInput.name = 'title'; // Adding a name attribute for later reference
  titleInput.classList.add('input-field'); // Add the class for styling
  formContainer.appendChild(titleLabel);
  formContainer.appendChild(titleInput);

  const contentLabel = document.createElement('label');
  contentLabel.textContent = 'Content:';
  const contentInput = document.createElement('textarea');
  contentInput.value = selectedNote.content;
  contentInput.name = 'content'; // Adding a name attribute for later reference
  contentInput.classList.add('input-field'); // Add the class for styling
  formContainer.appendChild(contentLabel);
  formContainer.appendChild(contentInput);

  const categoryLabel = document.createElement('label');
  categoryLabel.textContent = 'Category:';
  const categorySelect = document.createElement('select');
  const categories = ['Task', 'Random Thought', 'Idea'];
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.textContent = category;
    categorySelect.appendChild(option);
  });
  categorySelect.value = selectedNote.category;
  categorySelect.name = 'category'; // Adding a name attribute for later reference
  categorySelect.classList.add('input-field'); // Add the class for styling
  formContainer.appendChild(categoryLabel);
  formContainer.appendChild(categorySelect);

  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save';
  saveButton.addEventListener('click', () => handleSave(titleInput.value, contentInput.value, categorySelect.value));
  saveButton.classList.add('btn'); // Add the class for button styling
  formContainer.appendChild(saveButton);

  editFormOverlay.appendChild(formContainer);

  const appDiv = document.getElementById('app');
  appDiv.appendChild(editFormOverlay);
};

// Event handler for saving the edited note
const handleSave = (title, content, category) => {
  if (selectedNote) {
    editNote(selectedNote.id, { ...selectedNote, title, content, category });
    selectedNote = null;
    renderNotesTableAndSummary();
  }
};

// Event handler for unarchive button
const handleUnarchive = (note) => {
  unarchiveNote(note.id); // Unarchive the note
  renderNotesTableAndSummary();
  renderArchivedNotes();
};

// Render the archived notes table
const renderArchivedNotesTable = (container) => {
  const archivedNotesTable = document.createElement('table');

  const tableHeaders = ['Time of Creation', 'Title', 'Note Content', 'Note Category', 'Dates Mentioned', 'Actions'];
  const headerRow = document.createElement('tr');

  tableHeaders.forEach((header) => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });

  archivedNotesTable.appendChild(headerRow);

  const archivedNotes = getArchivedNotes();
  archivedNotes.forEach((note) => {
    const row = document.createElement('tr');
    const date = new Date(note.time);
    const datesMentioned = extractDatesFromNoteContent(note.content).join(', ');

    const rowData = [date.toLocaleString(), note.title, note.content, note.category, datesMentioned];

    rowData.forEach((data) => {
      const cell = document.createElement('td');
      cell.textContent = data;
      row.appendChild(cell);
    });

    const actionsCell = document.createElement('td');
    const unarchiveButton = createButton('Unarchive', () => handleUnarchive(note));
    actionsCell.appendChild(unarchiveButton);
    row.appendChild(actionsCell);

    archivedNotesTable.appendChild(row);
  });

  container.appendChild(archivedNotesTable);
};

// Event handler for submitting the "Add Note" form
const handleAddNoteSubmit = (event) => {
  event.preventDefault();
  const form = event.target;
  const title = form.elements[0].value;
  const content = form.elements[1].value;
  const category = form.elements[2].value;
  const time = new Date(); // Create a new Date object representing the current time

  try {
    if (!title || !content || !category) {
      throw new Error('Please fill in all fields.'); // Throw an error if any field is empty
    }

    addNote({ title, content, category, time, id: nanoid() }); // Include the time and generate an id using nanoid()
    form.reset();
    renderNotesTableAndSummary();

    // Hide the "Add Note" form after successfully adding the note
    addNoteForm.style.display = 'none';
  } catch (error) {
    console.error(error.message); // Log the error message to the console
  }
};

// Render the summary table
const renderSummary = (container) => {
  const summary = getSummary();

  const summaryTable = document.createElement('table');
  const tableHeaders = ['Category', 'Active Notes', 'Archived Notes'];

  const headerRow = document.createElement('tr');
  tableHeaders.forEach((header) => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });

  summaryTable.appendChild(headerRow);

  const categories = [...categoriesData];
  categories.forEach((category) => {
    const row = document.createElement('tr');
    const rowData = [category, summary.active[category], summary.archived[category]];

    rowData.forEach((data) => {
      const cell = document.createElement('td');
      cell.textContent = data;
      row.appendChild(cell);
    });

    summaryTable.appendChild(row);
  });

  container.appendChild(summaryTable);
};

const renderNotesTableAndSummary = () => {
  const notesTableContainer = document.createElement('div');
  renderNotes(notesTableContainer);

  const summaryContainer = document.createElement('div');
  renderSummary(summaryContainer);

  const appDiv = document.getElementById('app');
  appDiv.innerHTML = ''; // Clear the app content

  appDiv.appendChild(notesTableContainer);
  appDiv.appendChild(summaryContainer);

  const addNoteButton = document.createElement('button');
  addNoteButton.textContent = 'Add Note';
  addNoteButton.addEventListener('click', () => showAddNoteForm());
  appDiv.appendChild(addNoteButton);

  const showArchivedNotesButton = document.createElement('button');
  showArchivedNotesButton.textContent = 'Show Archived Notes';
  showArchivedNotesButton.addEventListener('click', () => renderArchivedNotes());
  appDiv.appendChild(showArchivedNotesButton);
};

const renderArchivedNotes = () => {
  const archivedNotesContainer = document.createElement('div');
  const archivedNotes = getArchivedNotes();

  if (archivedNotes.length === 0) {
    const noArchivedNotesMessage = document.createElement('p');
    noArchivedNotesMessage.textContent = 'No archived notes found.';
    archivedNotesContainer.appendChild(noArchivedNotesMessage);
  } else {
    // Display archived notes as a table with the "Unarchive" button
    renderArchivedNotesTable(archivedNotesContainer);
  }

  const appDiv = document.getElementById('app');
  appDiv.innerHTML = ''; // Clear the app content
  appDiv.appendChild(archivedNotesContainer);

  const showActiveNotesButton = document.createElement('button');
  showActiveNotesButton.textContent = 'Show Active Notes';
  showActiveNotesButton.addEventListener('click', () => renderNotesTableAndSummary());
  appDiv.appendChild(showActiveNotesButton);
};

const showAddNoteForm = () => {
  // Remove the edit form overlay if it exists
  const editFormOverlay = document.getElementById('edit-form-overlay');
  if (editFormOverlay) {
    editFormOverlay.remove();
  }

  // If the "Add Note" form already exists, show it and return
  if (addNoteForm) {
    addNoteForm.style.display = 'block';
    return;
  }

  // If the form doesn't exist, create and render it
  renderAddNoteForm();
};

// Function to render the app
export const renderApp = () => {
  const appDiv = document.getElementById('app');
  appDiv.innerHTML = ''; // Clear the app content

  renderNotesTableAndSummary();
};

