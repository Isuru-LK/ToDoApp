import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [inspirationIndex, setInspirationIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [taskToComplete, setTaskToComplete] = useState(null);
  const [showDuplicatePopup, setShowDuplicatePopup] = useState(false);

  const inspirations = [
  "Conquer Today, One Task at a Time!",
  "Your Future Self Will Thank You!",
  "Small Steps, Big Wins!",
  "Progress Over Perfection!",
  "Turn Plans into Reality!",
  "Your Dreams Need Action!",
  "Make It Happen, One Task at a Time!",
  "Each To-Do is a Step Closer to Success!",
  "Don’t Just Plan—Execute!",
  "Win the Day with One Completed Task!"
  ];

  useEffect(() => {
    fetchTasks();

    const interval = setInterval(() => {
      setInspirationIndex((prev) => (prev + 1) % inspirations.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Fetch tasks error:', error);
      setTimeout(fetchTasks, 1000);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    const isDuplicate = tasks.some(
      (task) => task.title === title && task.description === description
    );
    if (isDuplicate) {
      setShowDuplicatePopup(true);
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/tasks', { title, description });
      setTitle('');
      setDescription('');
      fetchTasks();
      setInspirationIndex((prev) => (prev + 1) % inspirations.length);
    } catch (error) {
      console.error('Create task error:', error);
    }
  };

  const handleCompleteTask = (task) => {
    setTaskToComplete(task);
    setShowPopup(true);
  };

  const confirmCompleteTask = async () => {
    if (taskToComplete) {
      try {
        await axios.put(`http://localhost:5000/api/tasks/${taskToComplete.id}`);
        fetchTasks();
        setInspirationIndex((prev) => (prev + 1) % inspirations.length);
      } catch (error) {
        console.error('Complete task error:', error);
      }
    }
    setShowPopup(false);
    setTaskToComplete(null);
  };

  const cancelCompleteTask = () => {
    setShowPopup(false);
    setTaskToComplete(null);
  };

  const closeDuplicatePopup = () => {
    setShowDuplicatePopup(false);
  };

  return (
    <div className="App">
      <div className="form-container">
        <h1>Add a Task</h1>
        <form onSubmit={createTask}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task Title"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task Description"
          />
          <button type="submit">Add Task</button>
        </form>
        <div className="task-inspirations">
          <h3>Need Inspiration?</h3>
          <p>{inspirations[inspirationIndex]}</p>
        </div>
      </div>
      <div className="task-container">
        <h1>Latest Tasks</h1>
        {tasks.length > 0 ? (
          <div className="task-list">
            {tasks.map((task) => (
              <div key={task.id} className="task-card">
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                </div>
                <button onClick={() => handleCompleteTask(task)}>Done</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No tasks yet—add one!</p>
          </div>
        )}
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Mark as Done?</h3>
            <p>Are you sure you want to complete "{taskToComplete?.title}"?</p>
            <button className="confirm" onClick={confirmCompleteTask}>Yes</button>
            <button className="cancel" onClick={cancelCompleteTask}>No</button>
          </div>
        </div>
      )}

      {showDuplicatePopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Duplicate Task</h3>
            <p>This task already exists. Please add a different one.</p>
            <button className="ok" onClick={closeDuplicatePopup}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;