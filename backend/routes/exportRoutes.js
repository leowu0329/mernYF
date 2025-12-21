import express from 'express';
import multer from 'multer';
import XLSX from 'xlsx';
import User from '../models/User.js';
import City from '../models/City.js';
import Township from '../models/Township.js';
import Cases from '../models/Cases.js';
import { protect } from '../middleware/authMiddleware.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// 配置 multer 用于内存存储
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv', // .csv
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('不支援的檔案類型，請上傳 .xlsx, .xls 或 .csv 檔案'));
    }
  },
});

// @route   GET /api/export/users
// @desc    Export all users to Excel
// @access  Private
router.get('/users', protect, async (req, res) => {
  try {
    // 获取所有用户数据（排除密码字段）
    const users = await User.find({}).select('-password -verificationCode -resetPasswordToken');

    if (!users || users.length === 0) {
      return res.status(404).json({ message: '沒有找到用戶數據' });
    }

    // 准备 Excel 数据
    const excelData = users.map((user) => {
      return {
        'ID': user._id.toString(),
        '姓名': user.name || '',
        '電子郵件': user.email || '',
        '暱稱': user.nickname || '',
        '身份證字號': user.personalId || '',
        '電話': user.phone || '',
        '手機': user.mobile || '',
        '權限': user.role === 'guest' ? '訪客' : user.role === 'user' ? '一般使用者' : '管理者',
        '工作轄區': user.workArea === 'north' ? '雙北桃竹苗' : 
                   user.workArea === 'central' ? '中彰投' : 
                   user.workArea === 'south' ? '雲嘉南' : 
                   user.workArea === 'kaoping' ? '高高屏' : '',
        '身份類型': user.identityType === 'public' ? '公' : user.identityType === 'private' ? '私' : '',
        '生日': user.birthday ? new Date(user.birthday).toLocaleDateString('zh-TW') : '',
        '縣市': user.city || '',
        '區': user.district || '',
        '里': user.village || '',
        '鄰': user.neighbor || '',
        '街道': user.street || '',
        '段': user.section || '',
        '巷': user.lane || '',
        '弄': user.alley || '',
        '號': user.number || '',
        '樓層': user.floor || '',
        '已驗證': user.isVerified ? '是' : '否',
        '已登入': user.isLoggedIn ? '是' : '否',
        '建立時間': user.createdAt ? new Date(user.createdAt).toLocaleString('zh-TW') : '',
        '更新時間': user.updatedAt ? new Date(user.updatedAt).toLocaleString('zh-TW') : '',
      };
    });

    // 创建工作簿
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '使用者');

    // 设置列宽
    const columnWidths = [
      { wch: 30 }, // ID
      { wch: 15 }, // 姓名
      { wch: 25 }, // 電子郵件
      { wch: 15 }, // 暱稱
      { wch: 15 }, // 身份證字號
      { wch: 15 }, // 電話
      { wch: 15 }, // 手機
      { wch: 15 }, // 權限
      { wch: 15 }, // 工作轄區
      { wch: 12 }, // 身份類型
      { wch: 15 }, // 生日
      { wch: 12 }, // 縣市
      { wch: 12 }, // 區
      { wch: 12 }, // 里
      { wch: 10 }, // 鄰
      { wch: 20 }, // 街道
      { wch: 10 }, // 段
      { wch: 10 }, // 巷
      { wch: 10 }, // 弄
      { wch: 10 }, // 號
      { wch: 10 }, // 樓層
      { wch: 10 }, // 已驗證
      { wch: 10 }, // 已登入
      { wch: 20 }, // 建立時間
      { wch: 20 }, // 更新時間
    ];
    worksheet['!cols'] = columnWidths;

    // 生成 Excel 文件缓冲区
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx' 
    });

    // 设置响应头
    const fileName = `使用者資料_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);

    // 发送文件
    res.send(excelBuffer);
  } catch (error) {
    console.error('匯出錯誤:', error);
    res.status(500).json({ message: '匯出失敗', error: error.message });
  }
});

// @route   GET /api/export/cities
// @desc    Export all cities to Excel
// @access  Private
router.get('/cities', protect, async (req, res) => {
  try {
    // 获取所有城市数据
    const cities = await City.find({}).sort({ name: 1 });

    if (!cities || cities.length === 0) {
      return res.status(404).json({ message: '沒有找到城市數據' });
    }

    // 准备 Excel 数据
    const excelData = cities.map((city) => {
      return {
        'ID': city._id.toString(),
        '城市名稱': city.name || '',
        '建立時間': city.createdAt ? new Date(city.createdAt).toLocaleString('zh-TW') : '',
        '更新時間': city.updatedAt ? new Date(city.updatedAt).toLocaleString('zh-TW') : '',
      };
    });

    // 创建工作簿
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '縣市');

    // 设置列宽
    const columnWidths = [
      { wch: 30 }, // ID
      { wch: 20 }, // 城市名稱
      { wch: 20 }, // 建立時間
      { wch: 20 }, // 更新時間
    ];
    worksheet['!cols'] = columnWidths;

    // 生成 Excel 文件缓冲区
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx' 
    });

    // 设置响应头
    const fileName = `縣市資料_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);

    // 发送文件
    res.send(excelBuffer);
  } catch (error) {
    console.error('匯出錯誤:', error);
    res.status(500).json({ message: '匯出失敗', error: error.message });
  }
});

