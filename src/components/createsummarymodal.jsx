import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './createsummarymodal.css';

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

const CreateSummaryModal = ({ show, onClose, onCreate }) => {
  const [namaProses, setNamaProses] = useState('');
  const [jumlahPertama, setJumlahPertama] = useState('');
  const [jumlahKedua, setJumlahKedua] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [existingSummaries, setExistingSummaries] = useState([]);

  useEffect(() => {
    if (show) {
      fetchSummaries();
    }
  }, [show]);

  const fetchSummaries = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/summary', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
      });
      const summaries = await response.json();
      setExistingSummaries(summaries);
    } catch (error) {
      console.error('Error fetching Performances:', error);
    }
  };

  const handleCreate = async () => {
    const token = localStorage.getItem('token');
    const isDuplicate = existingSummaries.some(summary => summary.nama_proses === namaProses);

    if (isDuplicate) {
      Toast.fire({
        icon: 'error',
        title: 'A Performance with this title already exists.'
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
        body: JSON.stringify({
          nama_proses: namaProses,
          jumlah_pertama: jumlahPertama,
          jumlah_kedua: jumlahKedua,
          keterangan: keterangan,
        }),
      });
      const newSummary = await response.json();
      if (response.ok) {
        onCreate(newSummary);
        onClose();
        Toast.fire({
          icon: 'success',
          title: 'Performance created successfully!'
        });
      } else {
        Toast.fire({
          icon: 'error',
          title: 'Error creating Performance!'
        });
      }
    } catch (error) {
      console.error('Error creating performance record:', error);
      Toast.fire({
        icon: 'error',
        title: 'Error creating Performance!'
      });
    }
  };

  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Create New Performance</h2>
        <form>
          <label>Process Name</label>
          <input
            type="text"
            value={namaProses}
            onChange={(e) => setNamaProses(e.target.value)}
          />
          <label>First Amount</label>
          <input
            type="number"
            value={jumlahPertama}
            onChange={(e) => setJumlahPertama(e.target.value)}
          />
          <label>Second Amount</label>
          <input
            type="number"
            value={jumlahKedua}
            onChange={(e) => setJumlahKedua(e.target.value)}
          />
          <label>Description</label>
          <input
            type="text"
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
          />
          <button type="button" className='create-button' onClick={handleCreate}>Create</button>
        </form>
      </div>
    </div>
  );
};

export default CreateSummaryModal;