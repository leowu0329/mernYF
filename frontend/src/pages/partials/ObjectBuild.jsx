import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

function ObjectBuild() {
  const [objectBuildData, setObjectBuildData] = useState([
    {
      id: 1,
      type: "實價登錄",
      address: "前鎮區桂林街134巷41號",
      attachment: "連結",
      age: "48.10",
      transactionDate: "2024-10-01",
      floorHeight: "1/2",
      totalPrice: "7,800,000",
      buildingArea: "28.50",
      addedArea: "16.00",
      unitPrice: "213,699",
      calculation: "277809",
      additions: [
        {
          id: 1,
          surveyor: "",
          addition: "0.30",
          reason: "None",
        },
      ],
    },
    {
      id: 2,
      type: "實價登錄",
      address: "前鎮區復興三路238巷21號",
      attachment: "連結",
      age: "58.50",
      transactionDate: "2025-01-01",
      floorHeight: "1/2",
      totalPrice: "2,400,000",
      buildingArea: "10.20",
      addedArea: "8.00",
      unitPrice: "169,014",
      calculation: "169014",
      additions: [],
    },
  ]);

  const handleAdd = () => {
    // 新增比價建物功能
    console.log("新增比價建物");
  };

  const handleEdit = (id) => {
    // 编辑比價建物功能
    console.log("编辑比價建物", id);
  };

  const handleDelete = (id) => {
    // 删除比價建物功能
    setObjectBuildData(objectBuildData.filter((item) => item.id !== id));
  };

  const handleAddAddition = (objectId) => {
    // 新增加成功能
    console.log("新增加成", objectId);
  };

  const handleEditAddition = (objectId, additionId) => {
    // 编辑加成功能
    console.log("编辑加成", objectId, additionId);
  };

  const handleDeleteAddition = (objectId, additionId) => {
    // 删除加成功能
    setObjectBuildData(
      objectBuildData.map((obj) => {
        if (obj.id === objectId) {
          return {
            ...obj,
            additions: obj.additions.filter((add) => add.id !== additionId),
          };
        }
        return obj;
      })
    );
  };

  const handleLinkClick = (id) => {
    // 处理附件链接点击
    console.log("点击附件链接", id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">比價建物</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <FaPlus />
          <span>新增比價建物</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider border-r border-gray-200">
                參考物件訊息
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider border-r border-gray-200">
                加成
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider border-r border-gray-200">
                計算
              </th>
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {objectBuildData.map((object) => (
              <tr key={object.id} className="hover:bg-gray-50">
                {/* 參考物件訊息 */}
                <td className="px-4 py-3 border-r border-gray-200">
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="font-medium">類型:</span>{" "}
                      <span className="text-gray-900">{object.type}</span>
                    </div>
                    <div>
                      <span className="font-medium">地址:</span>{" "}
                      <span className="text-gray-900">{object.address}</span>
                    </div>
                    <div>
                      <span className="font-medium">附件:</span>{" "}
                      {object.attachment === "連結" ? (
                        <button
                          onClick={() => handleLinkClick(object.id)}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          連結
                        </button>
                      ) : (
                        <span className="text-gray-900">{object.attachment}</span>
                      )}
                    </div>
                    <div>
                      <span className="font-medium">屋齡(年):</span>{" "}
                      <span className="text-gray-900">{object.age}</span>
                    </div>
                    <div>
                      <span className="font-medium">成交日期:</span>{" "}
                      <span className="text-gray-900">{object.transactionDate}</span>
                    </div>
                    <div>
                      <span className="font-medium">樓高:</span>{" "}
                      <span className="text-gray-900">{object.floorHeight}</span>
                    </div>
                    <div>
                      <span className="font-medium">總價:</span>{" "}
                      <span className="text-gray-900">{object.totalPrice}</span>
                    </div>
                    <div>
                      <span className="font-medium">建坪(坪):</span>{" "}
                      <span className="text-gray-900">{object.buildingArea}</span>
                    </div>
                    <div>
                      <span className="font-medium">增建坪數(坪):</span>{" "}
                      <span className="text-gray-900">{object.addedArea}</span>
                    </div>
                    <div>
                      <span className="font-medium">單價:</span>{" "}
                      <span className="text-gray-900">{object.unitPrice}</span>
                    </div>
                  </div>
                </td>

                {/* 加成 */}
                <td className="px-4 py-3 border-r border-gray-200">
                  <div className="space-y-2">
                    {object.additions.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-2 py-1 text-left text-base font-bold text-gray-900">
                                勘查員
                              </th>
                              <th className="px-2 py-1 text-left text-base font-bold text-gray-900">
                                加成
                              </th>
                              <th className="px-2 py-1 text-left text-base font-bold text-gray-900">
                                加成原因
                              </th>
                              <th className="px-2 py-1 text-left text-base font-bold text-gray-900">
                                操作
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {object.additions.map((addition) => (
                              <tr key={addition.id}>
                                <td className="px-2 py-1 text-gray-900">
                                  {addition.surveyor || "-"}
                                </td>
                                <td className="px-2 py-1 text-gray-900">
                                  {addition.addition}
                                </td>
                                <td className="px-2 py-1 text-gray-900">
                                  {addition.reason}
                                </td>
                                <td className="px-2 py-1 whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() =>
                                        handleEditAddition(object.id, addition.id)
                                      }
                                      className="text-blue-600 hover:text-blue-800"
                                    >
                                      <FaEdit className="text-sm" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteAddition(object.id, addition.id)
                                      }
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <FaTrash className="text-sm" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 py-2">
                        無加成記錄。
                      </div>
                    )}
                    <button
                      onClick={() => handleAddAddition(object.id)}
                      className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      <FaPlus className="text-sm" />
                      <span>新增加成</span>
                    </button>
                  </div>
                </td>

                {/* 計算 */}
                <td className="px-4 py-3 border-r border-gray-200">
                  <div className="text-base text-gray-900">{object.calculation}</div>
                </td>

                {/* 操作 */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(object.id)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FaEdit className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleDelete(object.id)}
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

export default ObjectBuild;

