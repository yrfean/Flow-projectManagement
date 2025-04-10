import { ChevronsLeft, Share2, Trash } from "lucide-react";
import UserDps from "../Components/UserDps";
import TasksTracking from "../Components/TasksTracking";
import { useAllData } from "../Query/QueryAndMutation";
import Skelton from "../Components/Skelton";
import { useEffect, useState } from "react";
import ProjectPopup from "../Components/ProjectPopup";

const Home = () => {
  const { data, isLoading } = useAllData();
  const [projectPopup, setProjectPopup] = useState(false);
  const [project, setProject] = useState<any>();
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState();
  const [lead, setLead] = useState(false);

  const changeTasks = (id: string) => {
    const userTasks = data?.allTasks.filter(
      (task: any) => task.assignedTo === id
    );
    setTasks(userTasks);
    const user = data?.allUsers.find((user: any) => user._id === id);
    setUser(user);
  };

  const filterData = async () => {
    const userId = sessionStorage.getItem("_id");

    const project = await data?.allProjects.find((project: any) => {
      return project.teamLead === userId || project.members.includes(userId); //not sure how member's will work
    });
    setProject(project);
  };

  useEffect(() => {
    if (data) {
      filterData();
    }
  }, [data]);
  // check if user is lear or memmber
  useEffect(() => {
    if (project) {
      const lead = project?.teamLead === data?.user._id;
      if (lead) {
        console.log(project);
        console.log(lead);
        setLead(true);
        // console.log("oh its lead");
      }
    }
  }, [data, project]);

  if (isLoading) {
    return <Skelton />;
  }
  return (
    <div className="w-[82.1%] h-full relative p-7 overflow-x-hidden overflow-y-auto">
      {/* Project Popup */}
      <div
        className={`absolute w-1/2 opacity-90 h-[85%] z-10 top-5 bg-white rounded-l right-0 ease-in-out transform transition-all duration-300 ${
          projectPopup ? `translate-x-0` : `translate-x-full`
        }`}
      >
        <ProjectPopup project={project} />
      </div>

      <div className="flex justify-between mt-5 mb-9 ">
        <div
          className="cursor-pointer hover:text-violet-500 flex gap-3 items-center"
          onMouseEnter={() => setProjectPopup(true)}
          onMouseLeave={() => setProjectPopup(false)}
        >
          <h1 className="text-4xl font-serif ml- transition-all duration-200">
            {project?.title}
          </h1>
          <ChevronsLeft
            className={`mt-2 hover:-translate-x-1 transition-all duration-200 ${
              projectPopup ? `-translate-x-1 transition-all duration-200` : ""
            }`}
          />
        </div>
        <div className="mr-10 flex">
          <Share2 className="mr-12 text-2xl text-gray-500 hover:scale-105 transition hover:text-violet-500 cursor-pointer" />
          <Trash className=" text-2xl  text-gray-500 hover:scale-105 transition hover:text-red-500 cursor-pointer" />
        </div>
      </div>

      {lead && (
        <div className="flex gap-9 items-center justify-between">
          <UserDps project={project} changeTasks={changeTasks} />
        </div>
      )}

      <div className="mt-4">
        <TasksTracking tasks={tasks} user={user} changeTasks={changeTasks} />
      </div>
    </div>
  );
};

export default Home;
