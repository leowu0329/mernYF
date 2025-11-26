import { useAuth } from "../context/AuthContext";
import { FaUser } from "react-icons/fa";
import Navbar from "../components/Navbar";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>

      {/* 导航列 */}
      <Navbar />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* 用户信息卡片 */}
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-[0_20px_60px_-12px_rgba(99,102,241,0.5)] p-8 mb-6 text-white transform transition-all duration-500 hover:shadow-[0_25px_70px_-12px_rgba(139,92,246,0.6)] hover:scale-[1.01] hover:-translate-y-1">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-xl">
              <FaUser className="text-white text-5xl" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">歡迎回來！</h2>
              <p className="text-indigo-100 text-lg mb-6">您已成功登入系統</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-sm text-indigo-100 mb-1">姓名</p>
                  <p className="text-xl font-semibold">{user?.name}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-sm text-indigo-100 mb-1">電子郵件</p>
                  <p className="text-xl font-semibold break-all">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 信息卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.15)] p-6 border border-white/30 transform transition-all duration-300 hover:shadow-[0_15px_40px_-5px_rgba(34,197,94,0.2)] hover:-translate-y-2 hover:scale-[1.02]">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 rounded-xl p-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">帳戶狀態</h3>
            </div>
            <p className="text-gray-600 font-medium">已驗證</p>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">帳戶已激活</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.15)] p-6 border border-white/30 transform transition-all duration-300 hover:shadow-[0_15px_40px_-5px_rgba(59,130,246,0.2)] hover:-translate-y-2 hover:scale-[1.02]">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 rounded-xl p-3">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">註冊時間</h3>
            </div>
            <p className="text-gray-600 font-medium">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("zh-TW", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </p>
            <div className="mt-4 text-sm text-gray-500">
              成為會員已經一段時間了
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
