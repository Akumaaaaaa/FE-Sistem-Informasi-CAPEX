import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import CreateUserModal from './createusermodal'; 
import UpdateUserModal from './updateusermodal'; 
import DeleteUserModal from './deleteusermodal'; 
import './manageaccounts.css';

const ManageAccounts = () => {
  const navigate = useNavigate();
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [accountList, setAccountList] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else {
      fetchTotalAccounts();
      fetchAccountList();
    }
  }, [navigate]);

  const fetchTotalAccounts = async () => {
    try {
      const response = await fetch('http://localhost:3000/data/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        }
      });
      const data = await response.json();
      setTotalAccounts(data.length);
    } catch (error) {
      console.error('Error fetching total accounts:', error);
    }
  };

  const fetchAccountList = async () => {
    try {
      const response = await fetch('http://localhost:3000/data/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        }
      });
      const data = await response.json();
      setAccountList(data);
    } catch (error) {
      console.error('Error fetching account list:', error);
    }
  };

  const handleCreateUser = (newUser) => {
    setAccountList([...accountList, newUser]);
    setTotalAccounts(totalAccounts + 1);
  };

  const handleUpdateUser = (updatedUser) => {
    const updatedList = accountList.map(user => {
      if (user._id === updatedUser._id) {
        return updatedUser;
      }
      return user;
    });
    setAccountList(updatedList);
  };

  const handleDeleteUser = (userId) => {
    const updatedList = accountList.filter(user => user._id !== userId);
    setAccountList(updatedList);
    setTotalAccounts(totalAccounts - 1);
  };

  return (
    <div className="dashboard">
      <div className="background-blur"></div>
      <Sidebar />
      <div className="dashboard-content">
        <div className="header">
          <h2>Manage Accounts</h2>
          <button className="create-user-button" onClick={() => setShowCreateModal(true)}>Create User</button>
        </div>
        <div className="account-cards">
        <div className="account-card">
          <p className="account-card-text">Total Active Accounts:</p>
          <p className="total-accounts">{totalAccounts}</p>
        </div>
        </div>
        <div className="account-table table-container">
          <table>
            <thead>
              <tr>
                <th className="no-column">No</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accountList.map((account, index) => (
                <tr key={account._id}>
                  <td className="no-column">{index + 1}</td>
                  <td className="left-align">{account.email}</td>
                  <td className="left-align">{account.role}</td>
                  <td>
                    <button className="edit-button" onClick={() => {
                      setSelectedUser(account);
                      setShowUpdateModal(true);
                    }}>
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button className="delete-button" onClick={() => {
                      setSelectedUser(account);
                      setShowDeleteModal(true);
                    }}>
                      <i className="fas fa-trash-alt"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CreateUserModal show={showCreateModal} onClose={() => setShowCreateModal(false)} onCreate={handleCreateUser} />
      {showUpdateModal && <UpdateUserModal show={showUpdateModal} onClose={() => setShowUpdateModal(false)} onUpdate={handleUpdateUser} user={selectedUser} />}
      {showDeleteModal && <DeleteUserModal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} onDelete={handleDeleteUser} user={selectedUser} />}
    </div>
  );
};

export default ManageAccounts;