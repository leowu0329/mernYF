import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
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
} from "react-icons/fa";
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
  const [activeMenu, setActiveMenu] = useState("詳情");

  // 示例数据
  const caseData = {
    id: id,
    caseNumber: "114年度雄金職字第72號",
    courtCaseNumber: "113年度司執字第102723號",
    address: "高雄市前鎮區桂林街134巷7號",
    company: "鉅鈦開發有限公司",
    status: "在途",
    responsiblePerson: "Sosan",
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
    { id: "勘查", icon: FaChartBar, value: `(連結:${caseData.inspectionLinks})` },
    {
      id: "比價建物",
      icon: FaHome,
      value: `(${caseData.comparisonBuilding})`,
    },
    { id: "最終判定", icon: FaCheckCircle, value: `(${caseData.finalJudgment})` },
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
            {caseData.caseNumber} 法院案號: {caseData.courtCaseNumber}
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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
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
                onEdit={() => {
                  // 编辑功能
                  console.log("编辑案件", caseData.id);
                }}
                onDelete={() => {
                  // 删除功能
                  console.log("删除案件", caseData.id);
                }}
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
    </div>
  );
}

export default DetailCase;
