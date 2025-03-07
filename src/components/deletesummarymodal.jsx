import React from 'react';
import Swal from 'sweetalert2';
import './deletesummarymodal.css';

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

const DeleteSummaryModal = ({ show, onClose, onDelete, summary }) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/summary/${summary._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        }
      });
      if (response.ok) {
        onDelete(summary._id);
        onClose();
        Toast.fire({
          icon: 'success',
          title: 'Performance deleted successfully!'
        });
      } else {
        console.error('Error deleting Performance:', response.statusText);
        Toast.fire({
          icon: 'error',
          title: 'Error deleting Performance!'
        });
      }
    } catch (error) {
      console.error('Error deleting Performance:', error);
      Toast.fire({
        icon: 'error',
        title: 'Error deleting Performance!'
      });
    }
  };

  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Delete Performance</h2>
        <p>Are you sure you want to delete this Performance?</p>
        <div className="buttons">
          <button onClick={handleDelete} className='delete-button'>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSummaryModal;
