import React from 'react';
import axios from 'axios';

const ExportPDFButton = ({ data }) => {
  const exportPdf = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/export-pdf`, data, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'charts.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  return <button className='export-button' onClick={exportPdf}>Export PDF</button>;
};

export default ExportPDFButton;
