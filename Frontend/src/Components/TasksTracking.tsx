import { Ellipsis } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useAllData,
  useCreateTask,
  useDeleteTask,
  useUpdateTask,
} from "../Query/QueryAndMutation";
import Priority from "./Priority";

const TasksTracking = ({
  tasks,
  changeTasks,
  user,
}: {
  tasks: any;
  changeTasks: any;
  user: any;
}) => {
  const parts = ["to-do", "in-progress", "completed"];
  const { data } = useAllData();
  const [newTaskPopup, setNewTaskPopup] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [eclipsePopup, setEclipsePopup] = useState(false);
  const [eclipseId, setEclipseTaskid] = useState();
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState("");
  const [editedTaskDueDate, setEditedTaskDueDate] = useState("");
  const [editedTaskPriority, setEditedTaskPriority] = useState("medium");
  const [draggedTask, setDraggedTask] = useState<any>();
  const [lead, setLead] = useState(false);

  // check if user is lear or memmber
  useEffect(() => {
    const lead = project?.teamLead === data?.user._id;
    if (lead) {
      setLead(true);
      console.log("oh its lead");
    }
  });

  // Mutaions
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  // find project
  const project = data?.allProjects?.find(
    (project: any) =>
      project.members.includes(user?._id) || project.teamLead === user?._id
  );

  const taskCreatingDetails = {
    title: taskTitle,
    project: project?._id,
    priority: taskPriority,
    dueDate: taskDueDate,
    assignedTo: user?._id,
    assignedBy: data?.user._id,
  };
  const taskUpdatingDetails = {
    title: editedTaskTitle,
    project: project?._id,
    priority: editedTaskPriority,
    dueDate: editedTaskDueDate,
  };

  const createTask = () => {
    if (!taskTitle || !taskDueDate) {
      return;
    }
    createTaskMutation.mutate(taskCreatingDetails);
    setTaskTitle("");
    changeTasks(taskCreatingDetails.assignedTo);
  };

  const updateTask = ({
    id,
    taskUpdatingDetails,
  }: {
    id: any;
    taskUpdatingDetails: any;
  }) => {
    // console.log(id);
    updateTaskMutation.mutate({ id, details: taskUpdatingDetails });
    setEditingTaskId(null);
  };

  const deleteTask = (id: any) => {
    deleteTaskMutation.mutate(id);
  };

  const updateStatus = ({ id, status }: { id: any; status: any }) => {
    updateTaskMutation.mutate({ id, details: { status: status } });
    setDraggedTask("");
  };

  useEffect(() => {
    changeTasks(taskCreatingDetails?.assignedTo);
  }, [data]);
  useEffect(() => {
    changeTasks(data?.user._id);
  }, []);
  return (
    <>
      <div className="w-full ">
        <Priority />
      </div>
      <div className="flex h-full w-full bg-blac overflow-hidde">
        {parts.map((status, index) => {
          const filteredtasks = tasks.filter(
            (task: any) => task.status === status
          );

          return (
            <div
              className="max-h-fit pb-1 min-h-fit w-[33%] rounded bg-gray-300 mx-1 shadow-lg"
              key={index}
              onDrop={() => updateStatus({ id: draggedTask._id, status })}
              onDragOver={(e) => e.preventDefault()}
            >
              <p className="text-center text-gray-500 font-bold rounded mx-2 my-1 py-1">
                {status} ({filteredtasks.length})
              </p>

              {/* Task list container */}
              <div>
                {filteredtasks.map((task: any, key: any) => (
                  <div
                    draggable
                    onDragStart={() => setDraggedTask(task)}
                    key={key}
                    className={`m-2 transition-all duration-300 cursor-grab relative rounded bg-gray-100 flex shadow items-center justify-between px-5 py-3 ${
                      task.priority === "low"
                        ? `bg-yellow-100`
                        : task.priority === "high"
                        ? `bg-red-400`
                        : task.priority === "urgent"
                        ? `bg-violet-500`
                        : ``
                    }`}
                  >
                    {editingTaskId === task._id ? (
                      // Editingggggggggg
                      <div className="flex flex-col gap-1 w-full">
                        <input
                          type="text"
                          className="w-full rounded bg-gray-200 px-2 py-1 outline-none"
                          value={editedTaskTitle}
                          onChange={(e) => setEditedTaskTitle(e.target.value)}
                        />
                        <input
                          type="date"
                          className="w-full p-2 rounded bg-gray-200"
                          value={editedTaskDueDate}
                          onChange={(e) => setEditedTaskDueDate(e.target.value)}
                        />
                        <select
                          className="w-full p-2 rounded bg-gray-200"
                          value={editedTaskPriority}
                          onChange={(e) =>
                            setEditedTaskPriority(e.target.value)
                          }
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                        <button
                          className="bg-violet-500 text-white px-3 py-1 rounded mt-2"
                          onClick={() =>
                            updateTask({ id: task._id, taskUpdatingDetails })
                          }
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      // actual TAsks
                      <>
                        <div>
                          <h1 className="w-[200px] font-semibold text-gray-600 truncate">
                            {task.title}
                          </h1>
                          <p className="text-sm text-gray-500">
                            🗓 Due:{" "}
                            {task.dueDate
                              ? new Date(task.dueDate).toLocaleDateString()
                              : "No Due Date"}
                          </p>
                        </div>

                        <div className=" flex items-center gap-2">
                          {lead && (
                            <Ellipsis
                              className="text-gray-600 cursor-pointer"
                              onClick={() => {
                                setEclipsePopup(!eclipsePopup);
                                setEclipseTaskid(task._id);
                              }}
                            />
                          )}
                          <img
                            src={user?.dp}
                            className="w-6 h-6 object-cover cursor-pointer rounded-full"
                          />
                        </div>
                        {/* Eclipse popup */}
                        {eclipseId === task._id
                          ? eclipsePopup && (
                              <div className="absolute z-10 bg-gray-200 py-1 right-16 rounded-l-lg rounded-br-lg top-9 w-[100px] flex flex-col items-center justify-center">
                                <option
                                  value="delete"
                                  className="font-semibold text-red-500 cursor-pointer"
                                  onClick={() => {
                                    deleteTask(task._id);
                                  }}
                                >
                                  delete
                                </option>
                                <div className="h-1 w-full bg-gray-300" />
                                <option
                                  value="edit"
                                  className="font-semibold text-gray-700 cursor-pointer"
                                  onClick={() => {
                                    setEditingTaskId(task._id);
                                    setEclipsePopup(false);
                                    setEditedTaskTitle(task.title);
                                    setEditedTaskDueDate(task.dueDate);
                                    setEditedTaskPriority(task.priority);
                                  }}
                                >
                                  edit
                                </option>
                              </div>
                            )
                          : null}
                      </>
                    )}
                  </div>
                ))}
                {/* Add New task */}
                {status === "to-do" && newTaskPopup && (
                  <div className="w-full p-2 ">
                    <div className="w-full flex flex-col gap-3 shadow bg-white p-2 rounded transition-all">
                      <input
                        type="text"
                        name="input"
                        className="w-full h-7 rounded focus:outline-none py-4 px-3 bg-gray-200"
                        placeholder="title for task..."
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                      />
                      <select
                        name="priority"
                        value={taskPriority}
                        className="w-full py-1 px-2 font-semibold focus:outline-none cursor-pointer text-gray-600 bg-gray-200 rounded"
                        onChange={(e) => setTaskPriority(e.target.value)}
                      >
                        <option value="medium">Choose Priority</option>
                        <option value="low">low</option>
                        <option value="high">high</option>
                        <option value="urgent">urgent</option>
                      </select>
                      <input
                        type="date"
                        value={taskDueDate}
                        className="w-full h-7 rounded focus:outline-none py-4 px-3 bg-gray-200"
                        onChange={(e: any) => setTaskDueDate(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                {status === "to-do" &&
                  lead && ( // Ensure this matches `task.status`
                    <div className="p-2 w-full">
                      <button
                        disabled={newTaskPopup && (!taskDueDate || !taskTitle)}
                        className="text-center cursor-pointer w-full px-3 py-2 bg-gray-200 rounded hover:shadow hover:text-violet-500 font-bold text-gray-500 "
                        onClick={() => {
                          setNewTaskPopup(!newTaskPopup);
                          createTask();
                        }}
                      >
                        New Task
                      </button>
                    </div>
                  )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TasksTracking;
