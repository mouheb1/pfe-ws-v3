import React, { useEffect, useState } from 'react';
import Card from '../Dashboard/Card';
import '../Dashboard/Card.css';
import '../Dashboard/Dash.css';
import '../Dashboard/Historigram';
import RobotSlot from '../Dashboard/RobotSlot';
import "./RobotSlot.css";
import Historigram from '../Dashboard/Historigram';
import { Alert, Button, Space } from 'antd';
import { state } from '../../states/global.state';
import { serviceGlobal, serviceUser } from '../../services/http-client.service';
import { useLocation, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [mssageResponse, setMssageResponse] = useState(null);
  const [data, setData] = useState({
    countRobots: 0,
    robotsReference: [],
    robotInfo: [],
    totalNombrePieces: 0,
    totalNombrePiecesPalatizes: 0,
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const refirectPath = serviceUser.verifyConnectUser(location.pathname);
    if (!refirectPath.state) {
      navigate(refirectPath.path);
      return;
    }

    const fetchData = async () => {
      try {
        const jsonData = await serviceGlobal.select();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const handleMessage = async (dataSTR) => {
      try {
        await fetchData();
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };

    fetchData();
    state.wsClient.addMessageListener(handleMessage);

    return () => {
      state.wsClient.removeMessageListener(handleMessage);
    };
  }, [location.pathname, navigate]);

  return (
    <div>
      <h2>Dashboard</h2>

      {mssageResponse && (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            message="Message"
            description={`"${mssageResponse.description}"`}
            type="info"
            showIcon
            closable
            onClose={() => setMssageResponse(null)}
          />
          <div style={{ marginTop: '16px' }}>
            <Button size="small" style={{ marginRight: '8px' }} onClick={() => setMssageResponse(null)}>
              ok
            </Button>
          </div>
        </Space>
      )}

      <div className="row1">
        <div className="col-md-3" style={{ margin: "1%", width: "230px", height: "210px" }}>
          <Card icon="pieces" title="Pièces prises" value={data?.totalNombrePieces} />
        </div>
        <div className="col-md-3" style={{ margin: "1%", width: "230px", height: "210px" }}>
          <Card icon="facture" title="Pièces palettisées" value={data?.totalNombrePiecesPalatizes} />
        </div>
        <div className="col-md-3" style={{ margin: "1%", width: "230px", height: "210px" }}>
          <Card icon="connected-robots" title="Robots connectés" value={data?.countRobots} />
        </div>
        <div className="col-md-3" style={{ margin: "1%", width: "230px", height: "210px" }}>
          <Card icon="connected-users" title="Utilisateurs connectés" value={data?.countRobots} />
        </div>
      </div>
      <div>
        <Historigram data={data} />
      </div>
      {Array.isArray(data?.robotsReference) && data?.robotsReference.length ? (
        <div className="grid-container">
          {data?.robotsReference.map((reference, index) => (
            <RobotSlot key={index} reference={reference} />
          ))}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Dashboard;
