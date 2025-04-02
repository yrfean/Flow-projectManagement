import axios from "axios";
const backendUri = import.meta.env.VITE_BACKEND_PORT;

const getUser = async () => {
  const token = localStorage.getItem("token");
  // console.log(token);

  try {
    const response = await axios.get(`${backendUri}/getUser`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};
const getAllProjects = async () => {
  try {
    const response = await axios.get(`${backendUri}/getAllProjects`);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};
const getAllTasks = async () => {
  try {
    const response = await axios.get(`${backendUri}/getAlltasks`);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};
const getUsers = async () => {
  try {
    const response = await axios.get(`${backendUri}/getUsers`);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllDatas = async () => {
  try {
    const [user, allProjects, allTasks, allUsers] = await Promise.all([
      getUser(),
      getAllProjects(),
      getAllTasks(),
      getUsers(),
    ]);
    return { user, allProjects, allTasks, allUsers };
  } catch (error) {
    console.log(error);
    throw new Error("error in getAllTasks fn");
  }
};