// @route   GET /api/export/townships
// @desc    Export all townships to Excel
// @access  Private
router.get('/townships', protect, async (req, res) => {
  try {
    // 获取所有乡镇里区数据（populate city 字段以获取城市名称）
    const townships = await Township.find({})
      .populate('city', 'name')
      .sort({ name: 1 });

    if (!townships || townships.length === 0) {
      return res.status(404).json({ message: '沒有找到鄉鎮里區數據' });
    }

    // 准备 Excel 数据
    const excelData = townships.map((township) => {
      return {
        'ID': township._id.toString(),
        '城市': township.city ? township.city.name : '',
        '城市ID': township.city ? township.city._id.toString() : '',
        '鄉鎮名稱': township.name || '',
        '郵遞區號': township.zipCode || '',
        '地方法院': township.districtCourt || '',
        '地政事務所': township.landOffice || '',
        '財政稅務局': township.financeAndTaxBureau || '',
        '警察局': township.policeStation || '',
        '國稅局': township.irs || '',
        '戶政事務所': township.homeOffice || '',
        '建立時間': township.createdAt ? new Date(township.createdAt).toLocaleString('zh-TW') : '',
        '更新時間': township.updatedAt ? new Date(township.updatedAt).toLocaleString('zh-TW') : '',
      };
    });

    // 创建工作簿
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '鄉鎮里區');

    // 设置列宽
    const columnWidths = [
      { wch: 30 }, // ID
      { wch: 15 }, // 城市
      { wch: 30 }, // 城市ID
      { wch: 20 }, // 鄉鎮名稱
      { wch: 12 }, // 郵遞區號
      { wch: 20 }, // 地方法院
      { wch: 20 }, // 地政事務所
      { wch: 20 }, // 財政稅務局
      { wch: 15 }, // 警察局
      { wch: 15 }, // 國稅局
      { wch: 20 }, // 戶政事務所
      { wch: 20 }, // 建立時間
      { wch: 20 }, // 更新時間
    ];
    worksheet['!cols'] = columnWidths;

    // 生成 Excel 文件缓冲区
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx' 
    });

    // 设置响应头
    const fileName = `鄉鎮里區資料_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);

    // 发送文件
    res.send(excelBuffer);
  } catch (error) {
    console.error('匯出錯誤:', error);
    res.status(500).json({ message: '匯出失敗', error: error.message });
  }
});

// @route   POST /api/export/cities/import
// @desc    Import cities from Excel file
// @access  Private
router.post('/cities/import', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '請選擇要匯入的檔案' });
    }

    // 解析 Excel 文件
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (!jsonData || jsonData.length === 0) {
      return res.status(400).json({ message: 'Excel 檔案中沒有數據' });
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [],
    };

    // 处理每一行数据
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      const rowNumber = i + 2; // Excel 行号（第1行是标题）

      try {
        // 映射 Excel 列名到 City 模型字段
        const cityName = (row['城市名稱'] || row['name'] || '').trim();

        // 验证必填字段
        if (!cityName) {
          results.failed++;
          results.errors.push(`第 ${rowNumber} 行: 缺少必填字段（城市名稱）`);
          continue;
        }

        // 验证城市名称长度
        if (cityName.length > 30) {
          results.failed++;
          results.errors.push(`第 ${rowNumber} 行: 城市名稱超過30個字符`);
          continue;
        }

        // 检查城市是否已存在（通过名称匹配）
        const existingCity = await City.findOne({ name: cityName });

        if (existingCity) {
          // 如果 Excel 中有 ID 字段且匹配，则更新
          const excelId = row['ID'] || row['_id'] || row['id'];
          if (excelId && existingCity._id.toString() === excelId.toString()) {
            // 更新城市数据（目前只有名称，所以不需要更新）
            // 但如果将来有更多字段，可以在这里更新
            results.success++;
          } else {
            // 城市名称已存在但 ID 不匹配，跳过或报错
            results.failed++;
            results.errors.push(`第 ${rowNumber} 行: 城市名稱 "${cityName}" 已存在`);
          }
        } else {
          // 创建新城市
          const newCity = new City({
            name: cityName,
          });

          await newCity.save();
          results.success++;
        }
      } catch (error) {
        results.failed++;
        if (error.code === 11000) {
          // MongoDB 唯一索引冲突
          results.errors.push(`第 ${rowNumber} 行: 城市名稱已存在`);
        } else {
          results.errors.push(`第 ${rowNumber} 行: ${error.message}`);
        }
      }
    }

    // 返回结果
    res.status(200).json({
      message: `匯入完成：成功 ${results.success} 筆，失敗 ${results.failed} 筆`,
      success: results.success,
      failed: results.failed,
      errors: results.errors.slice(0, 50), // 最多返回50个错误
    });
  } catch (error) {
    console.error('匯入錯誤:', error);
    res.status(500).json({ message: '匯入失敗', error: error.message });
  }
});

// @route   POST /api/export/townships/import
// @desc    Import townships from Excel file
// @access  Private
router.post('/townships/import', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '請選擇要匯入的檔案' });
    }

    // 解析 Excel 文件
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (!jsonData || jsonData.length === 0) {
      return res.status(400).json({ message: 'Excel 檔案中沒有數據' });
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [],
    };

    // 处理每一行数据
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      const rowNumber = i + 2; // Excel 行号（第1行是标题）

      try {
        // 映射 Excel 列名到 Township 模型字段（将值转换为字符串后再 trim）
        const townshipName = String(row['鄉鎮名稱'] || row['name'] || '').trim();
        const cityName = String(row['城市'] || row['city'] || '').trim();
        const cityId = String(row['城市ID'] || row['cityId'] || row['city_id'] || '').trim();

        // 验证必填字段
        if (!townshipName) {
          results.failed++;
          results.errors.push(`第 ${rowNumber} 行: 缺少必填字段（鄉鎮名稱）`);
          continue;
        }

        if (!cityName && !cityId) {
          results.failed++;
          results.errors.push(`第 ${rowNumber} 行: 缺少必填字段（城市或城市ID）`);
          continue;
        }

        // 验证乡镇名称长度
        if (townshipName.length > 30) {
          results.failed++;
          results.errors.push(`第 ${rowNumber} 行: 鄉鎮名稱超過30個字符`);
          continue;
        }

        // 查找城市
        let city = null;
        if (cityId) {
          // 通过城市ID查找
          try {
            city = await City.findById(cityId);
            if (!city) {
              results.failed++;
              results.errors.push(`第 ${rowNumber} 行: 找不到ID為 "${cityId}" 的城市`);
              continue;
            }
          } catch (error) {
            results.failed++;
            results.errors.push(`第 ${rowNumber} 行: 無效的城市ID格式`);
            continue;
          }
        } else if (cityName) {
          // 通过城市名称查找
          city = await City.findOne({ name: cityName });
          if (!city) {
            results.failed++;
            results.errors.push(`第 ${rowNumber} 行: 找不到名稱為 "${cityName}" 的城市，請先匯入該城市`);
            continue;
          }
        }

        // 准备乡镇数据（将值转换为字符串后再 trim）
        const townshipData = {
          city: city._id,
          name: townshipName,
          zipCode: String(row['郵遞區號'] || row['zipCode'] || row['zip_code'] || '').trim() || '',
          districtCourt: String(row['地方法院'] || row['districtCourt'] || row['district_court'] || '').trim() || '',
          landOffice: String(row['地政事務所'] || row['landOffice'] || row['land_office'] || '').trim() || '',
          financeAndTaxBureau: String(row['財政稅務局'] || row['financeAndTaxBureau'] || row['finance_and_tax_bureau'] || '').trim() || '',
          policeStation: String(row['警察局'] || row['policeStation'] || row['police_station'] || '').trim() || '',
          irs: String(row['國稅局'] || row['irs'] || '').trim() || '',
          homeOffice: String(row['戶政事務所'] || row['homeOffice'] || row['home_office'] || '').trim() || '',
        };

        // 验证字段长度
        const maxLengthFields = [
          { field: 'zipCode', name: '郵遞區號', maxLength: 30 },
          { field: 'districtCourt', name: '地方法院', maxLength: 30 },
          { field: 'landOffice', name: '地政事務所', maxLength: 30 },
          { field: 'financeAndTaxBureau', name: '財政稅務局', maxLength: 30 },
          { field: 'policeStation', name: '警察局', maxLength: 30 },
          { field: 'irs', name: '國稅局', maxLength: 30 },
          { field: 'homeOffice', name: '戶政事務所', maxLength: 30 },
        ];

        let hasLengthError = false;
        for (const fieldInfo of maxLengthFields) {
          if (townshipData[fieldInfo.field].length > fieldInfo.maxLength) {
            results.failed++;
            results.errors.push(`第 ${rowNumber} 行: ${fieldInfo.name}超過${fieldInfo.maxLength}個字符`);
            hasLengthError = true;
            break;
          }
        }

        if (hasLengthError) {
          continue;
        }

        // 检查乡镇是否已存在（通过城市和名称组合）
        const existingTownship = await Township.findOne({
          city: city._id,
          name: townshipName,
        });

        if (existingTownship) {
          // 如果 Excel 中有 ID 字段且匹配，则更新
          const excelId = row['ID'] || row['_id'] || row['id'];
          if (excelId && existingTownship._id.toString() === excelId.toString()) {
            // 更新乡镇数据
            Object.keys(townshipData).forEach((key) => {
              if (townshipData[key] !== undefined && townshipData[key] !== null && townshipData[key] !== '') {
                existingTownship[key] = townshipData[key];
              }
            });
            await existingTownship.save();
            results.success++;
          } else {
            // 乡镇已存在但 ID 不匹配，跳过或报错
            results.failed++;
            results.errors.push(`第 ${rowNumber} 行: 城市 "${cityName}" 下的鄉鎮名稱 "${townshipName}" 已存在`);
          }
        } else {
          // 创建新乡镇
          const newTownship = new Township(townshipData);
          await newTownship.save();
          results.success++;
        }
      } catch (error) {
        results.failed++;
        if (error.code === 11000) {
          // MongoDB 唯一索引冲突
          results.errors.push(`第 ${rowNumber} 行: 鄉鎮名稱已存在`);
        } else {
          results.errors.push(`第 ${rowNumber} 行: ${error.message}`);
        }
      }
    }

    // 返回结果
    res.status(200).json({
      message: `匯入完成：成功 ${results.success} 筆，失敗 ${results.failed} 筆`,
      success: results.success,
      failed: results.failed,
      errors: results.errors.slice(0, 50), // 最多返回50个错误
    });
  } catch (error) {
    console.error('匯入錯誤:', error);
    res.status(500).json({ message: '匯入失敗', error: error.message });
  }
});

// @route   POST /api/export/users/import
// @desc    Import users from Excel file
// @access  Private
router.post('/users/import', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '請選擇要匯入的檔案' });
    }

    // 解析 Excel 文件
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (!jsonData || jsonData.length === 0) {
      return res.status(400).json({ message: 'Excel 檔案中沒有數據' });
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [],
    };

    // 处理每一行数据
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      const rowNumber = i + 2; // Excel 行号（第1行是标题）

      try {
        // 映射 Excel 列名到 User 模型字段
        const userData = {
          name: row['姓名'] || row['name'] || '',
          email: (row['電子郵件'] || row['email'] || '').toLowerCase().trim(),
          nickname: row['暱稱'] || row['nickname'] || '',
          personalId: row['身份證字號'] || row['personalId'] || null,
          phone: row['電話'] || row['phone'] || null,
          mobile: row['手機'] || row['mobile'] || null,
          city: row['縣市'] || row['city'] || null,
          district: row['區'] || row['district'] || null,
          village: row['里'] || row['village'] || null,
          neighbor: row['鄰'] || row['neighbor'] || null,
          street: row['街道'] || row['street'] || null,
          section: row['段'] || row['section'] || null,
          lane: row['巷'] || row['lane'] || null,
          alley: row['弄'] || row['alley'] || null,
          number: row['號'] || row['number'] || null,
          floor: row['樓層'] || row['floor'] || null,
        };

        // 验证必填字段
        if (!userData.name || !userData.email) {
          results.failed++;
          results.errors.push(`第 ${rowNumber} 行: 缺少必填字段（姓名或電子郵件）`);
          continue;
        }

        // 验证邮箱格式
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(userData.email)) {
          results.failed++;
          results.errors.push(`第 ${rowNumber} 行: 無效的電子郵件格式`);
          continue;
        }

        // 映射权限
        const roleMap = {
          '訪客': 'guest',
          '一般使用者': 'user',
          '管理者': 'admin',
          'guest': 'guest',
          'user': 'user',
          'admin': 'admin',
        };
        const roleText = row['權限'] || row['role'] || 'user';
        userData.role = roleMap[roleText] || 'user';

        // 映射工作辖区
        const workAreaMap = {
          '雙北桃竹苗': 'north',
          '中彰投': 'central',
          '雲嘉南': 'south',
          '高高屏': 'kaoping',
          'north': 'north',
          'central': 'central',
          'south': 'south',
          'kaoping': 'kaoping',
        };
        const workAreaText = row['工作轄區'] || row['workArea'] || null;
        userData.workArea = workAreaText ? (workAreaMap[workAreaText] || null) : null;

        // 映射身份类型
        const identityTypeMap = {
          '公': 'public',
          '私': 'private',
          'public': 'public',
          'private': 'private',
        };
        const identityTypeText = row['身份類型'] || row['identityType'] || null;
        userData.identityType = identityTypeText ? (identityTypeMap[identityTypeText] || null) : null;

        // 处理生日
        if (row['生日'] || row['birthday']) {
          const birthdayStr = row['生日'] || row['birthday'];
          if (birthdayStr) {
            const birthdayDate = new Date(birthdayStr);
            if (!isNaN(birthdayDate.getTime())) {
              userData.birthday = birthdayDate;
            }
          }
        }

        // 处理已验证和已登入状态
        const isVerifiedText = row['已驗證'] || row['isVerified'] || '否';
        userData.isVerified = isVerifiedText === '是' || isVerifiedText === true || isVerifiedText === 'true';
        const isLoggedInText = row['已登入'] || row['isLoggedIn'] || '否';
        userData.isLoggedIn = isLoggedInText === '是' || isLoggedInText === true || isLoggedInText === 'true';

        // 检查用户是否已存在（通过 email）
        const existingUser = await User.findOne({ email: userData.email });

        if (existingUser) {
          // 更新现有用户
          // 如果 Excel 中有 ID 字段且匹配，则更新
          const excelId = row['ID'] || row['_id'] || row['id'];
          if (excelId && existingUser._id.toString() === excelId.toString()) {
            // 更新用户数据（不更新密码）
            Object.keys(userData).forEach((key) => {
              if (userData[key] !== undefined && userData[key] !== null && userData[key] !== '') {
                existingUser[key] = userData[key];
              }
            });
            await existingUser.save();
            results.success++;
          } else {
            // Email 已存在但 ID 不匹配，跳过或报错
            results.failed++;
            results.errors.push(`第 ${rowNumber} 行: 電子郵件 ${userData.email} 已存在`);
          }
        } else {
          // 创建新用户
          // 生成默认密码（如果 Excel 中没有密码字段）
          const defaultPassword = '123456'; // 默认密码，建议用户首次登录后修改
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(defaultPassword, salt);

          const newUser = new User({
            ...userData,
            password: hashedPassword,
          });

          await newUser.save();
          results.success++;
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`第 ${rowNumber} 行: ${error.message}`);
      }
    }

    // 返回结果
    res.status(200).json({
      message: `匯入完成：成功 ${results.success} 筆，失敗 ${results.failed} 筆`,
      success: results.success,
      failed: results.failed,
      errors: results.errors.slice(0, 50), // 最多返回50个错误
    });
  } catch (error) {
    console.error('匯入錯誤:', error);
    res.status(500).json({ message: '匯入失敗', error: error.message });
  }
});

// @route   GET /api/export/cases
// @desc    Export all cases to Excel
// @access  Private
router.get('/cases', protect, async (req, res) => {
  try {
    // 获取所有案件数据（populate 关联字段）
    const cases = await Cases.find({})
      .populate('city', 'name')
      .populate('township', 'name')
      .populate('user', 'name email nickname')
      .sort({ createdAt: -1 });

    if (!cases || cases.length === 0) {
      return res.status(404).json({ message: '沒有找到案件數據' });
    }

    // 准备 Excel 数据
    const excelData = cases.map((caseItem) => {
      return {
        'ID': caseItem._id.toString(),
        '案號': caseItem.caseNumber || '',
        '公司': caseItem.company || '',
        '城市': caseItem.city ? caseItem.city.name : '',
        '城市ID': caseItem.city ? caseItem.city._id.toString() : '',
        '鄉鎮里區': caseItem.township ? caseItem.township.name : '',
        '鄉鎮里區ID': caseItem.township ? caseItem.township._id.toString() : '',
        '大段': caseItem.bigSection || '',
        '小段': caseItem.smallSection || '',
        '里': caseItem.village || '',
        '鄰': caseItem.neighbor || '',
        '街道': caseItem.street || '',
        '段': caseItem.section || '',
        '巷': caseItem.lane || '',
        '弄': caseItem.alley || '',
        '號': caseItem.number || '',
        '樓層': caseItem.floor || '',
        '狀態': caseItem.status || '',
        '負責人': caseItem.user ? (caseItem.user.nickname || caseItem.user.name) : '',
        '負責人ID': caseItem.user ? caseItem.user._id.toString() : '',
        '負責人Email': caseItem.user ? caseItem.user.email : '',
        '建立時間': caseItem.createdAt ? new Date(caseItem.createdAt).toLocaleString('zh-TW') : '',
        '更新時間': caseItem.updatedAt ? new Date(caseItem.updatedAt).toLocaleString('zh-TW') : '',
      };
    });

    // 创建工作簿
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '基本資訊');

    // 设置列宽
    const columnWidths = [
      { wch: 30 }, // ID
      { wch: 30 }, // 案號
      { wch: 20 }, // 公司
      { wch: 15 }, // 城市
      { wch: 30 }, // 城市ID
      { wch: 20 }, // 鄉鎮里區
      { wch: 30 }, // 鄉鎮里區ID
      { wch: 10 }, // 大段
      { wch: 10 }, // 小段
      { wch: 15 }, // 里
      { wch: 10 }, // 鄰
      { wch: 20 }, // 街道
      { wch: 10 }, // 段
      { wch: 10 }, // 巷
      { wch: 10 }, // 弄
      { wch: 10 }, // 號
      { wch: 10 }, // 樓層
      { wch: 10 }, // 狀態
      { wch: 15 }, // 負責人
      { wch: 30 }, // 負責人ID
      { wch: 25 }, // 負責人Email
      { wch: 20 }, // 建立時間
      { wch: 20 }, // 更新時間
    ];
    worksheet['!cols'] = columnWidths;

    // 生成 Excel 文件缓冲区
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx' 
    });

    // 设置响应头
    const fileName = `基本資訊資料_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);

    // 发送文件
    res.send(excelBuffer);
  } catch (error) {
    console.error('匯出錯誤:', error);
    res.status(500).json({ message: '匯出失敗', error: error.message });
  }
});

