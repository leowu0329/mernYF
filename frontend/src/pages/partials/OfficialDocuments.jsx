import { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";

function OfficialDocuments() {
  const [documentData, setDocumentData] = useState([
    {
      id: 1,
      caseType: "訴訟費用額(利)",
      divisionType: "孝",
      caseNumber: "地字第一號",
      phone: "06-223344556",
      extension: "334",
      creationTime: "2025-12-19 14:59",
    },
  ]);

  const handleAdd = () => {
    // 新增公文功能
    console.log("新增公文");
  };

  const handleView = (id) => {
    // 查看公文功能
    console.log("查看公文", id);
  };

  const handleEdit = (id) => {
    // 编辑公文功能
    console.log("编辑公文", id);
  };

  const handleDelete = (id) => {
    // 删除公文功能
    setDocumentData(documentData.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">公文</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <FaPlus />
          <span>新增公文</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                案別
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                股別
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                案號
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                電話
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                分機
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                建立時間
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documentData.map((document) => (
              <tr key={document.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-base text-gray-900">
                  {document.caseType}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {document.divisionType}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {document.caseNumber}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {document.phone}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {document.extension}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {document.creationTime}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleView(document.id)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      <FaEye className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleEdit(document.id)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FaEdit className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleDelete(document.id)}
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

export default OfficialDocuments;

