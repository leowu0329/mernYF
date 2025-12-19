import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

function Land() {
  const [landData, setLandData] = useState([
    {
      id: 1,
      landNumber: "盛興段531",
      area: "41.00",
      individualShare: "1",
      totalShare: "3",
      calculatedArea: "4.13",
    },
    {
      id: 2,
      landNumber: "盛興段534",
      area: "5.00",
      individualShare: "1",
      totalShare: "3",
      calculatedArea: "0.50",
    },
  ]);

  const handleAdd = () => {
    // 新增土地功能
    console.log("新增土地");
  };

  const handleEdit = (id) => {
    // 编辑土地功能
    console.log("编辑土地", id);
  };

  const handleDelete = (id) => {
    // 删除土地功能
    setLandData(landData.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">土地</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <FaPlus />
          <span>新增土地</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                地號
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                地坪(平方公尺)
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                個人持分
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                所有持分
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                計算後地坪(坪)
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {landData.map((land) => (
              <tr key={land.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-base text-gray-900">
                  {land.landNumber}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {land.area}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {land.individualShare}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {land.totalShare}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {land.calculatedArea}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(land.id)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FaEdit className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleDelete(land.id)}
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

export default Land;

