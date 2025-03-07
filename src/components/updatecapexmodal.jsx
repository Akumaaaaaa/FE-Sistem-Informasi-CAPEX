import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './updatecapexmodal.css';

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

const UpdateDataCapexModal = ({ show, onClose, onUpdate, capex }) => {
  const [editedCapex, setEditedCapex] = useState({ ...capex });

  useEffect(() => {
    setEditedCapex({ ...capex });
  }, [capex]);

  const handleChange = (e, field) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || (Number(value) <= 999999)) {
      setEditedCapex({ ...editedCapex, [field]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/dataCapex/${capex._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(editedCapex)
      });
      const data = await response.json();
      if (response.ok) {
        onUpdate(data);
        onClose();
        Toast.fire({ 
          icon: 'success',
          title: 'Data Capex updated successfully!'
        });
      } else {
        console.error('Error updating Data Capex:', data.message);
        Toast.fire({ 
          icon: 'error',
          title: 'Error updating Data Capex!'
        });
      }
    } catch (error) {
      console.error('Error updating Data Capex:', error);
      Toast.fire({ 
        icon: 'error',
        title: 'Error updating Data Capex!'
      });
    }
  };

  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Update CAPEX Data</h2>
        <form onSubmit={handleSubmit}>
          <label>Submission Value</label>
          <input 
            type="text" 
            value={(editedCapex.nilai_pengajuan || '').toLocaleString()} 
            onChange={(e) => handleChange(e, 'nilai_pengajuan')} 
            max="99999"
            required 
          />
          
          <label>Approved BP</label>
          <input 
            type="text" 
            value={(editedCapex.approved_bp || '').toLocaleString()} 
            onChange={(e) => handleChange(e, 'approved_bp')} 
            max="99999"
            required 
          />
          
          <label>IM Amount</label>
          <input 
            type="text" 
            value={(editedCapex.im_amount || '').toLocaleString()} 
            onChange={(e) => handleChange(e, 'im_amount')} 
            max="99999"
            required 
          />
          
          <label>PR Amount</label>
          <input 
            type="text" 
            value={(editedCapex.pr_amount || '').toLocaleString()} 
            onChange={(e) => handleChange(e, 'pr_amount')} 
            max="99999"
            required 
          />
          
          <label>PO Amount</label>
          <input 
            type="text" 
            value={(editedCapex.po_amount || '').toLocaleString()} 
            onChange={(e) => handleChange(e, 'po_amount')} 
            max="99999"
            required 
          />
          
          <label>VOWD Incomplete</label>
          <input 
            type="text" 
            value={(editedCapex.vowd_incomplete || '').toLocaleString()} 
            onChange={(e) => handleChange(e, 'vowd_incomplete')} 
            max="99999"
            required 
          />
          
          <label>VOWD Complete</label>
          <input 
            type="text" 
            value={(editedCapex.vowd_complete || '').toLocaleString()} 
            onChange={(e) => handleChange(e, 'vowd_complete')} 
            max="99999"
            required 
          />
          
          <label>Claim Submission</label>
          <input 
            type="text" 
            value={(editedCapex.pengajuan_claim || '').toLocaleString()} 
            onChange={(e) => handleChange(e, 'pengajuan_claim')} 
            max="99999"
            required 
          />
          
          <label>Claim Payment</label>
          <input 
            type="text" 
            value={(editedCapex.pembayaran_claim || '').toLocaleString()} 
            onChange={(e) => handleChange(e, 'pembayaran_claim')} 
            max="99999"
            required 
          />
          
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateDataCapexModal;
