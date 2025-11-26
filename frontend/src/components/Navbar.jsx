import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import {
  FaSignOutAlt,
  FaKey,
  FaExclamationTriangle,
  FaTachometerAlt,
} from "react-icons/fa";

function Navbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    toast.success("已成功登出");
    navigate("/login");
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  const handleResetPassword = () => {
    navigate("/change-password");
  };

  return (
    <>
      <nav className="w-full bg-white/95 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(99,102,241,0.35)] border-b border-white/40 px-8 py-5 sticky top-0 left-0 z-30">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <FaTachometerAlt className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              儀表板導航
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate("/profile")}
              className="px-5 py-2.5 rounded-2xl border-2 border-indigo-200 text-indigo-600 font-semibold bg-indigo-50/80 hover:bg-indigo-100 transition-all duration-200"
            >
              修改個人訊息
            </button>
            <button
              onClick={handleResetPassword}
              className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-2xl hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500/50 transform transition-all duration-300 hover:shadow-[0_10px_30px_-5px_rgba(245,158,11,0.4)] active:scale-95"
            >
              <FaKey className="transition-transform duration-300 group-hover:rotate-12" />
              <span className="font-semibold">重設密碼</span>
            </button>
            <button
              onClick={handleLogoutClick}
              className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 via-rose-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:via-rose-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500/50 transform transition-all duration-300 hover:shadow-[0_10px_30px_-5px_rgba(239,68,68,0.4)] active:scale-95"
            >
              <FaSignOutAlt className="transition-transform duration-300 group-hover:rotate-12" />
              <span className="font-semibold">登出</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 登出确认对话框 */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-[0_25px_70px_-12px_rgba(0,0,0,0.5)] max-w-md w-full p-6 transform transition-all animate-in zoom-in-95 duration-300">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <FaExclamationTriangle className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                確認登出
              </h3>
              <p className="text-gray-600">您確定要登出嗎？</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleLogoutCancel}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 font-semibold transition-all duration-200"
              >
                取消
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                確定登出
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
