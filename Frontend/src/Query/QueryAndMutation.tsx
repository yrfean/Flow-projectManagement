import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { formValues } from "../Login/Login";
import { useNavigate } from "react-router-dom";
import { getAllDatas } from "../Components/fetchFunction";

const backendUri = import.meta.env.VITE_BACKEND_PORT;
// console.log(backendUri)
export const useLoginMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (values: formValues) => {
      return await axios.post(`${backendUri}/login`, values);
    },
    onSuccess: ({ data }) => {
      console.log("response:", data);
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("_id", data.data._id);
      navigate("/lead");
    },
    onError: (err) => {
      console.log(err);
    },
  });
};

//To Query get all data
export const useAllData = () => {
  return useQuery({
    queryKey: ["All data"],
    queryFn: getAllDatas,
  });
};

// Create Task
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskDetails: any): Promise<any> => {
      const response = await axios.post(
        `${backendUri}/createTask`,
        taskDetails
      );
      return response.data;
    },
    onSuccess: () => {
      // console.log(data);
      queryClient.invalidateQueries({ queryKey: ["All data"] });
    },
    onError: (error) => {
      console.log("error creating tasks", error);
    },
  });
};

// Update Task
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, details }: { id: any; details: any }) => {
      console.log(details);
      const response = await axios.put(
        `${backendUri}/updateTask/${id}`,
        details
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["All data"] });
    },
    onError: (err: any) => {
      console.log(err);
    },
  });
};

// Delete Task
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: any) => {
      const response = await axios.delete(`${backendUri}/deleteTask/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["All data"] });
    },
    onError: (er: any) => {
      console.log(er);
    },
  });
};
