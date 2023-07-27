// data.js

// List of Categories
export const categoriesData = ['Task', 'Random Thought', 'Idea'];

// Initial notes data
export const notesData = [
  {
    id: 1,
    time: '2023-07-25T08:30:00',
    title: 'Appointment',
    content: "I'm gonna have a dentist appointment on the 3/5/2021, I moved it from 5/5/2021",
    category: 'Task',
  },
  {
    id: 2,
    time: '2023-07-26T10:00:00',
    title: 'Random Thought',
    content: 'I wonder what life will be like in the year 2050!',
    category: 'Random Thought',
  },
  {
    id: 3,
    time: '2023-07-26T14:15:00',
    title: 'Idea',
    content: 'A mobile app to track daily habits and goals would be helpful.',
    category: 'Idea',
  },
  {
    id: 4,
    time: '2023-07-27T09:45:00',
    title: 'Task',
    content: 'Finish the report and send it to the manager by the 27/07/2023.',
    category: 'Task',
  },
  {
    id: 5,
    time: '2023-07-27T13:30:00',
    title: 'Random Thought',
    content: 'Nature has so much to offer, from the breathtaking landscapes to the diverse wildlife!',
    category: 'Random Thought',
  },
  {
    id: 6,
    time: '2023-07-27T16:20:00',
    title: 'Idea',
    content: 'Start a blog to share personal experiences and insights.',
    category: 'Idea',
  },
  {
    id: 7,
    time: '2023-07-28T11:45:00',
    title: 'Task',
    content: "Buy groceries for the weekend. Don't forget to get milk, eggs, and fresh fruits.",
    category: 'Task',
  },
];

// Utility function to get dates mentioned in a note
export const extractDatesFromNoteContent = (content) => {
  const dateRegex = /\d{1,2}\/\d{1,2}\/\d{4}/g;
  return content.match(dateRegex) || [];
};
