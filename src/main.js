// main.js

import { renderApp } from './render.js';
import { initializeNotes } from './notes.js';
import '../style.css'

// Initialize the notes
initializeNotes();

// Render the notes and summary on page load
renderApp();
