// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TodoList from "../components/TodoList";
import TodoForm from "../components/TodoForm";
import Pagination from "../components/Pagination";
import { useToast } from '../context/ToastContext';
import { getTodos } from "../api";

function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();

  const [todos, setTodos] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userImage = user?.image || '';
  const firstLetter = user?.username?.charAt(0)?.toUpperCase() || "U";

  const fetchTodos = async (p = 1) => {
    try {
      setLoading(true);
      const res = await getTodos(p);
      const data = res?.data;
      
      if (data?.isSuccess && data?.data) {
        setTodos(Array.isArray(data.data.todos) ? data.data.todos : []);
        setTotal(data.data.total || 0);
        setPage(p);
      } else {
        setTodos([]);
        setTotal(0);
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        localStorage.clear();
        toast.error('Session expired. Please login again');
        navigate("/login");
      } else {
        toast.error('Failed to fetch todos');
        setTodos([]);
      }
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  console.log("Dashboard useEffect running");
  
  const token = localStorage.getItem("token");
  console.log("Token exists:", !!token);
  
  if (!token) {
    console.log("No token, redirecting to login");
    navigate("/login");
    return;
  }
  
  console.log("Fetching todos...");
  fetchTodos(1);
}, []);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <span className="material-icons">dashboard</span>
          My Todos
        </h1>
        <div className="user-menu">
          <div
            className="user-avatar"
            onClick={() => setShowMenu(!showMenu)}
            style={{
              // FIX: Added 'none' as the fallback value
              backgroundImage: userImage ? `url(${userImage})` : 'none', 
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {!userImage && firstLetter}
          </div>
          {showMenu && (
            <div className="user-dropdown">
              <p className="user-name">{user.username}</p>
              <p className="user-email">{user.email}</p>
              <button className="btn-logout" onClick={handleLogout}>
                <span className="material-icons">logout</span>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <TodoForm
        editing={editing}
        onSave={() => {
          fetchTodos(page);
          setEditing(null);
        }}
      />

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