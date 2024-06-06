import React, { useState, useEffect } from 'react';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { Modal, Button, Form, Input, Select, Alert, Space } from 'antd';
import { MdAdd } from 'react-icons/md';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { serviceUser } from '../services/http-client.service';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

const Tableau = () => {
  const [data, setData] = useState({
    users: [],
    currentPage: 1,
    limit: 10,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: 'Utilisateur',
  });
  const [alertVisible, setAlertVisible] = useState(false);
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState({});
  const [form] = Form.useForm();


  const navigate = useNavigate();
  const location = useLocation();
  const refirectPath = serviceUser.verifyConnectUser(location.pathname);
  if (!refirectPath.state) { navigate(refirectPath.path); }


  useEffect(() => {
    fetchData(1, data.limit);
  }, [searchTerm]);

  const fetchData = async (page, limit = data.limit) => {
    try {
      const jsonData = await serviceUser.selectAll({
        search: searchTerm,
        page: page,
        size: limit,
      });
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setNewUser({
      nom: '',
      prenom: '',
      email: '',
      password: '',
      role: 'Utilisateur',
    });
    form.resetFields();
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
    form.setFieldsValue(user);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setShowModal(true);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    if (editingUser) {
      await updateUser({ ...values, _id: editingUser._id });
    } else {
      await createUser(values);
    }
    closeModal();
  };

  const createUser = async (values) => {
    try {
      await serviceUser.insert(values);
      setAlertVisible(true);
      fetchData();
      setTimeout(() => setAlertVisible(false), 3000);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const updateUser = async (values) => {
    try {
      await serviceUser.update(values);
      setAlertVisible(true);
      fetchData();
      setTimeout(() => setAlertVisible(false), 3000);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
  };

  const confirmDelete = async () => {
    try {
      await serviceUser.delete(userToDelete._id);
      setDeleteAlertVisible(true);
      setUserToDelete(null);
      fetchData();
      setTimeout(() => setDeleteAlertVisible(false), 3000);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const filteredData = data?.users?.filter((row) => {
    if (filterPeriod === 'lastWeek') {
      const lastWeekDate = new Date();
      lastWeekDate.setDate(lastWeekDate.getDate() - 7);
      return new Date(row.date) >= lastWeekDate;
    }
    if (filterPeriod === 'previousMonth') {
      const lastMonthDate = new Date();
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
      return new Date(row.date) >= lastMonthDate;
    }
    if (filterPeriod === 'lastYear') {
      const lastYearDate = new Date();
      lastYearDate.setFullYear(lastYearDate.getFullYear() - 1);
      return new Date(row.date) >= lastYearDate;
    }
    return true;
  });

  const togglePasswordVisibility = (userId) => {
    setPasswordVisible((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageClick = (e) => {
    const selectedPage = e.selected + 1;
    fetchData(selectedPage);
  };

  return (
    <div>
      <h2>Liste des utilisateurs</h2>
      {alertVisible && (
        <Alert
          message="Utilisateur ajouté ou modifié avec succès."
          type="success"
          showIcon
        />
      )}
      {deleteAlertVisible && (
        <Alert
          message="Utilisateur supprimé avec succès."
          type="success"
          showIcon
        />
      )}
      {userToDelete && (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            message={`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userToDelete.nom}" ?`}
            type="info"
            showIcon
            closable
            onClose={() => setUserToDelete(null)}
          />
          <div style={{ marginTop: '16px' }}>
            <Button
              size="small"
              style={{ marginRight: '8px' }}
              onClick={() => setUserToDelete(null)}
            >
              Annuler
            </Button>
            <Button size="small" danger onClick={confirmDelete}>
              Supprimer
            </Button>
          </div>
        </Space>
      )}
      <div>
        <Modal
          title={editingUser ? "Modifier un utilisateur" : "Ajouter un utilisateur"}
          visible={showModal}
          onCancel={closeModal}
          footer={null}
        >
          <Form
            form={form}
            onFinish={handleSubmit}
            initialValues={newUser}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            style={{ maxWidth: '600px', margin: '0 auto' }}
          >
            <Form.Item
              label="Nom"
              name="nom"
              rules={[{ required: true, message: 'Ce champ est requis' }]}
            >
              <Input placeholder="Entrez le nom" />
            </Form.Item>
            <Form.Item
              label="Prénom"
              name="prenom"
              rules={[{ required: true, message: 'Ce champ est requis' }]}
            >
              <Input placeholder="Entrez le prénom" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Ce champ est requis' }]}
            >
              <Input placeholder="Entrez l'email" />
            </Form.Item>
            <Form.Item
              label="Mot de passe"
              name="password"
              rules={[{ required: true, message: 'Ce champ est requis' }]}
            >
              <Input.Password
                placeholder="Entrez le mot de passe"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            <Form.Item
              label="Rôle"
              name="role"
              rules={[{ required: true, message: 'Ce champ est requis' }]}
            >
              <Select placeholder="Sélectionnez un rôle" defaultValue="Utilisateur">
                <Select.Option value="Admin">Admin</Select.Option>
                <Select.Option value="Utilisateur">Utilisateur</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24, style: { textAlign: 'right' } }}>
              <Button onClick={closeModal} style={{ marginRight: 8 }}>
                Annuler
              </Button>
              <Button type="primary" htmlType="submit" style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}>
                Valider
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <div className="flex justify-between search-bar">
          <button onClick={handleAdd} className="add-button">
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
      </div>
      <table className="mb-10">
        <thead>
          <tr className="bg-gray-200">
            <th className="etable">Nom</th>
            <th className="etable">Prénom</th>
            <th className="etable">Email</th>
            <th className="etable">Mot de passe</th>
            <th className="etable">Role</th>
            <th className="etable">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row) => (
            <tr key={row._id} className="text-center">
              <td className="border px-4 py-2">{row.nom}</td>
              <td className="border px-4 py-2">{row.prenom}</td>
              <td className="border px-4 py-2">{row.email}</td>
              <td className="border px-4 py-2">
                {passwordVisible[row._id] ? (
                  <span>{row.password}</span>
                ) : (
                  <Input.Password
                    value={row.password}
                    readOnly
                    iconRender={(visible) =>
                      visible ? (
                        <EyeTwoTone
                          onClick={() => togglePasswordVisibility(row._id)}
                        />
                      ) : (
                        <EyeInvisibleOutlined
                          onClick={() => togglePasswordVisibility(row._id)}
                        />
                      )
                    }
                  />
                )}
              </td>
              <td className="border px-4 py-2">{row.role}</td>
              <td className="border px-4 py-2">
                <button onClick={() => handleEdit(row)} className="edit">
                  <AiOutlineEdit />
                </button>
                <button onClick={() => handleDelete(row)} className="delete">
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