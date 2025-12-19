import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

function Result() {
  const [resultData, setResultData] = useState([
    {
      id: 1,
      applicationDeadline: "2025-09-01",
      executionResult: "",
      biddingCategory: "",
      biddingAmount: "",
      targetNumber: "",
    },
  ]);

  const handleAdd = () => {
    // 新增結果功能
    console.log("新增結果");
  };

  const handleEdit = (id) => {
    // 编辑結果功能
    console.log("编辑結果", id);
  };

  const handleDelete = (id) => {
    // 删除結果功能
    setResultData(resultData.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">結果</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <FaPlus />
          <span>新增結果</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                應買止日
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                執行結果
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                搶標拍別
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                搶標金額
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                標的編號
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {resultData.map((result) => (
              <tr key={result.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-base text-gray-900">
                  {result.applicationDeadline}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {result.executionResult || "—"}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {result.biddingCategory || "—"}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {result.biddingAmount || "—"}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {result.targetNumber || "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(result.id)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FaEdit className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleDelete(result.id)}
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

export default Result;

