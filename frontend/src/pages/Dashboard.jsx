import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaFileWord, FaTrash, FaPlus, FaChevronDown, FaTimes } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Dashboard() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState("在途");
  const [countyFilter, setCountyFilter] = useState("所有縣市");
  const [responsiblePersonFilter, setResponsiblePersonFilter] =
    useState("Sosan");
  const [keywordSearch, setKeywordSearch] = useState("");
  const [cases, setCases] = useState([]);
  const [loadingCases, setLoadingCases] = useState(true);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Modal 相关状态
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [townships, setTownships] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    caseNumber: "",
    company: "揚富開發有限公司",
    cityId: "",
    townshipId: "",
    bigSection: "",
    smallSection: "",
    village: "",
    neighbor: "",
    street: "",
    section: "",
    lane: "",
    alley: "",
    number: "",
    floor: "",
    status: "在途",
    userId: "",
  });

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

  // 获取案件列表
  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoadingCases(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setLoadingCases(false);
          return;
        }

        const response = await axios.get(`${API_URL}/cases`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // 将后端数据转换为前端显示格式
        const formattedCases = (response.data.cases || []).map((caseItem) => {
          // 构建完整地址
          const addressParts = [];
          if (caseItem.city?.name) addressParts.push(caseItem.city.name);
          if (caseItem.township?.name) addressParts.push(caseItem.township.name);
          if (caseItem.village) addressParts.push(caseItem.village);
          if (caseItem.neighbor) addressParts.push(`${caseItem.neighbor}鄰`);
          if (caseItem.street) addressParts.push(caseItem.street);
          if (caseItem.section) addressParts.push(`${caseItem.section}段`);
          if (caseItem.lane) addressParts.push(`${caseItem.lane}巷`);
          if (caseItem.alley) addressParts.push(`${caseItem.alley}弄`);
          if (caseItem.number) addressParts.push(`${caseItem.number}號`);
          if (caseItem.floor) addressParts.push(caseItem.floor);

          const fullAddress = addressParts.join("") || "-";

          return {
            id: caseItem._id,
            report: "word",
            status: caseItem.status || "-",
            caseNumber: caseItem.caseNumber || "-",
            address: fullAddress,
            bidDeadline: "-",
            responsiblePerson: caseItem.user?.nickname || caseItem.user?.name || "-",
            finalJudgment: "-",
            executionResult: "-",
            preferredPurchaseResult: "-",
            targetNumber: "-",
            officialDocument: "-",
          };
        });

        setCases(formattedCases);
      } catch (error) {
        console.error("獲取案件列表失敗:", error);
        toast.error("獲取案件列表失敗");
        setCases([]);
      } finally {
        setLoadingCases(false);
      }
    };

    fetchCases();
  }, []);

  // 刷新案件列表的函数
  const refreshCases = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(`${API_URL}/cases`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedCases = (response.data.cases || []).map((caseItem) => {
        const addressParts = [];
        if (caseItem.city?.name) addressParts.push(caseItem.city.name);
        if (caseItem.township?.name) addressParts.push(caseItem.township.name);
        if (caseItem.village) addressParts.push(caseItem.village);
        if (caseItem.neighbor) addressParts.push(`${caseItem.neighbor}鄰`);
        if (caseItem.street) addressParts.push(caseItem.street);
        if (caseItem.section) addressParts.push(`${caseItem.section}段`);
        if (caseItem.lane) addressParts.push(`${caseItem.lane}巷`);
        if (caseItem.alley) addressParts.push(`${caseItem.alley}弄`);
        if (caseItem.number) addressParts.push(`${caseItem.number}號`);
        if (caseItem.floor) addressParts.push(caseItem.floor);

        const fullAddress = addressParts.join("") || "-";

        return {
          id: caseItem._id,
          report: "word",
          status: caseItem.status || "-",
          caseNumber: caseItem.caseNumber || "-",
          address: fullAddress,
          bidDeadline: "-",
          responsiblePerson: caseItem.user?.name || "-",
          finalJudgment: "-",
          executionResult: "-",
          preferredPurchaseResult: "-",
          targetNumber: "-",
          officialDocument: "-",
        };
      });

      setCases(formattedCases);
    } catch (error) {
      console.error("刷新案件列表失敗:", error);
    }
  };

  // 获取城市、乡镇列表
  useEffect(() => {
    if (showModal) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("token");
          const headers = { Authorization: `Bearer ${token}` };

          const [citiesRes, townshipsRes] = await Promise.all([
            axios.get(`${API_URL}/cases/cities/list`, { headers }),
            axios.get(`${API_URL}/cases/townships/list`, { headers }),
          ]);

          setCities(citiesRes.data.cities || []);
          setTownships(townshipsRes.data.townships || []);
        } catch (error) {
          console.error("獲取數據失敗:", error);
          toast.error("獲取數據失敗");
        }
      };

      fetchData();
    }
  }, [showModal]);

  // 当选择城市时，更新乡镇列表
  useEffect(() => {
    if (formData.cityId) {
      const fetchTownships = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${API_URL}/cases/townships/list?cityId=${formData.cityId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setTownships(response.data.townships || []);
        } catch (error) {
          console.error("獲取鄉鎮列表失敗:", error);
        }
      };
      fetchTownships();
    } else {
      // 如果没有选择城市，获取所有乡镇
      const fetchAllTownships = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`${API_URL}/cases/townships/list`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setTownships(response.data.townships || []);
        } catch (error) {
          console.error("獲取鄉鎮列表失敗:", error);
        }
      };
      fetchAllTownships();
    }
  }, [formData.cityId]);

  const handleCreateCase = () => {
    setShowModal(true);
    // 设置默认负责人为当前用户
    if (user) {
      setFormData((prev) => ({ ...prev, userId: user.id || user._id || "" }));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      caseNumber: "",
      company: "揚富開發有限公司",
      cityId: "",
      townshipId: "",
      bigSection: "",
      smallSection: "",
      village: "",
      neighbor: "",
      street: "",
      section: "",
      lane: "",
      alley: "",
      number: "",
      floor: "",
      status: "在途",
      userId: user?.id || user?._id || "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      // 确保使用当前登录用户的 ID
      const submitData = {
        ...formData,
        userId: user?.id || user?._id || formData.userId,
      };
      
      const response = await axios.post(
        `${API_URL}/cases`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("案件創建成功！");
      handleCloseModal();
      // 刷新案件列表
      refreshCases();
    } catch (error) {
      console.error("創建案件失敗:", error);
      toast.error(
        error.response?.data?.message || "創建案件失敗，請稍後再試"
      );
    } finally {
      setLoading(false);
    }
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
                {loadingCases ? (
                  <tr>
                    <td colSpan="11" className="p-8 text-center text-gray-500">
                      載入中...
                    </td>
                  </tr>
                ) : currentCases.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="p-8 text-center text-gray-500">
                      沒有案件數據
                    </td>
                  </tr>
                ) : (
                  currentCases.map((caseItem) => (
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
                  ))
                )}
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

      {/* 建立新案件 Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-900">建立新案件</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 案號 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    案號 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="caseNumber"
                    value={formData.caseNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 公司 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    公司
                  </label>
                  <select
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="揚富開發有限公司">揚富開發有限公司</option>
                    <option value="鉅鈦開發有限公司">鉅鈦開發有限公司</option>
                  </select>
                </div>

                {/* 狀態 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    狀態
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="在途">在途</option>
                    <option value="結案">結案</option>
                  </select>
                </div>

                {/* 城市 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    城市
                  </label>
                  <select
                    name="cityId"
                    value={formData.cityId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">請選擇城市</option>
                    {cities.map((city) => (
                      <option key={city._id} value={city._id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 鄉鎮里區 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    鄉鎮里區
                  </label>
                  <select
                    name="townshipId"
                    value={formData.townshipId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">請選擇鄉鎮里區</option>
                    {townships.map((township) => (
                      <option key={township._id} value={township._id}>
                        {township.name}
                        {township.city ? ` (${township.city.name})` : ""}
                      </option>
                    ))}
                  </select>
                </div>


                {/* 地址相關字段 */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-4">
                    地址資訊
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    大段
                  </label>
                  <input
                    type="text"
                    name="bigSection"
                    value={formData.bigSection}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    小段
                  </label>
                  <input
                    type="text"
                    name="smallSection"
                    value={formData.smallSection}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    里
                  </label>
                  <input
                    type="text"
                    name="village"
                    value={formData.village}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    鄰
                  </label>
                  <input
                    type="text"
                    name="neighbor"
                    value={formData.neighbor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    街道
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    段
                  </label>
                  <input
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    巷
                  </label>
                  <input
                    type="text"
                    name="lane"
                    value={formData.lane}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    弄
                  </label>
                  <input
                    type="text"
                    name="alley"
                    value={formData.alley}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    號
                  </label>
                  <input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    樓層
                  </label>
                  <input
                    type="text"
                    name="floor"
                    value={formData.floor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "建立中..." : "建立案件"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
