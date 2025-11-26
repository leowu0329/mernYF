import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import {
  FaUserEdit,
  FaPhoneAlt,
  FaMapMarkedAlt,
  FaShieldAlt,
  FaBirthdayCake,
} from "react-icons/fa";

const roleLabels = {
  user: "一般使用者",
  manager: "管理員",
  admin: "系統管理者",
};

function Profile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    workArea: "",
    role: "user",
    birthday: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        workArea: user.workArea || "",
        role: user.role || "user",
        birthday: user.birthday ? user.birthday.slice(0, 10) : "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(formData);
      toast.success("個人資料已更新");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "更新失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-indigo-50 to-violet-50"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>

      <Navbar />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_25px_70px_-12px_rgba(79,70,229,0.3)] border border-white/40 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <FaUserEdit className="text-white text-2xl" />
            </div>
            <div>
              <p className="text-sm font-semibold text-indigo-500 tracking-wide uppercase">
                Profile
              </p>
              <h1 className="text-3xl font-extrabold text-gray-900">
                修改個人訊息
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                更新您的基本資料與聯絡資訊
              </p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="name"
              >
                姓名
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-500">
                  <FaUserEdit />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-gray-200 bg-gray-50/70 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                  placeholder="請輸入您的姓名"
                />
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="phone"
              >
                手機
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-500">
                  <FaPhoneAlt />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-gray-200 bg-gray-50/70 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                  placeholder="請輸入手機號碼"
                />
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="workArea"
              >
                工作轄區
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-500">
                  <FaMapMarkedAlt />
                </div>
                <input
                  id="workArea"
                  name="workArea"
                  type="text"
                  value={formData.workArea}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-gray-200 bg-gray-50/70 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                  placeholder="請輸入主要負責區域"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="role"
                >
                  權限
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-500">
                    <FaShieldAlt />
                  </div>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-gray-200 bg-gray-50/70 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                  >
                    {Object.entries(roleLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="birthday"
                >
                  生日
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-500">
                    <FaBirthdayCake />
                  </div>
                  <input
                    id="birthday"
                    name="birthday"
                    type="date"
                    value={formData.birthday}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-gray-200 bg-gray-50/70 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500/60 transition transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {loading ? "儲存中..." : "儲存變更"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
