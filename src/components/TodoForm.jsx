import React, { useState, useEffect } from 'react';
import { createTodo, updateTodo } from '../api';
import { useToast } from '../context/ToastContext';

function TodoForm({ onSave, editing }) {
  const [form, setForm] = useState({ title: '', description: '', category: '', dueDate: '' });
  const toast = useToast();

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title || '',
        description: editing.description || '',
        category: editing.category || '',
        dueDate: editing.dueDate ? editing.dueDate.split('T')[0] : ''
      });
    } else {
      setForm({ title: '', description: '', category: '', dueDate: '' });
    }
  }, [editing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.dueDate) {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (new Date(form.dueDate) < today) {
        toast.warning('Due date cannot be in the past');
        return;
      }
    }
    try {
      if (editing) {
        await updateTodo(editing._id, form);
        toast.success('Todo updated!');
      } else {
        await createTodo(form);
        toast.success('Todo created!');
      }
      onSave();
      setForm({ title: '', description: '', category: '', dueDate: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving todo');
    }
  };

  return (
    <div className="todo-form-card">
      <h3><span className="material-icons">{editing ? 'edit' : 'add_task'}</span> {editing ? 'Update Todo' : 'Add New Todo'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="text" placeholder="What needs to be done?" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div className="form-group">
          <textarea placeholder="Add a description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="2" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <input type="text" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <div className="form-group">
            <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </div>
        </div>
        <button type="submit" className={`btn-primary ${editing ? 'btn-success' : ''}`}>
          <span className="material-icons">{editing ? 'save' : 'add'}</span> {editing ? 'Update Todo' : 'Add Todo'}
        </button>
      </form>
    </div>
  );
}

export default TodoForm;