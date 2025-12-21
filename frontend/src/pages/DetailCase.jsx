import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import {
  FaArrowLeft,
  FaInfoCircle,
  FaBuilding,
  FaCity,
  FaUsers,
  FaChartBar,
  FaCheckCircle,
  FaFileAlt,
  FaHome,
  FaGavel,
  FaTimes,
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
import BaseData from "./partials/BaseData";
import Land from "./partials/Land";
import Build from "./partials/Build";
import People from "./partials/People";
import Auction from "./partials/Auction";
import Survey from "./partials/Survey";
import ObjectBuild from "./partials/ObjectBuild";
import FinalDecision from "./partials/FinalDecision";
import Result from "./partials/Result";
import OfficialDocuments from "./partials/OfficialDocuments";

function DetailCase() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeMenu, setActiveMenu] = useState("詳情");
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [townships, setTownships] = useState([]);
  const [editFormData, setEditFormData] = useState({
    caseNumber: "",
    company: "",
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
    status: "",
  });

  // 获取案件数据
  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("請先登入");
          navigate("/dashboard");
          return;
        }

        const response = await axios.get(`${API_URL}/cases/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const caseItem = response.data.case;
        
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

        // 转换为前端显示格式
        const formattedData = {
          id: caseItem._id,
          caseNumber: caseItem.caseNumber || "-",
          courtCaseNumber: caseItem.caseNumber || "-", // 如果没有单独的法院案號，使用案號
          address: fullAddress,
          company: caseItem.company || "-",
          status: caseItem.status || "-",
          responsiblePerson: caseItem.user?.nickname || caseItem.user?.name || "-",
          landInfo: "4.64坪", // 这些数据需要从其他模型获取，暂时使用默认值
          buildingInfo: "12.30坪",
          debtors: 2,
          coOwners: 1,
          inspectionLinks: 4,
          finalJudgment: "4拍",
          result: "無記錄",
          comparisonBuilding: "時價:215273元",
          auction: "CP: 1.60 [建議進場]",
          officialDocuments: 0,
        };

        setCaseData(formattedData);
      } catch (error) {
        console.error("獲取案件詳情失敗:", error);
        toast.error("獲取案件詳情失敗");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCaseData();
    }
  }, [id, navigate]);

  // 获取城市、乡镇列表（用于编辑表单）
  useEffect(() => {
    if (showEditModal) {
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
        }
      };

      fetchData();
    }
  }, [showEditModal]);

  // 当选择城市时，更新乡镇列表
  useEffect(() => {
    if (showEditModal && editFormData.cityId) {
      const fetchTownships = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${API_URL}/cases/townships/list?cityId=${editFormData.cityId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setTownships(response.data.townships || []);
        } catch (error) {
          console.error("獲取鄉鎮列表失敗:", error);
        }
      };
      fetchTownships();
    }
  }, [editFormData.cityId, showEditModal]);

  // 打开编辑 modal
  const handleEdit = () => {
    if (!caseData) return;
    
    // 从原始数据中获取完整信息
    const fetchFullCaseData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/cases/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const caseItem = response.data.case;
        setEditFormData({
          caseNumber: caseItem.caseNumber || "",
          company: caseItem.company || "",
          cityId: caseItem.city ? caseItem.city._id.toString() : "",
          townshipId: caseItem.township ? caseItem.township._id.toString() : "",
          bigSection: caseItem.bigSection || "",
          smallSection: caseItem.smallSection || "",
          village: caseItem.village || "",
          neighbor: caseItem.neighbor || "",
          street: caseItem.street || "",
          section: caseItem.section || "",
          lane: caseItem.lane || "",
          alley: caseItem.alley || "",
          number: caseItem.number || "",
          floor: caseItem.floor || "",
          status: caseItem.status || "",
        });
        setShowEditModal(true);
      } catch (error) {
        console.error("獲取案件詳情失敗:", error);
        toast.error("獲取案件詳情失敗");
      }
    };

    fetchFullCaseData();
  };

  // 关闭编辑 modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  // 处理编辑表单输入变化
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 提交编辑
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/cases/${id}`,
        editFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("案件更新成功！");
      setShowEditModal(false);
      
      // 重新获取案件数据
      const caseResponse = await axios.get(`${API_URL}/cases/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const caseItem = caseResponse.data.case;
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

      const formattedData = {
        id: caseItem._id,
        caseNumber: caseItem.caseNumber || "-",
        courtCaseNumber: caseItem.caseNumber || "-",
        address: fullAddress,
        company: caseItem.company || "-",
        status: caseItem.status || "-",
        responsiblePerson: caseItem.user?.name || "-",
        landInfo: "4.64坪",
        buildingInfo: "12.30坪",
        debtors: 2,
        coOwners: 1,
        inspectionLinks: 4,
        finalJudgment: "4拍",
        result: "無記錄",
        comparisonBuilding: "時價:215273元",
        auction: "CP: 1.60 [建議進場]",
        officialDocuments: 0,
      };

      setCaseData(formattedData);
    } catch (error) {
      console.error("更新案件失敗:", error);
      toast.error(
        error.response?.data?.message || "更新案件失敗，請稍後再試"
      );
    } finally {
      setEditLoading(false);
    }
  };

  // 处理删除
  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  // 确认删除
  const handleConfirmDelete = async () => {
    setDeleteLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/cases/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("案件刪除成功！");
      navigate("/dashboard");
    } catch (error) {
      console.error("刪除案件失敗:", error);
      toast.error(
        error.response?.data?.message || "刪除案件失敗，請稍後再試"
      );
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-500">載入中...</div>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-500">找不到該案件</div>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            返回案件列表
          </button>
        </div>
      </div>
    );
  }

  // 定义菜单项（在 caseData 有值之后）
  const menuItems = [
    { id: "詳情", icon: FaInfoCircle, active: true },
    { id: "土地資訊", icon: FaBuilding, value: `(${caseData.landInfo})` },
    { id: "建物資訊", icon: FaCity, value: `(${caseData.buildingInfo})` },
    {
      id: "人員資訊",
      icon: FaUsers,
      value: `債務人(${caseData.debtors})共有人(${caseData.coOwners})`,
    },
    { id: "拍賣", icon: FaGavel, value: `(${caseData.auction})` },
    {
      id: "勘查",
      icon: FaChartBar,
      value: `(連結:${caseData.inspectionLinks})`,
    },
    {
      id: "比價建物",
      icon: FaHome,
      value: `(${caseData.comparisonBuilding})`,
    },
    {
      id: "最終判定",
      icon: FaCheckCircle,
      value: `(${caseData.finalJudgment})`,
    },
    { id: "結果", icon: FaFileAlt, value: `(${caseData.result})` },
    { id: "公文", icon: FaFileAlt, value: `(${caseData.officialDocuments})` },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {caseData.caseNumber} {caseData.courtCaseNumber !== caseData.caseNumber && `法院案號: ${caseData.courtCaseNumber}`}
          </h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
              <FaArrowLeft className="text-gray-500 text-xs" />
            </div>
            <span>返回案件列表</span>
          </button>
        </div>

        <div className="flex gap-6">
          {/* Left Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-md p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full flex items-center gap-3 p-1 rounded-md transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="text-xl" />
                    <div className="flex-1 text-left">
                      <div className="text-base font-medium">{item.id}</div>
                      {item.value && (
                        <div
                          className={`text-sm ${
                            isActive ? "text-blue-100" : "text-red-600"
                          }`}
                        >
                          {item.value}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {activeMenu === "詳情" && (
              <BaseData
                caseData={caseData}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
            {activeMenu === "土地資訊" && <Land />}
            {activeMenu === "建物資訊" && <Build />}
            {activeMenu === "人員資訊" && <People />}
            {activeMenu === "拍賣" && <Auction />}
            {activeMenu === "勘查" && <Survey />}
            {activeMenu === "比價建物" && <ObjectBuild />}
            {activeMenu === "最終判定" && <FinalDecision />}
            {activeMenu === "結果" && <Result />}
            {activeMenu === "公文" && <OfficialDocuments />}
            {activeMenu !== "詳情" &&
              activeMenu !== "土地資訊" &&
              activeMenu !== "建物資訊" &&
              activeMenu !== "人員資訊" &&
              activeMenu !== "拍賣" &&
              activeMenu !== "勘查" &&
              activeMenu !== "比價建物" &&
              activeMenu !== "最終判定" &&
              activeMenu !== "結果" &&
              activeMenu !== "公文" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {activeMenu}
                  </h2>
                  <p className="text-gray-600">此功能開發中...</p>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* 编辑案件 Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-900">編輯案件</h2>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleEditSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 案號 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    案號 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="caseNumber"
                    value={editFormData.caseNumber}
                    onChange={handleEditInputChange}
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
                    value={editFormData.company}
                    onChange={handleEditInputChange}
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
                    value={editFormData.status}
                    onChange={handleEditInputChange}
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
                    value={editFormData.cityId}
                    onChange={handleEditInputChange}
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
                    value={editFormData.townshipId}
                    onChange={handleEditInputChange}
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
                    value={editFormData.bigSection}
                    onChange={handleEditInputChange}
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
                    value={editFormData.smallSection}
                    onChange={handleEditInputChange}
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
                    value={editFormData.village}
                    onChange={handleEditInputChange}
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
                    value={editFormData.neighbor}
                    onChange={handleEditInputChange}
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
                    value={editFormData.street}
                    onChange={handleEditInputChange}
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
                    value={editFormData.section}
                    onChange={handleEditInputChange}
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
                    value={editFormData.lane}
                    onChange={handleEditInputChange}
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
                    value={editFormData.alley}
                    onChange={handleEditInputChange}
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
                    value={editFormData.number}
                    onChange={handleEditInputChange}
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
                    value={editFormData.floor}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editLoading ? "更新中..." : "更新案件"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                確認刪除
              </h3>
              <p className="text-gray-600 mb-6">
                您確定要刪除此案件嗎？此操作無法復原。
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteLoading}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteLoading}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading ? "刪除中..." : "確認刪除"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailCase;
