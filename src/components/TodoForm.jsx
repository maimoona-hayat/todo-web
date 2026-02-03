import React, { useState, useEffect } from 'react';
import { createTodo, updateTodo } from '../api';

function TodoForm({ onSave, editing }) {
  const [form, setForm] = useState({ title: '', description: '', category: '', dueDate: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (editing) {
      setForm(editing); // populate form for editing
      setError(''); // clear previous errors
    } else {
      setForm({ title: '', description: '', category: '', dueDate: '' });
    }
  }, [editing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // ✅ Check if due date is in the past
    if (form.dueDate) {
      const today = new Date();
      const due = new Date(form.dueDate);
      today.setHours(0,0,0,0); // ignore time
      if (due < today) {
        setError('Due date cannot be in the past');
        return; // stop submission
      }
    }

    try {
      if (editing) {
        await updateTodo(editing._id, form);
      } else {
        await createTodo(form);
      }

      onSave(); // refresh the list
      setForm({ title: '', description: '', category: '', dueDate: '' }); // clear form
    } catch (err) {
      console.error('Todo save error:', err.response?.data || err.message);
      setError('Error saving todo');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: '#fff' }}>
      <h3 style={{ marginBottom: '10px', color: '#333' }}>{editing ? 'Update Todo' : 'Add Todo'}</h3>
      
      {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

      <input
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
        required
      />

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '5px', border: '1px solid #ccc', height: '80px' }}
      />

      <input
        type="text"
        placeholder="Category (e.g., Work)"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
      />

      <input
        type="date"
        value={form.dueDate}
        onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
      />

      <button
        type="submit"
        style={{ width: '100%', padding: '10px', background: editing ? '#28a745' : '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        {editing ? 'Update' : 'Add'}
      </button>
    </form>
  );
}

export default TodoForm;
