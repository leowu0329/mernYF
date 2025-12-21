import express from 'express';
import Cases from '../models/Cases.js';
import City from '../models/City.js';
import Township from '../models/Township.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/cases
// @desc    Create a new case
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      caseNumber,
      company,
      cityId,
      townshipId,
      bigSection,
      smallSection,
      village,
      neighbor,
      street,
      section,
      lane,
      alley,
      number,
      floor,
      status,
      userId,
    } = req.body;

    // 验证必填字段
    if (!caseNumber) {
      return res.status(400).json({ message: '請輸入案號' });
    }

    // 验证用户（负责人）
    let user = null;
    if (userId) {
      user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ message: '找不到指定的負責人' });
      }
    } else {
      // 如果没有指定用户，使用当前登录用户
      user = req.user;
    }

    // 验证城市（如果提供）
    let city = null;
    if (cityId) {
      city = await City.findById(cityId);
      if (!city) {
        return res.status(400).json({ message: '找不到指定的城市' });
      }
    }

    // 验证乡镇（如果提供）
    let township = null;
    if (townshipId) {
      township = await Township.findById(townshipId);
      if (!township) {
        return res.status(400).json({ message: '找不到指定的鄉鎮' });
      }
      // 如果提供了乡镇但没有提供城市，使用乡镇关联的城市
      if (!city && township.city) {
        city = await City.findById(township.city);
      }
    }

    // 创建新案件
    const newCase = new Cases({
      caseNumber,
      company: company || null,
      city: city ? city._id : null,
      township: township ? township._id : null,
      bigSection: bigSection || null,
      smallSection: smallSection || null,
      village: village || null,
      neighbor: neighbor || null,
      street: street || null,
      section: section || null,
      lane: lane || null,
      alley: alley || null,
      number: number || null,
      floor: floor || null,
      status: status || null,
      user: user._id,
    });

    const savedCase = await newCase.save();
    
    // Populate 关联数据
    await savedCase.populate('city', 'name');
    await savedCase.populate('township', 'name');
    await savedCase.populate('user', 'name email nickname');

    res.status(201).json({
      message: '案件創建成功',
      case: savedCase,
    });
  } catch (error) {
    console.error('創建案件錯誤:', error);
    res.status(500).json({ message: '創建案件失敗', error: error.message });
  }
});

// @route   GET /api/cases
// @desc    Get all cases
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const cases = await Cases.find({})
      .populate('city', 'name')
      .populate('township', 'name')
      .populate('user', 'name email nickname')
      .sort({ createdAt: -1 });

    res.status(200).json({ cases });
  } catch (error) {
    console.error('獲取案件列表錯誤:', error);
    res.status(500).json({ message: '獲取案件列表失敗', error: error.message });
  }
});

// @route   GET /api/cases/:id
// @desc    Get a single case by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const caseItem = await Cases.findById(req.params.id)
      .populate('city', 'name')
      .populate('township', 'name')
      .populate('user', 'name email nickname');

    if (!caseItem) {
      return res.status(404).json({ message: '找不到該案件' });
    }

    res.status(200).json({ case: caseItem });
  } catch (error) {
    console.error('獲取案件錯誤:', error);
    res.status(500).json({ message: '獲取案件失敗', error: error.message });
  }
});

