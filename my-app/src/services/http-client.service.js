const moment = require("moment");
const { state } = require("../states/global.state");

const getGlobal = async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/global`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } catch (error) {
    console.error("Error getGlobal data:", error);
  }
};

// add new API to get stats of a rebot
const getRobotStats = async (query) => {
  if (Object.keys(query).length === 0) {
    console.log("Empty query object passed, not including in request");
    return;
  }

  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_BASE_URL
      }/robot-stats/?${new URLSearchParams(query)}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } catch (error) {
    console.error("Error getGlobal data:", error);
    return null;
  }
};

const getAllHistory = async ({ search, date, page = 1, limit = 10 } = {}) => {
  try {
    let getHistoryUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/history?page=${page}&limit=${limit}`;

    if (search) {
      getHistoryUrl = [getHistoryUrl, `search=${search}`].join("&");
    }

    if (date) {
      getHistoryUrl = [getHistoryUrl, `date=${moment(date).format('YYYY-MM-DD')}`].join("&");
    }

    const response = await fetch(getHistoryUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } catch (error) {
    console.error("Error getHistory data:", error);
  }
};

const getAllRobot = async ({ search, page = 1, limit = 10 } = {}) => {
  try {
    let getRobotUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/robots?page=${page}&limit=${limit}`;
    if (search) {
      getRobotUrl = [getRobotUrl, `search=${search}`].join("&");
    }
    const response = await fetch(getRobotUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error getAllRobot data:", error);
  }
};
const createRobot = async (obj) => {
  try {
    return await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/robots`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reference: obj.reference,
        userId: obj.userId, // Utiliser la clé "user" attendue par le backend
        ip_robot: obj.ip_robot,
        totalPieces: obj.totalPieces,
      }),
    });
  } catch (error) {
    console.error("Error adding robot:", error);
  }
};

const updateRobot = async (obj) => {
  try {
    return await fetch(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/robots/${obj._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      }
    );
  } catch (error) {
    console.error("Error update robot:", error);
  }
};

const deleteRobot = async (id) => {
  try {
    return await fetch(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/robots/${id}`,
      {
        method: "DELETE",
      }
    );
  } catch (error) {
    console.error("Error delete robot:", error);
  }
};

const getAllUsers = async ({ search, page = 1, limit: limit = 10 } = ({} = {})) => {
  try {
    let getUsersUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/users?page=${page}&limit=${limit}`;
    if (search) {
      getUsersUrl = [getUsersUrl, `search=${search}`].join("&");
    }
    const response = await fetch(getUsersUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error get All  users:", error);
  }
};
const createUser = async (obj) => {
  try {
    return await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

const updateUser = async (obj) => {
  try {
    return await fetch(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/users/${obj._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      }
    );
  } catch (error) {
    console.error("Error update user:", error);
  }
};

const deleteUser = async (id) => {
  try {
    return fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/users/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error delete user:", error);
  }
};
const signIn = async (obj) => {
  try {
    return await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: obj.email, password: obj.password }),
    });
  } catch (error) {
    console.error("Error sign user:", error);
  }
};
const signUp = async (obj) => {
  try {
    return await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
  } catch (error) {
    console.error("Error sign Up user:", error);
  }
};
const saveUser = function (user) {
  localStorage.clear("user");
  localStorage.setItem("user", JSON.stringify(user));
};
const clearUser = function () {
  localStorage.clear("user");
};
const getUser = function () {
  const userStr = localStorage.getItem("user");
  if (userStr == null || userStr == undefined) {
    return null;
  }
  return JSON.parse(userStr);
};

const verifyConnectUser = function (pathName) {
  const user = getUser();
  const auth = { state: false, path: state.path.logIn };
  if (user == null || user == undefined) {
    return auth;
  }
  const index = state.path.list.findIndex(
    (item) =>
      item.role === user.role && (pathName ? item.authPath === pathName : true)
  );
  if (index == -1) {
    return auth;
  }
  auth.state = true;
  auth.path = state.path.list[index].authPath;
  return auth;
};

module.exports = {
  serviceGlobal: { select: getGlobal, getRobotStats },
  serviceHistory: { selectAll: getAllHistory },
  serviceRobot: {
    selectAll: getAllRobot,
    insert: createRobot,
    update: updateRobot,
    delete: deleteRobot,
  },
  serviceUser: {
    selectAll: getAllUsers,
    insert: createUser,
    update: updateUser,
    delete: deleteUser,
    signIn: signIn,
    signUp: signUp,
    save: saveUser,
    clear: clearUser,
    get: getUser,
    verifyConnectUser: verifyConnectUser,
  },
};
