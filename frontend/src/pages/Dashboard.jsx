import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaFileWord, FaTrash, FaPlus, FaChevronDown } from "react-icons/fa";

// 示例数据
const mockCases = [
  {
    id: 1,
    report: "word",
    status: "在途",
    caseNumber: "112年度司執字第109545號",
    address: "高雄市苓雅區福安路252巷6號",
    bidDeadline: "-",
    responsiblePerson: "Sosan",
    finalJudgment: "-",
    executionResult: "-",
    preferredPurchaseResult: "-",
    targetNumber: "-",
    officialDocument: "-",
  },
  {
    id: 2,
    report: "word",
    status: "在途",
    caseNumber: "114年度司執字第23889號",
    address: "台南市北區長榮路4段135巷8號",
    bidDeadline: "-",
    responsiblePerson: "Sosan",
    finalJudgment: "4拍",
    executionResult: "-",
    preferredPurchaseResult: "-",
    targetNumber: "-",
    officialDocument: "-",
  },
  {
    id: 3,
    report: "word",
    status: "在途",
    caseNumber: "112年度司執字第57523號",
    address: "台南市中西區開山里11鄰大同路1段70巷17號5樓之3",
    bidDeadline: "-",
    responsiblePerson: "Sosan",
    finalJudgment: "未判定",
    executionResult: "無人優購",
    preferredPurchaseResult: "-",
    targetNumber: "GT011",
    officialDocument: "-",
  },
  {
    id: 4,
    report: "word",
    status: "在途",
    caseNumber: "113年度司執字第14138號",
    address: "台東縣蘭嶼鄉朗島村朗島路161號",
    bidDeadline: "-",
    responsiblePerson: "Sosan",
    finalJudgment: "-",
    executionResult: "-",
    preferredPurchaseResult: "-",
    targetNumber: "-",
    officialDocument: "-",
  },
];

