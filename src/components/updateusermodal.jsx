import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './createusermodal.css';

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

const UpdateUserModal = ({ show, onClose, onUpdate, user }) => {
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/data/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ email, role })
      });
      const data = await response.json();
      if (response.ok) {
        onUpdate(data);
        onClose();
        Toast.fire({ 
          icon: 'success',
          title: 'User updated successfully!'
        });
      } else {
        console.error('Error updating user:', data.message);
        Toast.fire({ 
          icon: 'error',
          title: 'Error updating user!'
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      Toast.fire({ 
        icon: 'error',
        title: 'Error updating user!'
      });
    }
  };

  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Update User</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            maxLength="50" 
            required 
          />
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="karyawan">Karyawan</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserModal;