import { FaEdit, FaTrash } from "react-icons/fa";

function BaseData({ caseData, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">詳情</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                狀態
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                案號
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                地址
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                公司
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                負責人
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="px-2 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  {caseData.status}
                </span>
              </td>
              <td className="px-4 py-3 text-base text-gray-900">
                {caseData.caseNumber} 法院案號: {caseData.courtCaseNumber}
              </td>
              <td className="px-4 py-3 text-base text-gray-900">
                {caseData.address}
              </td>
              <td className="px-4 py-3 text-base text-gray-900">
                {caseData.company}
              </td>
              <td className="px-4 py-3 text-base text-gray-900">
                {caseData.responsiblePerson}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <button
                    onClick={onEdit}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <FaEdit className="text-xl" />
                  </button>
                  <button
                    onClick={onDelete}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <FaTrash className="text-xl" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BaseData;

