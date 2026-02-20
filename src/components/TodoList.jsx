import React from 'react';
import { deleteTodo, updateTodo } from '../api';

function TodoList({ todos = [], onEdit, onDelete }) {
  const todoList = todos || [];

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this todo?')) return;
    try { 
      await deleteTodo(id); 
      alert('Todo deleted!'); 
      onDelete(); 
    }
    catch (err) { 
      alert(err.response?.data?.message || 'Failed to delete'); 
    }
  };

  const toggleComplete = async (todo) => {
    try {
      await updateTodo(todo._id, { 
        title: todo.title, 
        description: todo.description, 
        category: todo.category, 
        dueDate: todo.dueDate, 
        isCompleted: !todo.isCompleted 
      });
      alert(todo.isCompleted ? 'Marked as pending!' : 'Marked as completed!');
      onDelete();
    } catch (err) { 
      alert(err.response?.data?.message || 'Failed to update'); 
    }
  };

  if (!todoList.length) return (
    <div className="empty-state">
      <span className="material-icons">assignment</span>
      <p>No todos yet. Add your first todo above!</p>
    </div>
  );

  return (
    <div className="todo-grid">
      {todoList.map((todo) => (
        <div key={todo._id} className={`todo-card ${todo.isCompleted ? 'completed' : ''}`}>
          <div className="todo-header">
            <h4 className={todo.isCompleted ? 'completed-text' : ''}>{todo.title}</h4>
            <span className={`status-badge ${todo.isCompleted ? 'badge-success' : 'badge-pending'}`}>
              {todo.isCompleted ? 'Done' : 'Pending'}
            </span>
          </div>
          <p className="todo-description">{todo.description || 'No description'}</p>
          <div className="todo-meta">
            <span className="meta-item"><span className="material-icons">folder</span> {todo.category || 'None'}</span>
            <span className="meta-item"><span className="material-icons">event</span> {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'None'}</span>
          </div>
          <div className="todo-actions">
            <button onClick={() => toggleComplete(todo)} className={`btn ${todo.isCompleted ? 'btn-warning' : 'btn-success'}`}>
              <span className="material-icons">{todo.isCompleted ? 'undo' : 'check'}</span> 
              {todo.isCompleted ? 'Undo' : 'Complete'}
            </button>
            <button onClick={() => onEdit(todo)} className="btn btn-edit">
              <span className="material-icons">edit</span> Edit
            </button>
            <button onClick={() => handleDelete(todo._id)} className="btn btn-delete">
              <span className="material-icons">delete</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TodoList;