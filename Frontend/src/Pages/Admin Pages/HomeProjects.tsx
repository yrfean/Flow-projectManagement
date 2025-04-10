import { Delete, Edit } from "lucide-react";
import ProgressiveCircleBar from "../../Components/ProgressiveCircleBar";
import { useAllData, useDeleteProject } from "../../Query/QueryAndMutation";
import NewProjectInput from "./NewProjectInput";
import { useState } from "react";
import EditProjectInput from "./EditProjectInput";

const HomeProjects = ({ setProject }: any) => {
  const { data } = useAllData();
  const [editProject, setEditProject] = useState<any>(false);
  const deleteProject = useDeleteProject();

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl ml-3 font-bold text-violet-500 tracking-wider">
        Projects
      </h1>

      <div className="grid grid-cols-2 w-full p-2 gap-5">
        {data?.allProjects.map((project: any) => {
          const relatedTasks = data.allTasks.filter(
            (task: any) => task.project === project._id
          );

          const totalTasks = relatedTasks.length;
          const completedTasks = relatedTasks.filter(
            (task: any) => task.status === "completed"
          ).length;

          const progress =
            totalTasks === 0
              ? 0
              : Math.round((completedTasks / totalTasks) * 100);

          return (
            <>
              {project._id === editProject._id ? (
                <EditProjectInput
                  project={editProject}
                  setEditProject={setEditProject}
                />
              ) : (
                <div
                  onClick={() => setProject(project._id)}
                  key={project._id}
                  className="rounded relative bg-gray-100 max-h-[350px] shadow-md p-3 flex gap-3 items-center cursor-pointer hover:shadow-xl transition-all duration-300"
                >
                  <div className="absolute size-16 flex gap-6 top-5 right-5 text-gray-300">
                    <Edit
                      className="hover:text-violet-500 transition-all"
                      onClick={(e) => {
                        setEditProject(project);
                        e.stopPropagation();
                      }}
                    />
                    <Delete
                      onClick={(e) => {
                        deleteProject.mutate(project._id);
                        e.stopPropagation();
                      }}
                      className="hover:text-red-500 transition-all"
                    />
                    {/* dont forget to set bakcend to delete all tasks of the project ur delete */}
                  </div>
                  <div className="">
                    <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
                    <p className="text-justify mb-1 font-semibold text-gray-700">
                      {project.description}
                    </p>

                    <div className="flex gap-2 my-2 group w-fit">
                      <p className="text-lg text-gray-600">Team Lead:</p>
                      <img
                        src={
                          data.allUsers.find(
                            (user: any) => user._id === project.teamLead
                          ).dp
                        }
                        alt="lead dp"
                        className="rounded-full w-7 h-7 object-cover outline outline-violet-500"
                      />
                      <span className="group-hover:opacity-100 cursor-default opacity-0 text-white bg-gray-500 rounded-r rounded-tl h-7 px-3 -ml-4 -mt-3">
                        {
                          data.allUsers.find(
                            (user: any) => user._id === project.teamLead
                          ).name
                        }
                      </span>
                    </div>

                    <strong
                      className={`${
                        project.priority === "medium"
                          ? "bg-gray-400"
                          : project.priority === "low"
                          ? "bg-yellow-300"
                          : project.priority === "high"
                          ? "bg-red-500"
                          : "bg-violet-500"
                      } px-2 rounded`}
                    >
                      {project.priority}
                    </strong>
                    <strong
                      className={`${
                        project.status === "incompleted"
                          ? "bg-red-400"
                          : project.status === "in-progress"
                          ? "bg-yellow-300"
                          : "bg-green-500"
                      } px-2 rounded ml-1`}
                    >
                      {project.status}
                    </strong>

                    <h1 className="font-medium mt-2 text-gray-400">
                      {`Due date: ${new Date(
                        project.dueDate
                      ).toLocaleDateString()}`}
                    </h1>
                  </div>

                  <div className="">
                    <ProgressiveCircleBar progress={progress} />
                  </div>
                </div>
              )}
            </>
          );
        })}
        <div>
          <NewProjectInput />
        </div>
      </div>
    </div>
  );
};

export default HomeProjects;
