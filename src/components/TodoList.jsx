import React from 'react';
import { deleteTodo, updateTodo } from '../api';

function TodoList({ todos = [], onEdit, onDelete }) {

  // Delete todo
  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm('Delete this todo?')) return;

    try {
      await deleteTodo(id);
      onDelete();
    } catch (err) {
      console.error('Delete failed:', err.response?.data || err.message);
    }
  };

  // Toggle Completed
  const toggleComplete = async (todo) => {
    try {
      // Sirf backend ke allowed fields bhej rahe hain
      const { title, description, category, dueDate, isCompleted } = todo;
      const updatedTodo = {
        title,
        description,
        category,
        dueDate,
        isCompleted: !isCompleted
      };

      await updateTodo(todo._id, updatedTodo);
      onDelete(); // refresh todos
    } catch (err) {
      console.error('Update failed:', err.response?.data || err.message);
    }
  };

  if (!todos.length) {
    return <p style={{ color: '#666', marginTop: '20px' }}>No todos found.</p>;
  }

  return (
    <div
      className="todo-grid"
      style={{
        display: 'grid',
        gap: '12px',
        marginTop: '20px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
      }}
    >
      {todos.map((todo) => (
        <div
          key={todo._id}
          className="todo-card"
        style={{
              padding: '10px', // smaller padding
            border: '1px solid #99c2ff',
            borderRadius: '6px',
            background: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', // smaller shadow
            minHeight: '120px' // slightly smaller height
        }}
        >
         <h4
            style={{
              marginBottom: '6px',
              color: '#003366',
              fontSize: '16px',
              textDecoration: todo.isCompleted ? 'line-through' : 'none' // overline for completed
            }}
          >
            {todo.title}
          </h4>
          <p style={{ color: '#666', marginBottom: '5px' }}>{todo.description || 'No description'}</p>
          <p style={{ fontSize: '14px', color: '#999', marginBottom: '3px' }}>
            Category: {todo.category || 'None'}
          </p>
          <p style={{ fontSize: '14px', color: '#999', marginBottom: '3px' }}>
            Due: {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'None'}
          </p>

          {/* Status Button */}
     <button
  onClick={() => toggleComplete(todo)}
  className={`status-btn ${todo.isCompleted ? 'completed' : 'pending'}`}
  style={{
    width: '100%',
    background: todo.isCompleted ? '#28a745' : '#007bff',
    color: 'white',
    padding: '7px 0',
    border: 'none',
    borderRadius: '5px',
    marginBottom: '10px',
    cursor: 'pointer'
  }}
>
  {todo.isCompleted ? 'Completed' : 'Mark Complete'}
</button>

<div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
  <button  style={{
                flex: 1,
                background: '#ffc107',
                color: 'white',
                padding: '7px 0',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }} 
              onClick={() => onEdit(todo)} className="edit-btn">Edit</button>
  <button onClick={() => handleDelete(todo._id)} className="delete-btn"
      style={{
                flex: 1,
                background: '#dc3545',
                color: 'white',
                padding: '7px 0',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}>Delete</button>
</div>
        </div>
      ))}
    </div>
  );
}

export default TodoList;
