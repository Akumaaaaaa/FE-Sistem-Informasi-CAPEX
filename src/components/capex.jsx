import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import UpdateDataCapexModal from './updatecapexmodal';
import './capex.css';
import jsPDF from 'jspdf';
import logo from '../assets/logo.png';
import 'jspdf-autotable';
import 'boxicons/css/boxicons.min.css';

const Capex = () => {
  const [capexData, setCapexData] = useState([]);
  const [selectedCapex, setSelectedCapex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const dashboardContentRef = useRef(null);
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else {
      fetchCapexData(token);
    }
  }, [navigate]);

  const fetchCapexData = async (token) => {
    try {
      const response = await fetch('http://localhost:3000/dataCapex', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
      });
      const data = await response.json();
      setCapexData(data);
    } catch (error) {
      console.error('Error fetching DataCapex:', error);
    }
  };

  const openUpdateModal = (capex) => {
    setSelectedCapex(capex);
    setShowModal(true);
  };

  const closeUpdateModal = () => {
    setSelectedCapex(null);
    setShowModal(false);
  };

  const updateCapexData = (updatedCapex) => {
    const updatedData = capexData.map((item) => {
      if (item._id === updatedCapex._id) {
        return updatedCapex;
      }
      return item;
    });
    setCapexData(updatedData);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const logoImg = new Image();
    logoImg.src = logo;
    logoImg.onload = () => {
      const imgWidth = 50; 
      const imgHeight = 30; 
      const marginLeft = (doc.internal.pageSize.getWidth() - imgWidth) / 2;
      doc.addImage(logoImg, 'PNG', marginLeft, 10, imgWidth, imgHeight);
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text('Generated on: ' + new Date().toLocaleDateString(), 105, 50, { align: 'center' });
      doc.setFontSize(10);
      doc.setTextColor(255, 0, 0);
      doc.text('Confidential - For Internal Use Only', 105, 65, { align: 'center' });
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text('This report contains sensitive financial data related to CAPEX.', 105, 90, { align: 'center' });
      doc.text('Please handle it with care and do not share it with unauthorized personnel.', 105, 95, { align: 'center' });
      doc.autoTable({
        head: [['Field Name', 'Submission Value', 'Approved BP', 'IM Amount', 'PR Amount', 'PO Amount', 'VOWD Incomplete', 'VOWD Complete']],
        body: capexData.map(item => [
          item.nama_bidang,
          item.nilai_pengajuan.toLocaleString(),
          item.approved_bp.toLocaleString(),
          item.im_amount.toLocaleString(),
          item.pr_amount.toLocaleString(),
          item.po_amount.toLocaleString(),
          item.vowd_incomplete.toLocaleString(),
          item.vowd_complete.toLocaleString()
        ]),
        startY: 120,
        styles: {
          fontSize: 10,
          cellPadding: 3,
          halign: 'center',
          valign: 'middle',
          overflow: 'linebreak',
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
        },
        bodyStyles: {
          fillColor: [245, 245, 245],
        },
        alternateRowStyles: {
          fillColor: [255, 255, 255],
        },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 'auto' },
          3: { cellWidth: 'auto' },
          4: { cellWidth: 'auto' },
          5: { cellWidth: 'auto' },
          6: { cellWidth: 'auto' },
          7: { cellWidth: 'auto' },
        },
      });
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
      }
      doc.save('Capex_Data_Confidential.pdf');
    };
  };

  return (
    <div className="dashboard">
      <div className="background-blur"></div>
      <Sidebar />
      <div className="dashboard-content" ref={dashboardContentRef}>
        <div className="header">
          <h2>CAPEX Data</h2>
          <button className="export-button" onClick={exportToPDF}>
            <i className='bx bx-download'></i>
            Export to PDF
          </button>
        </div>
        <div className="capex-table table-container">
          <table>
            <thead>
              <tr>
                <th className="nama-bidang-column">Field Name</th>
                <th>Submission Value</th>
                <th>Approved BP</th>
                <th>IM Amount</th>
                <th>PR Amount</th>
                <th>PO Amount</th>
                <th>VOWD Incomplete</th>
                <th>VOWD Complete</th>
                {userRole === 'admin' && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {capexData.map((item, index) => (
                <tr key={index}>
                <td className="nama-bidang-column">{item.nama_bidang}</td>
                <td>{item.nilai_pengajuan.toLocaleString()}</td>
                <td>{item.approved_bp.toLocaleString()}</td>
                <td>{item.im_amount.toLocaleString()}</td>
                <td>{item.pr_amount.toLocaleString()}</td>
                <td>{item.po_amount.toLocaleString()}</td>
                <td>{item.vowd_incomplete.toLocaleString()}</td>
                <td>{item.vowd_complete.toLocaleString()}</td>
                {userRole === 'admin' && (
                  <td>
                    <button className="update-button" onClick={() => openUpdateModal(item)}>Edit</button>
                  </td>
                )}
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <UpdateDataCapexModal 
        show={showModal} 
        onClose={closeUpdateModal} 
        capex={selectedCapex} 
        onUpdate={updateCapexData}
      />
    </div>
  );
};

export default Capex;
