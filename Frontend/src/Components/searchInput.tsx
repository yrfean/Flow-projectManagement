import { Search } from "lucide-react";

const searchInput = ({ placeholder }: { placeholder: string }) => {
  return (
    <div className="relative w-72 max-w-md mr-10">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 rounded focus:outline-none focus:"
      />
    </div>
  );
};

export default searchInput;
