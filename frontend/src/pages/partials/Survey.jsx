import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

function Survey() {
  const [surveyData, setSurveyData] = useState([
    {
      id: 1,
      initialInspectionDate: "",
      jointInspectionDate: "",
      auctionAnnouncement: "連結",
      item998: "連結",
      propertyPhotos: "連結",
      marketConditions: "",
      auctionRecord: "連結",
      onSiteInspection: "",
      correspondenceLedger: "",
      runningAccount: "",
    },
  ]);

  const handleAdd = () => {
    // 新增勘查功能
    console.log("新增勘查");
  };

  const handleEdit = (id) => {
    // 编辑勘查功能
    console.log("编辑勘查", id);
  };

  const handleDelete = (id) => {
    // 删除勘查功能
    setSurveyData(surveyData.filter((item) => item.id !== id));
  };

  const handleLinkClick = (type, id) => {
    // 处理链接点击
    console.log(`点击${type}链接`, id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">勘查</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <FaPlus />
          <span>新增勘查</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                初勘日
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                會勘日
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                法拍公告
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                998
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                物件照片
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                市場行情
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                法拍記錄
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                現場勘查
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                收發文薄
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                流水帳
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {surveyData.map((survey) => (
              <tr key={survey.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-base text-gray-900">
                  {survey.initialInspectionDate || "-"}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {survey.jointInspectionDate || "-"}
                </td>
                <td className="px-4 py-3 text-sm">
                  {survey.auctionAnnouncement === "連結" ? (
                    <button
                      onClick={() => handleLinkClick("法拍公告", survey.id)}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      連結
                    </button>
                  ) : (
                    survey.auctionAnnouncement || "-"
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  {survey.item998 === "連結" ? (
                    <button
                      onClick={() => handleLinkClick("998", survey.id)}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      連結
                    </button>
                  ) : (
                    survey.item998 || "-"
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  {survey.propertyPhotos === "連結" ? (
                    <button
                      onClick={() => handleLinkClick("物件照片", survey.id)}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      連結
                    </button>
                  ) : (
                    survey.propertyPhotos || "-"
                  )}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {survey.marketConditions || "-"}
                </td>
                <td className="px-4 py-3 text-sm">
                  {survey.auctionRecord === "連結" ? (
                    <button
                      onClick={() => handleLinkClick("法拍記錄", survey.id)}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      連結
                    </button>
                  ) : (
                    survey.auctionRecord || "-"
                  )}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {survey.onSiteInspection || "-"}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {survey.correspondenceLedger || "-"}
                </td>
                <td className="px-4 py-3 text-base text-gray-900">
                  {survey.runningAccount || "-"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(survey.id)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FaEdit className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleDelete(survey.id)}
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

export default Survey;

