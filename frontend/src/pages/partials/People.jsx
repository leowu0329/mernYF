import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

function People() {
  const [peopleData, setPeopleData] = useState([
    {
      id: 1,
      name: "林怡岑",
      category: "債務人",
      phone: "",
      shareRatio: "",
      investmentRatio: "",
      remarks: "",
    },
    {
      id: 2,
      name: "陳明曉",
      category: "債務人",
      phone: "",
      shareRatio: "",
      investmentRatio: "",
      remarks: "",
    },
    {
      id: 3,
      name: "Bahg2001",
      category: "共有人",
      phone: "342222",
      shareRatio: "",
      investmentRatio: "",
      remarks: "",
    },
  ]);

  const handleAdd = () => {
    // 新增人員功能
    console.log("新增人員");
  };

  const handleEdit = (id) => {
    // 编辑人員功能
    console.log("编辑人員", id);
  };

  const handleDelete = (id) => {
    // 删除人員功能
    setPeopleData(peopleData.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">人員</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <FaPlus />
          <span>新增人員</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                姓名
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                分類
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                電話
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  持分比例
                  <span className="text-red-600 text-xs font-normal">(未持平)</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  投資比例
                  <span className="text-red-600 text-xs font-normal">(未持平)</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                備註
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {peopleData.map((person) => (
              <tr key={person.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-base text-gray-900">{person.name}</td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {person.category}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {person.phone || "-"}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {person.shareRatio || "-"}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {person.investmentRatio || "-"}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {person.remarks || "-"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(person.id)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FaEdit className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleDelete(person.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <FaTrash className="text-xl" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default People;

