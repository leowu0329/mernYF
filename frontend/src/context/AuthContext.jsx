import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

// 獲取 API URL，如果未設置則使用默認值
const getApiUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL
  if (!apiUrl) {
    console.error('VITE_API_URL 環境變量未設置！請在 Vercel 環境變量中設置。')
    // 生產環境默認值（需要替換為實際的後端 URL）
    return 'https://your-backend-url.railway.app/api'
  }
  return apiUrl
}

const API_URL = getApiUrl()

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // 验证token并获取用户信息
      verifyToken()
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await axios.get(`${API_URL}/auth/verify`)
      setUser(response.data.user)
    } catch (error) {
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    })
    const { token, user } = response.data
    localStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(user)
    return response.data
  }

  const register = async (name, email, password) => {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password
    })
    return response.data
  }

  const verifyEmail = async (email, verificationCode) => {
    const response = await axios.post(`${API_URL}/auth/verify-email`, {
      email,
      verificationCode
    })
    return response.data
  }

  const logout = async () => {
    try {
      // Call backend logout endpoint to update isLoggedIn status
      await axios.post(`${API_URL}/auth/logout`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error)
    } finally {
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      setUser(null)
    }
  }

  const forgotPassword = async (email) => {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, {
      email
    })
    return response.data
  }

  const resetPassword = async (token, newPassword, confirmPassword) => {
    const response = await axios.post(`${API_URL}/auth/reset-password`, {
      token,
      newPassword,
      confirmPassword
    })
    return response.data
  }

  const updateProfile = async (profileData) => {
    const response = await axios.put(`${API_URL}/auth/profile`, profileData)
    setUser(response.data.user)
    return response.data
  }

  const verifyResetToken = async (token) => {
    const response = await axios.get(`${API_URL}/auth/verify-reset-token`, {
      params: { token }
    })
    return response.data
  }

  const changePassword = async (currentPassword, newPassword, confirmPassword) => {
    const response = await axios.put(`${API_URL}/auth/change-password`, {
      currentPassword,
      newPassword,
      confirmPassword
    })
    return response.data
  }

  const value = {
    user,
    loading,
    login,
    register,
    verifyEmail,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    verifyResetToken,
    changePassword
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
