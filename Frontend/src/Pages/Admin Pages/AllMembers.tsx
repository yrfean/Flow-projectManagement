import { Delete, Edit } from "lucide-react";
import { useAllData, useDeleteUser } from "../../Query/QueryAndMutation";

const AllMembers = ({ setClickedUser }: any) => {
  const { data } = useAllData();
  const deleteUser = useDeleteUser();
  return (
    <div className="w-full">
      <h1 className="text-2xl m-1 mb-3 -mt-1 font-bold text-violet-500 tracking-wider">
        Employees
      </h1>
      {/* User list container */}
      <div className="grid grid-cols-3 gap-5 w-full">
        {data?.allUsers.map((user: any) => {
          if (user.name === "admin") return null;
          return (
            // each user
            <div className="bg-gray-100 font-semibold text-gray-700 cursor-pointer transition-all hover:scale-[1.02] duration-300 shadow-md hover:shadow-lg rounded p-4 flex flex-col gap-3 items-center justify-center">
              <img
                src={user.dp}
                alt="user dp"
                className="rounded-full object-cover w-32 h-32 outline outline-violet-400"
              />
              <strong className="text-xl text-gray-900">{user.name} </strong>
              <h1>{user.email} </h1>
              <p className="text-lg">{user.role} </p>
              <p>Phone No: {user.phone || "not disclosed"} </p>
              <p>Location: {user.location || "not disclosed"} </p>
              <div className="flex gap-10 text-gray-300">
                <Edit
                  onClick={() => {
                    setClickedUser(user);
                  }}
                  className="size-5 hover:scale-105 transition duration-300 hover:text-violet-500"
                />
                <Delete
                  onClick={() => deleteUser.mutate(user._id)}
                  className="size-5 hover:scale-105 transition duration-300 hover:text-red-500"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllMembers;
