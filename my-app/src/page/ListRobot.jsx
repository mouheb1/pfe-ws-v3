import React, {
  useEffect,
  useState,
} from 'react';

import {
  Alert,
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
} from 'antd';
import {
  AiOutlineDelete,
  AiOutlineEdit,
} from 'react-icons/ai';
import { MdAdd } from 'react-icons/md';
import ReactPaginate from 'react-paginate';
import {
  useLocation,
  useNavigate,
} from 'react-router-dom';

import image from '../page/roboticone.png';
import {
  serviceRobot,
  serviceUser,
} from '../services/http-client.service';

const Tableau = () => {
  const [data, setData] = useState({
    robots: [],
    currentPage: 1,
    limit: 10,
    totalPages: 0,
  });
  const [usersData, setUsers] = useState({
    users: [],
    currentPage: 0,
    limit: 10,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [robotToDelete, setRobotToDelete] = useState(null);
  const [editingRobot, setEditingRobot] = useState(null);
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = serviceUser.verifyConnectUser(location.pathname);
  if (!redirectPath.state) {
    navigate(redirectPath.path);
  }

  useEffect(() => {
    fetchData(1, data.limit);
    fetchDataUser();
  }, [searchTerm]);

  const fetchData = async (page, limit = data.limit) => {
    try {
      const jsonData = await serviceRobot.selectAll({
        search: searchTerm,
        page: page,
        size: limit,
      });
      setData({
        ...jsonData,
        currentPage: page,
        limit: limit,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setAlertVisible(true);
    }
  };

  const fetchDataUser = async () => {
    try {
      const jsonData = await serviceUser.selectAll();
      setUsers(jsonData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingRobot(null);
    form.resetFields();
  };

  const handlePageClick = (e) => {
    const selectedPage = e.selected + 1;
    fetchData(selectedPage);
  };

  const handleSubmit = async (values) => {
    if (editingRobot) {
      await updateRobot({ ...values, _id: editingRobot._id });
    } else {
      await createRobot(values);
    }
  };

  const handleEdit = (id) => {
    const robotToEdit = data.robots.find((row) => row._id === id);
    if (robotToEdit) {
      setEditingRobot(robotToEdit);
      form.setFieldsValue(robotToEdit);
      setShowModal(true);
    }
  };

  const handleAddClick = () => {
    setEditingRobot(null);
    form.resetFields();
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setRobotToDelete(data.robots?.find((row) => row._id === id));
  };

  const createRobot = async (values) => {
    try {
      const response = await serviceRobot.insert(values);
      if (response.ok) {
        fetchData(data.currentPage);
        handleModalClose();
      } else {
        throw new Error('Add request failed');
      }
    } catch (error) {
      console.error('Error adding robot:', error);
      setAlertVisible(true);
    }
  };

  const updateRobot = async (values) => {
    try {
      const response = await serviceRobot.update(values);
      if (response.ok) {
        fetchData(data.currentPage);
        handleModalClose();
      } else {
        throw new Error('Failed to update robot');
      }
    } catch (error) {
      console.error('Error updating robot:', error);
      setAlertVisible(true);
    }
  };

  const confirmDelete = async () => {
    try {
      await serviceRobot.delete(robotToDelete._id);
      setRobotToDelete(null);
      fetchData(data.currentPage);
    } catch (error) {
      console.error('Error deleting robot:', error);
      setAlertVisible(true);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlelimitChange = (newlimit) => {
    setData((prevData) => ({
      ...prevData,
      limit: Number(newlimit),
    }));
    fetchData(1, Number(newlimit));  // Reset to first page when page size changes
  };

  return (
    <div>
      <h2>Liste des robots</h2>
      {alertVisible && (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert message="Error" type="error" showIcon />
          <Alert message="Error" description="Erreur de récupération des données." type="error" showIcon />
        </Space>
      )}
      {robotToDelete && (
        <>
          <Alert
            message="Êtes-vous sûr de vouloir supprimer le robot ?"
            description={`"${robotToDelete.reference}" ?`}
            type="info"
            showIcon
            closable
            onClose={() => setRobotToDelete(null)}
          />
          <div style={{ marginTop: '16px' }}>
            <Button size="small" style={{ marginRight: '8px' }} onClick={() => setRobotToDelete(null)}>Annuler</Button>
            <Button size="small" danger onClick={confirmDelete}>Supprimer</Button>
          </div>
        </>
      )}

      <Modal
        title={editingRobot ? "Modifier un robot" : "Ajouter un robot"}
        visible={showModal}
        onCancel={handleModalClose}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          initialValues={editingRobot}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ maxWidth: '600px', margin: '0 auto' }}
        >
          <Form.Item
            label="Référence"
            name="reference"
            rules={[{ required: true, message: 'Ce champ est requis' }]}
          >
            <Input placeholder="Entrez la référence" />
          </Form.Item>
          <Form.Item
            label="Utilisateur"
            name="userId"
            rules={[{ required: true, message: 'Ce champ est requis' }]}
          >
            <Select placeholder="Sélectionnez un utilisateur">
              {usersData
                .users?.filter(user => user.role !== 'Admin')
                .map(user => (
                  <Select.Option key={user._id} value={user._id}>
                    {user.nom} {user.prenom} ({user.email})
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="IP Robot"
            name="ip_robot"
            rules={[{ required: true, message: 'Ce champ est requis' }]}
          >
            <Input placeholder="Entrez l'IP du robot" />
          </Form.Item>
          <Form.Item
            label="Nombre pièces"
            name="totalPieces"
            rules={[{ required: true, message: 'Ce champ est requis' }]}
          >
            <Input placeholder="Entrez le nombre de pièces" />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 24, style: { textAlign: 'right' } }}>
            <Button onClick={handleModalClose} style={{ marginRight: 8 }}>
              Annuler
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}
            >
              Valider
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <div className="flex justify-between search-bar">
        <button onClick={handleAddClick} className="add-button">
          <MdAdd className="ajouter" />
          Ajouter
        </button>
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <table className="mb-10">
        <thead>
          <tr className="bg-gray-200">
            <th className="etable">Image</th>
            <th className="etable">Référence de Robot</th>
            <th className="etable">IP Robot</th>
            <th className="etable">Nombres des pièces</th>
            <th className="etable">Utilisateur</th>
            <th className="etable">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.robots?.map((row) => (
            <tr key={row._id} className="text-center">
              <td className="border px-4 py-2">
                <img src={image} alt="robot" style={{ width: '40px', height: '40px', margin: 'auto' }} />
              </td>
              <td className="border px-4 py-2">{row.reference}</td>
              <td className="border px-4 py-2">{row.ip_robot}</td>
              <td className="border px-4 py-2">{row.totalPieces}</td>
              <td className="border px-4 py-2">{row.user ? `${row.user.nom} ${row.user.prenom}` : "vide"}</td>
              <td className="border px-4 py-2">
                <button onClick={() => handleEdit(row._id)} className="edit">
                  <AiOutlineEdit />
                </button>
                <button onClick={() => handleDelete(row._id)} className="delete">
                  <AiOutlineDelete />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={data?.totalPages || 0}
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

export default Tableau;