function Dashboard() {
  const [statusFilter, setStatusFilter] = useState("在途");
  const [countyFilter, setCountyFilter] = useState("所有縣市");
  const [responsiblePersonFilter, setResponsiblePersonFilter] =
    useState("Sosan");
  const [keywordSearch, setKeywordSearch] = useState("");
  const [cases, setCases] = useState(mockCases);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleDelete = (id) => {
    setCases(cases.filter((caseItem) => caseItem.id !== id));
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleCreateCase = () => {
    // 建立新案件的逻辑
    console.log("建立新案件");
  };

  // 分页计算
  const totalPages = Math.ceil(cases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCases = cases.slice(startIndex, endIndex);
  const startItem = cases.length > 0 ? startIndex + 1 : 0;
  const endItem = Math.min(endIndex, cases.length);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* 标题 */}
        <h1 className="text-3xl font-bold text-blue-600 mb-6">案件列表</h1>

        {/* 筛选栏 */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* 状态下拉菜单 */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-base font-medium text-gray-700 mb-1">
                狀態
              </label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="在途">在途</option>
                  <option value="已完成">已完成</option>
                  <option value="已取消">已取消</option>
                </select>
              </div>
            </div>

            {/* 县市下拉菜单 */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-base font-medium text-gray-700 mb-1">
                縣市
              </label>
              <div className="relative">
                <select
                  value={countyFilter}
                  onChange={(e) => setCountyFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="所有縣市">所有縣市</option>
                  <option value="台北市">台北市</option>
                  <option value="新北市">新北市</option>
                  <option value="台南市">台南市</option>
                  <option value="高雄市">高雄市</option>
                  <option value="台東縣">台東縣</option>
                </select>
              </div>
            </div>

            {/* 负责人下拉菜单 */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-base font-medium text-gray-700 mb-1">
                負責人
              </label>
              <div className="relative">
                <select
                  value={responsiblePersonFilter}
                  onChange={(e) => setResponsiblePersonFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Sosan">Sosan</option>
                  <option value="所有負責人">所有負責人</option>
                </select>
              </div>
            </div>

            {/* 关键字查询 */}
            <div className="flex-2 min-w-[200px]">
              <label className="block text-base font-medium text-gray-700 mb-1">
                關鍵字查詢
              </label>
              <input
                type="text"
                value={keywordSearch}
                onChange={(e) => setKeywordSearch(e.target.value)}
                placeholder="案號、地址、負責人等"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 建立新案件按钮 */}
            <div className="flex items-end">
              <button
                onClick={handleCreateCase}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <FaPlus />
                <span>建立新案件</span>
              </button>
            </div>
          </div>
        </div>

        {/* 案件列表表格 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-1 text-center align-middle text-base font-bold text-gray-900 uppercase tracking-wider">
                    報表
                  </th>
                  <th className="p-1 text-center align-middle text-base font-bold text-gray-900 uppercase tracking-wider">
                    狀態
                  </th>
                  <th className="p-1 text-center align-middle text-base font-bold text-gray-900 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("caseNumber")}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      案號及完整地址
                      <FaChevronDown className="text-xs" />
                    </button>
                  </th>
                  <th className="p-1 text-center align-middle text-base font-bold text-gray-900 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("bidDeadline")}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      應買止日
                      <FaChevronDown className="text-xs" />
                    </button>
                  </th>
                  <th className="p-1 text-center align-middle text-base font-bold text-gray-900 uppercase tracking-wider">
                    負責人
                  </th>
                  <th className="p-1 text-center align-middle text-base font-bold text-gray-900 uppercase tracking-wider">
                    最終判定
                  </th>
                  <th className="p-1 text-center align-middle text-base font-bold text-gray-900 uppercase tracking-wider">
                    執行結果
                  </th>
                  <th className="p-1 text-center align-middle text-base font-bold text-gray-900 uppercase tracking-wider">
                    優購結果
                  </th>
                  <th className="p-1 text-center align-middle text-base font-bold text-gray-900 uppercase tracking-wider">
                    標的編號
                  </th>
                  <th className="p-1 text-center align-middle text-base font-bold text-gray-900 uppercase tracking-wider">
                    公文
                  </th>
                  <th className="p-1 text-center align-middle text-base font-bold text-gray-900 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentCases.map((caseItem) => (
                  <tr key={caseItem.id} className="hover:bg-gray-50">
                    <td className="p-1 text-center align-middle whitespace-nowrap">
                      <FaFileWord className="text-blue-600 text-xl" />
                    </td>
                    <td className="p-1 text-center align-middle whitespace-nowrap">
                      <span className="px-2 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {caseItem.status}
                      </span>
                    </td>
                    <td className="p-1 text-center align-middle">
                      <Link
                        to={`/case/${caseItem.id}`}
                        className="block text-center hover:text-blue-600 transition-colors"
                      >
                        <div className="text-base text-blue-600 underline text-center">
                          {caseItem.caseNumber}
                        </div>
                        <div className="text-base text-blue-600 underline text-center">
                          {caseItem.address}
                        </div>
                      </Link>
                    </td>
                    <td className="p-1 text-center align-middle whitespace-nowrap text-base text-gray-500">
                      {caseItem.bidDeadline}
                    </td>
                    <td className="p-1 text-center align-middle whitespace-nowrap text-base text-gray-900">
                      {caseItem.responsiblePerson}
                    </td>
                    <td className="p-1 text-center align-middle whitespace-nowrap text-base text-gray-500">
                      {caseItem.finalJudgment}
                    </td>
                    <td className="p-1 text-center align-middle whitespace-nowrap text-base text-gray-500">
                      {caseItem.executionResult}
                    </td>
                    <td className="p-1 text-center align-middle whitespace-nowrap text-base text-gray-500">
                      {caseItem.preferredPurchaseResult}
                    </td>
                    <td className="p-1 text-center align-middle whitespace-nowrap text-base text-gray-500">
                      {caseItem.targetNumber}
                    </td>
                    <td className="p-1 text-center align-middle whitespace-nowrap text-base text-gray-500">
                      {caseItem.officialDocument}
                    </td>
                    <td className="p-1 text-center align-middle whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(caseItem.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <FaTrash />
                        <span className="text-base">刪除</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 分页控件 */}
        <div className="bg-white rounded-lg shadow-md p-4 mt-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* 左侧：显示信息 */}
            <div className="text-base text-gray-600">
              顯示{startItem}~{endItem}筆(第{currentPage}頁,共{totalPages}頁)
            </div>

            {/* 中间：页码按钮 */}
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded text-base ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
                    } transition-colors`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {currentPage < totalPages && (
                <>
                  {currentPage < totalPages - 1 && (
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="px-3 py-1 rounded text-base bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      下一頁
                    </button>
                  )}
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-1 rounded text-base bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    最後一頁
                  </button>
                </>
              )}
            </div>

            {/* 右侧：每页显示数量 */}
            <div className="flex items-center gap-2">
              <span className="text-base text-gray-600">每頁顯示:</span>
              <div className="relative">
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(e.target.value)}
                  className="px-3 py-1 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <FaChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
