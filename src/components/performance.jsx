import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import './performance.css';
import { FaEdit } from 'react-icons/fa';
import UpdateSummaryModal from './updatesummarymodal';
import DeleteSummaryModal from './deletesummarymodal';
import CreateSummaryModal from './createsummarymodal';

const Performance = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [pekanData, setPekanData] = useState({ tanggal_pertama: '', tanggal_kedua: '' });
  const [isEditing, setIsEditing] = useState({ tanggal_pertama: false, tanggal_kedua: false });
  const [newPekanData, setNewPekanData] = useState({ tanggal_pertama: '', tanggal_kedua: '' });
  const [userRole, setUserRole] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSummaryForDelete, setSelectedSummaryForDelete] = useState(null);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const itemsPerPage = 5;

  const dashboardContentRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token) {
      navigate('/');
    } else {
      setUserRole(role);
      fetchSummaryData(token);
      fetchPekanData(token);
    }
  }, [navigate]);

  useEffect(() => {
    if (dashboardContentRef.current) {
      dashboardContentRef.current.scrollTo(0, 0);
    }
  }, [currentPage]);

  const fetchSummaryData = async (token) => {
    try {
      const response = await fetch('http://localhost:3000/summary', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
      });
      const data = await response.json();
      setSummaryData(data);
    } catch (error) {
      console.error('Error fetching summary data:', error);
    }
  };

  const fetchPekanData = async (token) => {
    try {
      const response = await fetch('http://localhost:3000/pekan', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
      });
      const [data] = await response.json();
      data.tanggal_pertama = formatDate(data.tanggal_pertama);
      data.tanggal_kedua = formatDate(data.tanggal_kedua);
      setPekanData(data);
      setNewPekanData(data);
    } catch (error) {
      console.error('Error fetching pekan data:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleEditClick = (field) => {
    setIsEditing({ ...isEditing, [field]: true });
  };

  const handleDeleteClick = (summary) => {
    setSelectedSummaryForDelete(summary);
    setShowDeleteModal(true);
  };

  const handleInputChange = (e, field) => {
    setNewPekanData({ ...newPekanData, [field]: e.target.value });
  };

  const handleSaveClick = async (field) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:3000/pekan/${pekanData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
        body: JSON.stringify({ [field]: newPekanData[field] }),
      });
      setPekanData({ ...pekanData, [field]: newPekanData[field] });
      setIsEditing({ ...isEditing, [field]: false });
    } catch (error) {
      console.error('Error updating pekan data:', error);
    }
  };

  const handleOpenModal = (summary) => {
    setSelectedSummary(summary);
    setShowUpdateModal(true);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const startIndex = currentPage * itemsPerPage;
  const displayedSummaryData = summaryData.slice(startIndex, startIndex + itemsPerPage);

  const handleCreatePerformanceClick = () => {
    setShowCreateModal(true); 
  };

  return (
    <div className="dashboard">
      <div className="background-blur"></div>
      <Sidebar />
      <div className="dashboard-content" ref={dashboardContentRef}>
        <div className="header">
          <h2>Job Performance</h2>
          {userRole === 'admin' && (
            <button className="create-performance-button" onClick={handleCreatePerformanceClick}>
              Create Performance
            </button>
          )}
        </div>
        <div className="performance-table table-container">
          <table>
            <thead>
              <tr>
                <th className="nama-proses-column">Process Name</th>
                <th className="tanggal-column">
                  {isEditing.tanggal_pertama ? (
                    <>
                      <input
                        type="text"
                        value={newPekanData.tanggal_pertama}
                        onChange={(e) => handleInputChange(e, 'tanggal_pertama')}
                        size="10"
                      />
                      <button onClick={() => handleSaveClick('tanggal_pertama')}>Save</button>
                    </>
                  ) : (
                    <>
                      {pekanData.tanggal_pertama}
                      {userRole === 'admin' && (
                        <FaEdit onClick={() => handleEditClick('tanggal_pertama')} className="edit-icon" />
                      )}
                    </>
                  )}
                </th>
                <th className="tanggal-column">
                  {isEditing.tanggal_kedua ? (
                    <>
                      <input
                        type="text"
                        value={newPekanData.tanggal_kedua}
                        onChange={(e) => handleInputChange(e, 'tanggal_kedua')}
                        size="10"
                      />
                      <button onClick={() => handleSaveClick('tanggal_kedua')}>Save</button>
                    </>
                  ) : (
                    <>
                      {pekanData.tanggal_kedua}
                      {userRole === 'admin' && (
                        <FaEdit onClick={() => handleEditClick('tanggal_kedua')} className="edit-icon" />
                      )}
                    </>
                  )}
                </th>
                <th className="keterangan-column">Description</th>
                {userRole === 'admin' && <th className="action-column">Action</th>}
              </tr>
            </thead>
            <tbody>
              {displayedSummaryData.map((item, index) => (
                <tr key={index}>
                  <td className="nama-proses-column">{item.nama_proses}</td>
                  <td>{item.jumlah_pertama}</td>
                  <td>{item.jumlah_kedua}</td>
                  <td className="keterangan-column">{item.keterangan}</td>
                  {userRole === 'admin' && (
                    <td className="action-column">
                      <div className="action-buttons">
                        <button onClick={() => handleOpenModal(item)}>Edit</button>
                        <button className="delete-button" onClick={() => handleDeleteClick(item)}>Delete</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination-buttons">
          <button onClick={handlePrevPage} disabled={currentPage === 0}>
            Previous
          </button>
          <button onClick={handleNextPage} disabled={startIndex + itemsPerPage >= summaryData.length}>
            Next
          </button>
        </div>
      </div>
      <UpdateSummaryModal
        show={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onUpdate={(updatedSummary) => {
          setSummaryData(summaryData.map(summary => summary._id === updatedSummary._id ? updatedSummary : summary));
        }}
        summary={selectedSummary}
      />
      <DeleteSummaryModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={(deletedSummaryId) => {
          setSummaryData(summaryData.filter(summary => summary._id !== deletedSummaryId));
        }}
        summary={selectedSummaryForDelete}
      />
      <CreateSummaryModal 
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={(newSummary) => {
          setSummaryData([newSummary, ...summaryData]);
        }}
      />
    </div>
  );
};

export default Performance;
