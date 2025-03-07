import React, { useState } from 'react';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-right',
  iconColor: 'white',
  customClass: {
    popup: 'colored-toast',
    icon: 'colored-toast',
    title: 'colored-toast',
    htmlContainer: 'colored-toast'
  },
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true
});

const CreateUserModal = ({ show, onClose, onCreate }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('karyawan');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/data/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ email, role, password })
      });
      const data = await response.json();
      if (response.ok) {
        onCreate(data);
        onClose();
        Toast.fire({ 
          icon: 'success',
          title: 'User created successfully!'
        });
      } else {
        console.error('Error creating user:', data.message);
        Toast.fire({ 
          icon: 'error',
          title: 'Error creating user!'
        });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      Toast.fire({ 
        icon: 'error',
        title: 'Error creating user!'
      });
    }
  };

  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Create User</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="karyawan">Karyawan</option>
            <option value="admin">Admin</option>
          </select>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="create-button">Create</button>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
