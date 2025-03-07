import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './updatesummarymodal.css';

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

const UpdateSummaryModal = ({ show, onClose, onUpdate, summary }) => {
  const [editedSummary, setEditedSummary] = useState({ ...summary });

  useEffect(() => {
    setEditedSummary({ ...summary });
  }, [summary]);

  const handleChange = (e, field) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || (Number(value) <= 99999)) {
      setEditedSummary({ ...editedSummary, [field]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/summary/${summary._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(editedSummary)
      });
      const data = await response.json();
      if (response.ok) {
        onUpdate(data);
        onClose();
        Toast.fire({ 
          icon: 'success',
          title: 'Performance updated successfully!'
        });
      } else {
        console.error('Error updating Performance:', data.message);
        Toast.fire({ 
          icon: 'error',
          title: 'Error updating Performance!'
        });
      }
    } catch (error) {
      console.error('Error updating Performance:', error);
      Toast.fire({ 
        icon: 'error',
        title: 'Error updating Performance!'
      });
    }
  };

  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Update Performance</h2>
        <form onSubmit={handleSubmit}>
          <label>Process Name</label>
          <input 
            type="text" 
            value={editedSummary.nama_proses} 
            onChange={(e) => setEditedSummary({ ...editedSummary, nama_proses: e.target.value })} 
            maxLength="50"
            required 
          />
          
          <label>First Amount</label>
          <input 
            type="text" 
            value={(editedSummary.jumlah_pertama || '').toLocaleString()} 
            onChange={(e) => handleChange(e, 'jumlah_pertama')} 
            max="99999"
            required 
          />
          
          <label>Second Amount</label>
          <input 
            type="text" 
            value={(editedSummary.jumlah_kedua || '').toLocaleString()} 
            onChange={(e) => handleChange(e, 'jumlah_kedua')} 
            max="99999"
            required 
          />
          
          <label>Description</label>
          <input 
            type="text" 
            value={editedSummary.keterangan} 
            onChange={(e) => setEditedSummary({ ...editedSummary, keterangan: e.target.value })} 
            maxLength="190"
            required
          />
          
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateSummaryModal;