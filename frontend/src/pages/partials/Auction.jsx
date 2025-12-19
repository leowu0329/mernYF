import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

function Auction() {
  const [auctionData, setAuctionData] = useState([
    {
      id: 1,
      auctionType: "1拍",
      auctionDate: "2025-04-16",
      basePrice: "2580000",
      suggestedPrices: [
        "二拍建議底價: 2,064,000",
        "三拍建議底價: 1,651,200",
        "四拍建議底價: 1,320,960",
      ],
      pricePerPing: "209702",
      cp: "1.03",
      views: "0",
      monitor: "0",
      transactions: "0",
      suggestedBidA: "2,580,000",
      suggestedBidB: "2,580,000",
      suggestedBid: "2,580,000",
      deposit: "0",
    },
    {
      id: 2,
      auctionType: "2拍",
      auctionDate: "2025-06-18",
      basePrice: "2064000",
      suggestedPrices: ["三拍建議底價: 1,651,200", "四拍建議底價: 1,320,960"],
      pricePerPing: "167762",
      cp: "1.29",
      views: "0",
      monitor: "0",
      transactions: "0",
      suggestedBidA: "2,064,000",
      suggestedBidB: "2,064,000",
      suggestedBid: "2,064,000",
      deposit: "0",
    },
    {
      id: 3,
      auctionType: "4拍",
      auctionDate: "2025-12-19",
      basePrice: "1322400",
      suggestedPrices: [],
      pricePerPing: "107484",
      cp: "2.00",
      views: "0",
      monitor: "0",
      transactions: "45",
      suggestedBidA: "1,454,640",
      suggestedBidB: "1,655,350",
      suggestedBid: "1,454,640",
      deposit: "22334",
    },
    {
      id: 4,
      auctionType: "3拍",
      auctionDate: "2025-09-20",
      basePrice: "1651200",
      suggestedPrices: ["四拍建議底價: 1,320,960"],
      pricePerPing: "134353",
      cp: "1.60",
      views: "0",
      monitor: "0",
      transactions: "0",
      suggestedBidA: "1,651,200",
      suggestedBidB: "1,651,200",
      suggestedBid: "1,651,200",
      deposit: "0",
    },
  ]);

  const handleAdd = () => {
    // 新增拍賣功能
    console.log("新增拍賣");
  };

  const handleEdit = (id) => {
    // 编辑拍賣功能
    console.log("编辑拍賣", id);
  };

  const handleDelete = (id) => {
    // 删除拍賣功能
    setAuctionData(auctionData.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">拍賣</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <FaPlus />
          <span>新增拍賣</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-0 text-center align-middle text-base font-bold text-gray-900 uppercase tracking-wider">
                拍別
              </th>
              <th className="p-0 text-center align-middle text-base font-bold text-gray-900 uppercase tracking-wider">
                拍賣日
              </th>
              <th className="p-0 text-center align-middle text-base font-bold text-gray-900 uppercase tracking-wider">
                底價
              </th>
              <th className="p-0 text-center align-middle text-base font-bold text-gray-900 uppercase tracking-wider">
                坪價
              </th>
              <th className="p-0 text-center align-middle text-base font-bold text-gray-900 uppercase tracking-wider">
                CP
              </th>
              <th className="p-0 text-center align-middle text-base font-bold text-gray-900 uppercase tracking-wider">
                點閱
              </th>
              <th className="p-0 text-center align-middle text-base font-bold text-gray-900 uppercase tracking-wider">
                監控
              </th>
              <th className="p-0 text-center align-middle text-base font-bold text-gray-900 uppercase tracking-wider">
                成交件數
              </th>
              <th className="p-0 text-center align-middle text-base font-bold text-gray-900 uppercase tracking-wider">
                建議加價
              </th>
              <th className="p-0 text-center align-middle text-base font-bold text-gray-900 uppercase tracking-wider">
                保証金
              </th>
              <th className="p-0 text-center align-middle text-base font-bold text-gray-900 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {auctionData.map((auction) => (
              <tr key={auction.id} className="hover:bg-gray-50">
                <td className="p-0 text-center align-middle text-base text-gray-900">
                  {auction.auctionType}
                </td>
                <td className="p-0 text-center align-middle text-base text-gray-900">
                  {auction.auctionDate}
                </td>
                <td className="p-0 text-center align-middle text-base">
                  <div className="text-gray-900">{auction.basePrice}</div>
                  {auction.suggestedPrices.length > 0 && (
                    <div className="mt-1 space-y-0.5">
                      {auction.suggestedPrices.map((price, index) => (
                        <div
                          key={index}
                          className="text-blue-600 underline text-sm"
                        >
                          {price}
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td className="p-0 text-center align-middle text-base text-gray-900">
                  {auction.pricePerPing}
                </td>
                <td className="p-0 text-center align-middle text-base">
                  <span className="text-gray-900">{auction.cp}</span>
                  <span className="text-green-600 ml-1">(建議進場)</span>
                </td>
                <td className="p-0 text-center align-middle text-base text-gray-900">
                  {auction.views}
                </td>
                <td className="p-0 text-center align-middle text-base text-gray-900">
                  {auction.monitor}
                </td>
                <td className="p-0 text-center align-middle text-base text-gray-900">
                  {auction.transactions}
                </td>
                <td className="p-0 text-center align-middle text-base">
                  <div className="space-y-0.5">
                    <div className="text-gray-700">
                      a = {auction.suggestedBidA}
                    </div>
                    <div className="text-gray-700">
                      b = {auction.suggestedBidB}
                    </div>
                    <div className="text-green-600 font-medium">
                      建議加價 : {auction.suggestedBid}
                    </div>
                  </div>
                </td>
                <td className="p-0 text-center align-middle text-base text-gray-900">
                  {auction.deposit}
                </td>
                <td className="p-0 text-center align-middle whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(auction.id)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FaEdit className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleDelete(auction.id)}
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

      {/* Footer Notes */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600 space-y-2">
        <div>
          <strong>成交件數：</strong>
          比較物件定義直徑2.5公里內/屋齡相近(10年)/最近一年成交件數
        </div>
        <div>
          <strong>a = 底價*(1+成交件數/4.5/100)</strong>
        </div>
        <div>
          <strong>b = 底價*((時價/坪價)/1.6)</strong>
        </div>
        <div>
          <strong>最多不得低於1.6(若a &gt; b,以b為加價依據,反之,則為a)</strong>
        </div>
      </div>
    </div>
  );
}

export default Auction;
