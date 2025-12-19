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
  FaEnvelope,
  FaIdCard,
  FaMobileAlt,
  FaHome,
  FaUser,
  FaSave,
} from "react-icons/fa";

const roleLabels = {
  guest: "訪客",
  user: "一般使用者",
  admin: "管理者",
};

const workAreaLabels = {
  north: "雙北桃竹苗",
  central: "中彰投",
  south: "雲嘉南",
  kaoping: "高高屏",
};

const identityTypeLabels = {
  public: "公",
  private: "私",
};

function Profile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("基本");
  const [formData, setFormData] = useState({
    // 基本資料
    name: "",
    email: "",
    nickname: "",
    personalId: "",
    phone: "",
    mobile: "",
    role: "user",
    workArea: "",
    identityType: "",
    birthday: "",
    // 進階資料
    city: "",
    district: "",
    village: "",
    neighbor: "",
    street: "",
    section: "",
    lane: "",
    alley: "",
    number: "",
    floor: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        nickname: user.nickname || "",
        personalId: user.personalId || "",
        phone: user.phone || "",
        mobile: user.mobile || "",
        role: user.role || "user",
        workArea: user.workArea || "",
        identityType: user.identityType || "",
        birthday: user.birthday ? user.birthday.slice(0, 10) : "",
        city: user.city || "",
        district: user.district || "",
        village: user.village || "",
        neighbor: user.neighbor || "",
        street: user.street || "",
        section: user.section || "",
        lane: user.lane || "",
        alley: user.alley || "",
        number: user.number || "",
        floor: user.floor || "",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaUser className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">個人資料</h1>
              <p className="text-gray-500 mt-1">管理您的個人資訊與設定</p>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("基本")}
                className={`flex-1 py-4 px-6 text-base font-semibold transition-all duration-200 ${
                  activeTab === "基本"
                    ? "bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <FaUserEdit className={activeTab === "基本" ? "text-blue-600" : "text-gray-400"} />
                  <span>基本</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("進階")}
                className={`flex-1 py-4 px-6 text-base font-semibold transition-all duration-200 ${
                  activeTab === "進階"
                    ? "bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <FaHome className={activeTab === "進階" ? "text-blue-600" : "text-gray-400"} />
                  <span>進階</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            {/* 基本 Tab */}
            {activeTab === "基本" && (
              <div className="space-y-8">
                {/* Personal Information Section */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                    個人資訊
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-base font-semibold text-gray-700 mb-2"
                        htmlFor="name"
                      >
                        姓名 <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-500">
                          <FaUserEdit />
                        </div>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                          placeholder="請輸入姓名"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-base font-semibold text-gray-700 mb-2"
                        htmlFor="email"
                      >
                        電子郵件 <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-500">
                          <FaEnvelope />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                          placeholder="請輸入電子郵件"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-base font-semibold text-gray-700 mb-2"
                        htmlFor="nickname"
                      >
                        暱稱
                      </label>
                      <input
                        id="nickname"
                        name="nickname"
                        type="text"
                        value={formData.nickname}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                        placeholder="請輸入暱稱"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-base font-semibold text-gray-700 mb-2"
                        htmlFor="personalId"
                      >
                        身份證字號
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-500">
                          <FaIdCard />
                        </div>
                        <input
                          id="personalId"
                          name="personalId"
                          type="text"
                          value={formData.personalId}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                          placeholder="請輸入身份證字號"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-base font-semibold text-gray-700 mb-2"
                        htmlFor="birthday"
                      >
                        生日
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-500">
                          <FaBirthdayCake />
                        </div>
                        <input
                          id="birthday"
                          name="birthday"
                          type="date"
                          value={formData.birthday}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                    聯絡資訊
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-base font-semibold text-gray-700 mb-2"
                        htmlFor="phone"
                      >
                        電話
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-500">
                          <FaPhoneAlt />
                        </div>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                          placeholder="請輸入電話"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-base font-semibold text-gray-700 mb-2"
                        htmlFor="mobile"
                      >
                        手機
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-500">
                          <FaMobileAlt />
                        </div>
                        <input
                          id="mobile"
                          name="mobile"
                          type="tel"
                          value={formData.mobile}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                          placeholder="請輸入手機號碼"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Work Information Section */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                    工作資訊
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-base font-semibold text-gray-700 mb-2"
                        htmlFor="role"
                      >
                        角色
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-500">
                          <FaShieldAlt />
                        </div>
                        <select
                          id="role"
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white appearance-none cursor-pointer"
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
                        className="block text-base font-semibold text-gray-700 mb-2"
                        htmlFor="workArea"
                      >
                        工作轄區
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-500">
                          <FaMapMarkedAlt />
                        </div>
                        <select
                          id="workArea"
                          name="workArea"
                          value={formData.workArea}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white appearance-none cursor-pointer"
                        >
                          <option value="">請選擇</option>
                          {Object.entries(workAreaLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-base font-semibold text-gray-700 mb-2"
                        htmlFor="identityType"
                      >
                        身份類型
                      </label>
                      <select
                        id="identityType"
                        name="identityType"
                        value={formData.identityType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white appearance-none cursor-pointer"
                      >
                        <option value="">請選擇</option>
                        {Object.entries(identityTypeLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 進階 Tab */}
            {activeTab === "進階" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                    地址資訊
                  </h2>
                  
                  {/* City and District */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label
                        className="block text-base font-semibold text-gray-700 mb-2"
                        htmlFor="city"
                      >
                        城市
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                        placeholder="請輸入城市"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-base font-semibold text-gray-700 mb-2"
                        htmlFor="district"
                      >
                        區
                      </label>
                      <input
                        id="district"
                        name="district"
                        type="text"
                        value={formData.district}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                        placeholder="請輸入區"
                      />
                    </div>
                  </div>

                  {/* Village and Neighbor */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label
                        className="block text-base font-semibold text-gray-700 mb-2"
                        htmlFor="village"
                      >
                        里
                      </label>
                      <input
                        id="village"
                        name="village"
                        type="text"
                        value={formData.village}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                        placeholder="請輸入里"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-base font-semibold text-gray-700 mb-2"
                        htmlFor="neighbor"
                      >
                        鄰
                      </label>
                      <input
                        id="neighbor"
                        name="neighbor"
                        type="text"
                        value={formData.neighbor}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                        placeholder="請輸入鄰"
                      />
                    </div>
                  </div>

                  {/* Street */}
                  <div className="mb-6">
                    <label
                      className="block text-base font-semibold text-gray-700 mb-2"
                      htmlFor="street"
                    >
                      街道
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-500">
                        <FaHome />
                      </div>
                      <input
                        id="street"
                        name="street"
                        type="text"
                        value={formData.street}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                        placeholder="請輸入街道"
                      />
                    </div>
                  </div>

                  {/* Section and Lane */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label
                        className="block text-base font-semibold text-gray-700 mb-2"
                        htmlFor="section"
                      >
                        段
                      </label>
                      <input
                        id="section"
                        name="section"
                        type="text"
                        value={formData.section}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                        placeholder="請輸入段"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-base font-semibold text-gray-700 mb-2"
                        htmlFor="lane"
                      >
                        巷
                      </label>
                      <input
                        id="lane"
                        name="lane"
                        type="text"
                        value={formData.lane}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                        placeholder="請輸入巷"
                      />
                    </div>
                  </div>

                  {/* Alley and Number */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label
                        className="block text-base font-semibold text-gray-700 mb-2"
                        htmlFor="alley"
                      >
                        弄
                      </label>
                      <input
                        id="alley"
                        name="alley"
                        type="text"
                        value={formData.alley}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                        placeholder="請輸入弄"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-base font-semibold text-gray-700 mb-2"
                        htmlFor="number"
                      >
                        號
                      </label>
                      <input
                        id="number"
                        name="number"
                        type="text"
                        value={formData.number}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                        placeholder="請輸入號"
                      />
                    </div>
                  </div>

                  {/* Floor */}
                  <div>
                    <label
                      className="block text-base font-semibold text-gray-700 mb-2"
                      htmlFor="floor"
                    >
                      樓層
                    </label>
                    <input
                      id="floor"
                      name="floor"
                      type="text"
                      value={formData.floor}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                      placeholder="請輸入樓層"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-8 mt-8 border-t border-gray-200 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all font-semibold"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl font-semibold flex items-center gap-2"
              >
                <FaSave />
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
