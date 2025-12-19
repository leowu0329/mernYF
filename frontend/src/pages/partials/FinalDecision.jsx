import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

function FinalDecision() {
  const [finalDecisionData, setFinalDecisionData] = useState([
    {
      id: 1,
      judgment: "4拍",
      category: "區域負責人",
      personnel: "Sosan",
      date: "2025-12-13",
      workJurisdiction: "雲嘉南",
      remarks: "測試好玩的",
    },
  ]);

  const handleAdd = () => {
    // 新增最終判定功能
    console.log("新增最終判定");
  };

  const handleEdit = (id) => {
    // 编辑最終判定功能
    console.log("编辑最終判定", id);
  };

  const handleDelete = (id) => {
    // 删除最終判定功能
    setFinalDecisionData(finalDecisionData.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">最終判定</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <FaPlus />
          <span>新增最終判定</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                最終判定
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                分類
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                人員
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                日期
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                工作轄區
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
            {finalDecisionData.map((decision) => (
              <tr key={decision.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-base text-gray-900">
                  {decision.judgment}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {decision.category}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {decision.personnel}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {decision.date}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {decision.workJurisdiction}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {decision.remarks}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(decision.id)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FaEdit className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleDelete(decision.id)}
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

export default FinalDecision;

