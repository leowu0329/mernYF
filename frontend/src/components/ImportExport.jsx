import { useState } from "react";
import Navbar from "./Navbar";
import { FaFileImport, FaFileExport, FaTimes } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function ImportExport() {
  const [loading, setLoading] = useState({});
  const [importResult, setImportResult] = useState(null);

  const categories = [
    { id: "user", name: "使用者" },
    { id: "city", name: "縣市" },
    { id: "township", name: "鄉鎮里區" },
    { id: "basic", name: "基本資訊" },
    { id: "land", name: "土地資訊" },
    { id: "building", name: "建物資訊" },
    { id: "people", name: "人員資訊" },
    { id: "auction", name: "拍賣資訊" },
    { id: "survey", name: "勘查資訊" },
    { id: "objectBuild", name: "比價建物" },
    { id: "finalDecision", name: "最終判定" },
    { id: "result", name: "結果" },
    { id: "officialDocument", name: "公文" },
  ];

  const handleImport = async (categoryId) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".xlsx,.xls,.csv";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setLoading((prev) => ({ ...prev, [`import-${categoryId}`]: true }));

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("請先登入");
          return;
        }

        // 根据类别调用不同的导入 API
        let endpoint = "";

        switch (categoryId) {
          case "user":
            endpoint = `${API_URL}/export/users/import`;
            break;
          case "city":
            endpoint = `${API_URL}/export/cities/import`;
            break;
          case "township":
            endpoint = `${API_URL}/export/townships/import`;
            break;
          case "basic":
            endpoint = `${API_URL}/export/cases/import`;
            break;
          default:
            toast.info(`${categories.find((c) => c.id === categoryId)?.name} 匯入功能尚未實現`);
            return;
        }

        // 创建 FormData 并添加文件
        const formData = new FormData();
        formData.append("file", file);

        // 发送请求
        const response = await axios.post(endpoint, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        // 显示结果
        if (response.data.success > 0 || response.data.failed > 0) {
          const message = response.data.message || `匯入完成：成功 ${response.data.success} 筆，失敗 ${response.data.failed} 筆`;
          
          // 保存导入结果，用于显示详细对话框
          setImportResult({
            success: response.data.success,
            failed: response.data.failed,
            errors: response.data.errors || [],
            categoryName: categories.find((c) => c.id === categoryId)?.name,
          });

          if (response.data.failed === 0) {
            toast.success(message);
          } else if (response.data.success > 0) {
            toast.warning(message + "（點擊查看詳細錯誤）");
          } else {
            toast.error(message + "（點擊查看詳細錯誤）");
          }
        } else {
          toast.success(`${categories.find((c) => c.id === categoryId)?.name} 匯入成功！`);
        }
      } catch (error) {
        console.error("匯入錯誤:", error);
        toast.error(
          error.response?.data?.message ||
            `匯入失敗: ${error.message || "未知錯誤"}`
        );
      } finally {
        setLoading((prev) => ({ ...prev, [`import-${categoryId}`]: false }));
      }
    };
    fileInput.click();
  };

  const handleExport = async (categoryId) => {
    setLoading((prev) => ({ ...prev, [`export-${categoryId}`]: true }));

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("請先登入");
        return;
      }

      // 根据类别调用不同的导出 API
      let endpoint = "";
      let fileName = "";

      switch (categoryId) {
        case "user":
          endpoint = `${API_URL}/export/users`;
          fileName = `使用者資料_${new Date().toISOString().split("T")[0]}.xlsx`;
          break;
        case "city":
          endpoint = `${API_URL}/export/cities`;
          fileName = `縣市資料_${new Date().toISOString().split("T")[0]}.xlsx`;
          break;
        case "township":
          endpoint = `${API_URL}/export/townships`;
          fileName = `鄉鎮里區資料_${new Date().toISOString().split("T")[0]}.xlsx`;
          break;
        case "basic":
          endpoint = `${API_URL}/export/cases`;
          fileName = `基本資訊資料_${new Date().toISOString().split("T")[0]}.xlsx`;
          break;
        default:
          toast.info(`${categories.find((c) => c.id === categoryId)?.name} 匯出功能尚未實現`);
          return;
      }

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // 重要：指定响应类型为 blob
      });

      // 创建下载链接
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`${categories.find((c) => c.id === categoryId)?.name} 匯出成功！`);
    } catch (error) {
      console.error("匯出錯誤:", error);
      toast.error(
        error.response?.data?.message ||
          `匯出失敗: ${error.message || "未知錯誤"}`
      );
    } finally {
      setLoading((prev) => ({ ...prev, [`export-${categoryId}`]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">匯入/匯出</h1>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                    類別
                  </th>
                  <th className="px-6 py-4 text-center text-base font-bold text-gray-900 uppercase tracking-wider">
                    從Excel檔匯入
                  </th>
                  <th className="px-6 py-4 text-center text-base font-bold text-gray-900 uppercase tracking-wider">
                    匯出到Excel
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-base font-semibold text-gray-900">
                        {category.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleImport(category.id)}
                        disabled={loading[`import-${category.id}`]}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                      >
                        <FaFileImport />
                        {loading[`import-${category.id}`] ? "匯入中..." : "從Excel檔匯入"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleExport(category.id)}
                        disabled={loading[`export-${category.id}`]}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                      >
                        <FaFileExport />
                        {loading[`export-${category.id}`] ? "匯出中..." : "匯出到Excel"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 导入结果对话框 */}
      {importResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col">
            {/* 对话框头部 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {importResult.categoryName} 匯入結果
              </h2>
              <button
                onClick={() => setImportResult(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* 对话框内容 */}
            <div className="p-6 overflow-y-auto flex-grow">
              {/* 统计信息 */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-sm text-green-600 font-medium mb-1">成功</div>
                  <div className="text-3xl font-bold text-green-700">
                    {importResult.success}
                  </div>
                  <div className="text-xs text-green-600 mt-1">筆</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="text-sm text-red-600 font-medium mb-1">失敗</div>
                  <div className="text-3xl font-bold text-red-700">
                    {importResult.failed}
                  </div>
                  <div className="text-xs text-red-600 mt-1">筆</div>
                </div>
              </div>

              {/* 错误列表 */}
              {importResult.errors && importResult.errors.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    錯誤詳情 ({importResult.errors.length} 項)
                  </h3>
                  <div className="bg-red-50 rounded-lg border border-red-200 max-h-96 overflow-y-auto">
                    <ul className="divide-y divide-red-200">
                      {importResult.errors.map((error, index) => (
                        <li key={index} className="p-3 text-sm text-red-800">
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* 无错误提示 */}
              {importResult.errors && importResult.errors.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-green-600 text-lg font-semibold">
                    所有資料匯入成功！
                  </div>
                </div>
              )}
            </div>

            {/* 对话框底部 */}
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setImportResult(null)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImportExport;
