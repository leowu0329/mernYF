import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

function Build() {
  const [buildingData, setBuildingData] = useState([
    {
      id: 1,
      buildingNumber: "盛興段1293",
      area: "59.28",
      individualShare: "1",
      totalShare: "3",
      calculatedArea: "5.98",
      buildingType: "透天厝",
      usageZone: "",
    },
    {
      id: 2,
      buildingNumber: "盛興段4785",
      area: "125.47",
      individualShare: "1",
      totalShare: "3",
      calculatedArea: "6.33",
      buildingType: "增建-持分後坪數打對折",
      usageZone: "",
    },
  ]);

  const handleAdd = () => {
    // 新增建物功能
    console.log("新增建物");
  };

  const handleEdit = (id) => {
    // 编辑建物功能
    console.log("编辑建物", id);
  };

  const handleDelete = (id) => {
    // 删除建物功能
    setBuildingData(buildingData.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">建物</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <FaPlus />
          <span>新增建物</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                建號
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                建坪(平方公尺)
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                個人持分
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                所有持分
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                計算後建坪
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                建物型
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                使用分區
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {buildingData.map((building) => (
              <tr key={building.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-base text-gray-900">
                  {building.buildingNumber}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {building.area}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {building.individualShare}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {building.totalShare}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {building.calculatedArea}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {building.buildingType}
                </td>
                <td className="px-4 py-3 text-base text-gray-500">
                  {building.usageZone || "-"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(building.id)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FaEdit className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleDelete(building.id)}
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

export default Build;