// @route   POST /api/export/cases/import
// @desc    Import cases from Excel file
// @access  Private
router.post('/cases/import', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '請選擇要匯入的檔案' });
    }

    // 解析 Excel 文件
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (!jsonData || jsonData.length === 0) {
      return res.status(400).json({ message: 'Excel 檔案中沒有數據' });
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [],
    };

    // 处理每一行数据
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      const rowNumber = i + 2; // Excel 行号（第1行是标题）

      try {
        // 映射 Excel 列名到 Cases 模型字段
        const caseNumber = String(row['案號'] || row['caseNumber'] || '').trim();
        const company = String(row['公司'] || row['company'] || '').trim() || null;
        const status = String(row['狀態'] || row['status'] || '').trim() || null;

        // 验证必填字段
        if (!caseNumber) {
          results.failed++;
          results.errors.push(`第 ${rowNumber} 行: 缺少必填字段（案號）`);
          continue;
        }

        // 查找城市
        let city = null;
        const cityName = String(row['城市'] || row['city'] || '').trim();
        const cityId = String(row['城市ID'] || row['cityId'] || row['city_id'] || '').trim();
        
        if (cityId) {
          try {
            city = await City.findById(cityId);
            if (!city) {
              results.failed++;
              results.errors.push(`第 ${rowNumber} 行: 找不到ID為 "${cityId}" 的城市`);
              continue;
            }
          } catch (error) {
            results.failed++;
            results.errors.push(`第 ${rowNumber} 行: 無效的城市ID格式`);
            continue;
          }
        } else if (cityName) {
          city = await City.findOne({ name: cityName });
          if (!city) {
            results.failed++;
            results.errors.push(`第 ${rowNumber} 行: 找不到名稱為 "${cityName}" 的城市`);
            continue;
          }
        }

        // 查找乡镇
        let township = null;
        const townshipName = String(row['鄉鎮里區'] || row['township'] || '').trim();
        const townshipId = String(row['鄉鎮里區ID'] || row['townshipId'] || row['township_id'] || '').trim();
        
        if (townshipId) {
          try {
            township = await Township.findById(townshipId);
            if (!township) {
              results.failed++;
              results.errors.push(`第 ${rowNumber} 行: 找不到ID為 "${townshipId}" 的鄉鎮`);
              continue;
            }
            // 如果提供了乡镇但没有提供城市，使用乡镇关联的城市
            if (!city && township.city) {
              city = await City.findById(township.city);
            }
          } catch (error) {
            results.failed++;
            results.errors.push(`第 ${rowNumber} 行: 無效的鄉鎮ID格式`);
            continue;
          }
        } else if (townshipName) {
          const townshipQuery = city ? { name: townshipName, city: city._id } : { name: townshipName };
          township = await Township.findOne(townshipQuery);
          if (!township) {
            results.failed++;
            results.errors.push(`第 ${rowNumber} 行: 找不到名稱為 "${townshipName}" 的鄉鎮`);
            continue;
          }
          if (!city && township.city) {
            city = await City.findById(township.city);
          }
        }

        // 查找负责人（用户）
        let user = null;
        const userName = String(row['負責人'] || row['user'] || row['responsiblePerson'] || '').trim();
        const userEmail = String(row['負責人Email'] || row['userEmail'] || row['email'] || '').trim();
        const userId = String(row['負責人ID'] || row['userId'] || row['user_id'] || '').trim();
        
        if (userId) {
          try {
            user = await User.findById(userId);
            if (!user) {
              results.failed++;
              results.errors.push(`第 ${rowNumber} 行: 找不到ID為 "${userId}" 的負責人`);
              continue;
            }
          } catch (error) {
            results.failed++;
            results.errors.push(`第 ${rowNumber} 行: 無效的負責人ID格式`);
            continue;
          }
        } else if (userEmail) {
          user = await User.findOne({ email: userEmail });
          if (!user) {
            results.failed++;
            results.errors.push(`第 ${rowNumber} 行: 找不到Email為 "${userEmail}" 的負責人`);
            continue;
          }
        } else if (userName) {
          user = await User.findOne({ name: userName });
          if (!user) {
            results.failed++;
            results.errors.push(`第 ${rowNumber} 行: 找不到名稱為 "${userName}" 的負責人`);
            continue;
          }
        } else {
          // 如果没有指定负责人，使用当前登录用户
          user = req.user;
        }

        // 准备案件数据
        const caseData = {
          caseNumber,
          company: company || null,
          city: city ? city._id : null,
          township: township ? township._id : null,
          bigSection: String(row['大段'] || row['bigSection'] || '').trim() || null,
          smallSection: String(row['小段'] || row['smallSection'] || '').trim() || null,
          village: String(row['里'] || row['village'] || '').trim() || null,
          neighbor: String(row['鄰'] || row['neighbor'] || '').trim() || null,
          street: String(row['街道'] || row['street'] || '').trim() || null,
          section: String(row['段'] || row['section'] || '').trim() || null,
          lane: String(row['巷'] || row['lane'] || '').trim() || null,
          alley: String(row['弄'] || row['alley'] || '').trim() || null,
          number: String(row['號'] || row['number'] || '').trim() || null,
          floor: String(row['樓層'] || row['floor'] || '').trim() || null,
          status: status || null,
          user: user._id,
        };

        // 验证字段长度
        const maxLengthFields = [
          { field: 'caseNumber', name: '案號', maxLength: 100 },
          { field: 'company', name: '公司', maxLength: 50 },
          { field: 'bigSection', name: '大段', maxLength: 10 },
          { field: 'smallSection', name: '小段', maxLength: 10 },
          { field: 'village', name: '里', maxLength: 100 },
          { field: 'neighbor', name: '鄰', maxLength: 100 },
          { field: 'street', name: '街道', maxLength: 100 },
          { field: 'section', name: '段', maxLength: 100 },
          { field: 'lane', name: '巷', maxLength: 100 },
          { field: 'alley', name: '弄', maxLength: 100 },
          { field: 'number', name: '號', maxLength: 100 },
          { field: 'floor', name: '樓層', maxLength: 100 },
          { field: 'status', name: '狀態', maxLength: 10 },
        ];

        let hasLengthError = false;
        for (const fieldInfo of maxLengthFields) {
          if (caseData[fieldInfo.field] && caseData[fieldInfo.field].length > fieldInfo.maxLength) {
            results.failed++;
            results.errors.push(`第 ${rowNumber} 行: ${fieldInfo.name}超過${fieldInfo.maxLength}個字符`);
            hasLengthError = true;
            break;
          }
        }

        if (hasLengthError) {
          continue;
        }

        // 检查案件是否已存在（通过案號匹配）
        const existingCase = await Cases.findOne({ caseNumber });

        if (existingCase) {
          // 如果 Excel 中有 ID 字段且匹配，则更新
          const excelId = row['ID'] || row['_id'] || row['id'];
          if (excelId && existingCase._id.toString() === String(excelId).trim()) {
            // 更新案件数据
            Object.keys(caseData).forEach((key) => {
              if (caseData[key] !== undefined && caseData[key] !== null && caseData[key] !== '') {
                existingCase[key] = caseData[key];
              }
            });
            await existingCase.save();
            results.success++;
          } else {
            // 案件已存在但 ID 不匹配，跳过或报错
            results.failed++;
            results.errors.push(`第 ${rowNumber} 行: 案號 "${caseNumber}" 已存在`);
          }
        } else {
          // 创建新案件
          const newCase = new Cases(caseData);
          await newCase.save();
          results.success++;
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`第 ${rowNumber} 行: ${error.message}`);
      }
    }

    // 返回结果
    res.status(200).json({
      message: `匯入完成：成功 ${results.success} 筆，失敗 ${results.failed} 筆`,
      success: results.success,
      failed: results.failed,
      errors: results.errors.slice(0, 50), // 最多返回50个错误
    });
  } catch (error) {
    console.error('匯入錯誤:', error);
    res.status(500).json({ message: '匯入失敗', error: error.message });
  }
});

export default router;

