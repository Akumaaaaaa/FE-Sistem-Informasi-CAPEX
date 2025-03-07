import React from 'react';
import Swal from 'sweetalert2';
import './deleteusermodal.css';

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

const DeleteUserModal = ({ show, onClose, onDelete, user }) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/data/users/${user._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        }
      });
      if (response.ok) {
        onDelete(user._id);
        onClose();
        Toast.fire({ 
          icon: 'success',
          title: 'User deleted successfully!'
        });
      } else {
        const data = await response.json();
        console.error('Error deleting user:', data.message);
        Toast.fire({
          icon: 'error',
          title: 'Error deleting user!'
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      Toast.fire({
        icon: 'error',
        title: 'Error deleting user!'
      });
    }
  };

  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Delete User</h2>
        <p>Are you sure you want to delete this user?</p>
        <div className="buttons">
          <button onClick={handleDelete} className='delete-button'>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
