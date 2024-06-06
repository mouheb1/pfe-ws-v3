import 'react-datepicker/dist/react-datepicker.css';
import './HistoriquePage.css';

import React, {
  useEffect,
  useState,
} from 'react';

import moment from 'moment';
import DatePicker from 'react-datepicker';
import ReactPaginate from 'react-paginate';
import {
  useLocation,
  useNavigate,
} from 'react-router-dom';

import {
  serviceHistory,
  serviceUser,
} from './services/http-client.service';

const HistoriquePage = () => {
  const [historyData, setHistoryData] = useState({
    histories: [],
    totalPages: 0,
    currentPage: 1,
    limit: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState(new Date());

  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = serviceUser.verifyConnectUser(location.pathname);
  if (!redirectPath.state) {
    navigate(redirectPath.path);
  }

  useEffect(() => {
    fetchHistoryData(historyData.currentPage);
  }, [searchTerm, date]);

  const fetchHistoryData = async (page) => {
    try {
      const data = await serviceHistory.selectAll({
        search: searchTerm,
        date,
        page,
        limit: historyData.limit,
      });
      setHistoryData(data);
    } catch (error) {
      console.error("Error fetching history data", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const gotToStats = (item) => {
    navigate(["/Statistiques", item?.robot?.reference].join('/'));
  };

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    fetchHistoryData(selectedPage + 1);
    setHistoryData((prevState) => ({
      ...prevState,
      currentPage: selectedPage + 1,
    }));
  };

  const pageCount = historyData?.totalPages || 0;

  return (
    <div className="history">
      <div className="history-list">
        <h2>Historique</h2>
        <div className="search-bar">
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            selectsStart
            startDate={date}
            endDate={date}
            placeholderText="Date début"
          />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <table className='mb-10'>
          <thead>
            <tr>
              <th>Ref Robot</th>
              <th>Debut d'execution</th>
              <th>Fin d'execution</th>
              <th>Nombre de pièces totales</th>
              <th>Nombre de pièces palettisées</th>
              <th>Utilisateurs</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {historyData?.histories.map((item) => (
              <tr key={item._id}>
                <td className="text-center">
                  {item.robot ? item.robot.reference : "vide"}
                </td>
                <td className="text-center">
                  {moment(item.startExecutionAt).format("YYYY-MM-DD HH:mm:ss")}
                </td>
                <td className="text-center">
                  {moment(item.endExecutionAt).format("YYYY-MM-DD HH:mm:ss")}
                </td>
                <td className="text-center">
                  {item.robot ? item.robot.totalPieces : "vide"}
                </td>
                <td className="text-center">{item.palatizedPieces}</td>
                <td className="px-4 py-2 text-center">
                  {item.user ? `${item.user.nom} ${item.user.prenom}` : "vide"}
                </td>
                <td className="text-center" onClick={() => gotToStats(item)}>
                  <i className="fas fa-eye cursor-pointer"></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        containerClassName="pagination"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="previous-item"
        previousLinkClassName="previous-link"
        nextClassName="next-item"
        nextLinkClassName="next-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        activeClassName="active"
      />
    </div>
  );
};

export default HistoriquePage;
