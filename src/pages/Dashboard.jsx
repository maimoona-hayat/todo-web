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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const firstLetter = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  const fetchTodos = async (p = 1) => {
    try {
      const res = await getTodos(p);
      if (res.data.isSuccess) {
        setTodos(res.data.data.todos);
        setTotal(res.data.data.total);
        setPage(p);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) navigate('/login');
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
    <div style={{ padding: '20px', minHeight: '100vh', background: '#e6f0ff', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Header Column */}
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent:"space-around",alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#003366' }}>My Todos</h1>
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: '#007bff',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '18px',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            {firstLetter}
          </div>
          {showUserMenu && user && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '60px',
              background: '#cce0ff',
              border: '1px solid #99c2ff',
              borderRadius: '8px',
              padding: '15px',
              minWidth: '200px',
              zIndex: 100,
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <p style={{ margin: 0, fontWeight: 'bold', color: '#003366' }}>{user.username}</p>
              <p style={{ margin: '5px 0', color: '#003366', fontSize: '14px' }}>{user.email}</p>
              <button
                onClick={handleLogout}
                style={{
                  marginTop: '10px',
                  width: '100%',
                  background: '#dc3545',
                  color: 'white',
                  padding: '7px 10px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content Flex */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
        <TodoForm
          onSave={() => { fetchTodos(page); setEditing(null); }}
          editing={editing}
        />
        <TodoList todos={todos} onEdit={setEditing} onDelete={() => fetchTodos(page)} />
        <Pagination total={total} page={page} onPageChange={fetchTodos} />
      </div>
    </div>
  );
}

export default Dashboard;
