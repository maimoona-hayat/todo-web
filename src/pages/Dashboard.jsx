import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TodoList from '../components/TodoList';
import TodoForm from '../components/TodoForm';
import Pagination from '../components/Pagination';
import { getTodos } from '../api';

function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const firstLetter = user.username?.charAt(0).toUpperCase() || 'U';

  const fetchTodos = async (p = 1) => {
    try {
      setLoading(true);
      const res = await getTodos(p);
      if (res.data.isSuccess && res.data.data) {
        setTodos(res.data.data.todos || []);
        setTotal(res.data.data.total || 0);
        setPage(p);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    else fetchTodos();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '8px' }}>dashboard</span>
          My Todos
        </h1>
        <div className="user-menu">
          <div className="user-avatar" onClick={() => setShowMenu(!showMenu)}>{firstLetter}</div>
          {showMenu && (
            <div className="user-dropdown">
              <p>{user.username}</p>
              <p className="user-email">{user.email}</p>
              <button className="btn-logout" onClick={handleLogout}>
                <span className="material-icons">logout</span> Logout
              </button>
            </div>
          )}
        </div>
      </div>
      
      <TodoForm onSave={() => { fetchTodos(page); setEditing(null); }} editing={editing} />
      
      {loading ? (
        <div className="empty-state">
          <span className="material-icons">hourglass_empty</span>
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <TodoList todos={todos} onEdit={setEditing} onDelete={() => fetchTodos(page)} />
          <Pagination total={total} page={page} onPageChange={fetchTodos} />
        </>
      )}
    </div>
  );
}

export default Dashboard;