// @route   PUT /api/cases/:id
// @desc    Update a case
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const {
      caseNumber,
      company,
      cityId,
      townshipId,
      bigSection,
      smallSection,
      village,
      neighbor,
      street,
      section,
      lane,
      alley,
      number,
      floor,
      status,
      userId,
    } = req.body;

    const caseItem = await Cases.findById(req.params.id);

    if (!caseItem) {
      return res.status(404).json({ message: '找不到該案件' });
    }

    // 验证用户（负责人）
    let user = null;
    if (userId) {
      user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ message: '找不到指定的負責人' });
      }
    } else {
      // 如果没有指定用户，使用当前登录用户
      user = req.user;
    }

    // 验证城市（如果提供）
    let city = null;
    if (cityId) {
      city = await City.findById(cityId);
      if (!city) {
        return res.status(400).json({ message: '找不到指定的城市' });
      }
    }

    // 验证乡镇（如果提供）
    let township = null;
    if (townshipId) {
      township = await Township.findById(townshipId);
      if (!township) {
        return res.status(400).json({ message: '找不到指定的鄉鎮' });
      }
      // 如果提供了乡镇但没有提供城市，使用乡镇关联的城市
      if (!city && township.city) {
        city = await City.findById(township.city);
      }
    }

    // 更新案件数据
    if (caseNumber !== undefined) caseItem.caseNumber = caseNumber;
    if (company !== undefined) caseItem.company = company || null;
    if (city !== null) caseItem.city = city ? city._id : null;
    if (township !== null) caseItem.township = township ? township._id : null;
    if (bigSection !== undefined) caseItem.bigSection = bigSection || null;
    if (smallSection !== undefined) caseItem.smallSection = smallSection || null;
    if (village !== undefined) caseItem.village = village || null;
    if (neighbor !== undefined) caseItem.neighbor = neighbor || null;
    if (street !== undefined) caseItem.street = street || null;
    if (section !== undefined) caseItem.section = section || null;
    if (lane !== undefined) caseItem.lane = lane || null;
    if (alley !== undefined) caseItem.alley = alley || null;
    if (number !== undefined) caseItem.number = number || null;
    if (floor !== undefined) caseItem.floor = floor || null;
    if (status !== undefined) caseItem.status = status || null;
    if (user) caseItem.user = user._id;

    const updatedCase = await caseItem.save();
    
    // Populate 关联数据
    await updatedCase.populate('city', 'name');
    await updatedCase.populate('township', 'name');
    await updatedCase.populate('user', 'name email nickname');

    res.status(200).json({
      message: '案件更新成功',
      case: updatedCase,
    });
  } catch (error) {
    console.error('更新案件錯誤:', error);
    res.status(500).json({ message: '更新案件失敗', error: error.message });
  }
});

// @route   DELETE /api/cases/:id
// @desc    Delete a case
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const caseItem = await Cases.findById(req.params.id);

    if (!caseItem) {
      return res.status(404).json({ message: '找不到該案件' });
    }

    await Cases.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: '案件刪除成功',
    });
  } catch (error) {
    console.error('刪除案件錯誤:', error);
    res.status(500).json({ message: '刪除案件失敗', error: error.message });
  }
});

// @route   GET /api/cases/cities/list
// @desc    Get all cities for dropdown
// @access  Private
router.get('/cities/list', protect, async (req, res) => {
  try {
    const cities = await City.find({}).sort({ name: 1 }).select('name _id');
    res.status(200).json({ cities });
  } catch (error) {
    console.error('獲取城市列表錯誤:', error);
    res.status(500).json({ message: '獲取城市列表失敗', error: error.message });
  }
});

// @route   GET /api/cases/townships/list
// @desc    Get all townships for dropdown (optionally filtered by city)
// @access  Private
router.get('/townships/list', protect, async (req, res) => {
  try {
    const { cityId } = req.query;
    const query = cityId ? { city: cityId } : {};
    const townships = await Township.find(query)
      .populate('city', 'name')
      .sort({ name: 1 })
      .select('name city _id');
    res.status(200).json({ townships });
  } catch (error) {
    console.error('獲取鄉鎮列表錯誤:', error);
    res.status(500).json({ message: '獲取鄉鎮列表失敗', error: error.message });
  }
});

// @route   GET /api/cases/users/list
// @desc    Get all users for dropdown
// @access  Private
router.get('/users/list', protect, async (req, res) => {
  try {
    const users = await User.find({}).sort({ name: 1 }).select('name email _id');
    res.status(200).json({ users });
  } catch (error) {
    console.error('獲取用戶列表錯誤:', error);
    res.status(500).json({ message: '獲取用戶列表失敗', error: error.message });
  }
});

export default router;

