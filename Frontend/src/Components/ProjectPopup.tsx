import { useState, useEffect } from "react";
import { useAllData } from "../Query/QueryAndMutation";

const ProjectPopup = ({ project }: any) => {
  const { data } = useAllData();
  const [teamLead, setTeamLead] = useState<any>();
  const [members, setMembers] = useState<User[]>([]);
  // console.log(members);
  interface User {
    _id: string;
    name: string;
    dp: string;
  }

  useEffect(() => {
    if (!data || !project) return;

    const findMembers = () => {
      if (!Array.isArray(project.members)) return;
      const mem =
        data.allUsers?.filter((user: any) =>
          project.members.includes(user._id)
        ) || [];
      setMembers(mem);
    };

    const findTeamLead = () => {
      const tl = data.allUsers?.find(
        (user: any) => user._id === project.teamLead
      );
      if (tl) setTeamLead(tl);
    };

    findMembers();
    findTeamLead();
  }, [data, project]);

  const formatDate = (dateString: any) => {
    return dateString
      ? new Date(dateString).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "N/A";
  };

  return (
    <div className="flex w-full h-full flex-col pt-14 gap-7 p-4 items-center  shadow-lg rounded">
      <h1 className="text-2xl font-bold">{project?.title || "No Title"}</h1>
      <p className="text-gray-700">
        {project?.description || "No Description"}
      </p>
      <div className="flex gap-2">
        <h2 className="font-medium">
          Team Lead: {teamLead?.name || "Not Assigned"}
        </h2>
        <img
          src={teamLead?.dp}
          alt="team lead dp"
          className="w-6 h-6 object-cover rounded-full"
        />
      </div>
      <div className="w-full p-2 bg-gray-100 rounded-md">
        <h2 className="font-medium">Team Members:</h2>
        {members.length > 0 ? (
          <ul className="list-decimal pl-5">
            {members.map((member, index) => (
              <div className="flex justify-around" key={index}>
                <li key={member._id} className="text-gray-600">
                  {member.name}
                </li>
                <img
                  src={member.dp}
                  alt="member dp"
                  className="w-6 h-6 object-cover rounded-full"
                />
              </div>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No members assigned</p>
        )}
      </div>
      <div className="w-full flex flex-col gap-1 text-gray-600">
        <p>
          <strong>Due Date:</strong> {formatDate(project?.dueDate)}
        </p>
        <p>
          <strong>Assigned Date:</strong> {formatDate(project?.assignedDate)}
        </p>
      </div>
    </div>
  );
};

export default ProjectPopup;
