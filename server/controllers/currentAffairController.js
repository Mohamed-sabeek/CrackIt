import CurrentAffair from '../models/CurrentAffair.js';
import Notification from '../models/Notification.js';
import { validateCurrentAffair } from '../validation/currentAffairValidation.js';

// ─── Create ──────────────────────────────────────────────────────────────────
export const createCurrentAffair = async (req, res) => {
  try {
    const { errors, isValid } = validateCurrentAffair(req.body);
    if (!isValid) return res.status(400).json({ success: false, errors });

    const { month, year, sourceName, sourceUrl, isPublished } = req.body;

    const record = await CurrentAffair.create({
      month,
      year: Number(year),
      sourceName: sourceName.trim(),
      sourceUrl: sourceUrl.trim(),
      isPublished: !!isPublished,
      publishedAt: isPublished ? new Date() : undefined,
      createdBy: req.user?._id || null
    });

    if (record.isPublished) {
      await _createNotification(record, req.user?._id);
    }

    res.status(201).json({ success: true, data: record });
  } catch (err) {
    console.error('createCurrentAffair error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ─── Update ──────────────────────────────────────────────────────────────────
export const updateCurrentAffair = async (req, res) => {
  try {
    const { errors, isValid } = validateCurrentAffair(req.body);
    if (!isValid) return res.status(400).json({ success: false, errors });

    const record = await CurrentAffair.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Resource not found' });

    const wasPublished = record.isPublished;
    const { month, year, sourceName, sourceUrl, isPublished } = req.body;

    record.month = month;
    record.year = Number(year);
    record.sourceName = sourceName.trim();
    record.sourceUrl = sourceUrl.trim();

    const nowPublished = !!isPublished;
    if (nowPublished && !wasPublished) {
      record.publishedAt = new Date();
    }
    record.isPublished = nowPublished;

    await record.save();

    if (nowPublished && !wasPublished) {
      await _createNotification(record, req.user?._id);
    }

    res.status(200).json({ success: true, data: record });
  } catch (err) {
    console.error('updateCurrentAffair error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ─── Toggle Publish ───────────────────────────────────────────────────────────
export const togglePublishCurrentAffair = async (req, res) => {
  try {
    const record = await CurrentAffair.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Resource not found' });

    const wasPublished = record.isPublished;
    record.isPublished = !wasPublished;
    if (record.isPublished) record.publishedAt = new Date();

    await record.save();

    if (record.isPublished && !wasPublished) {
      await _createNotification(record, req.user?._id);
    }

    res.status(200).json({ success: true, data: record });
  } catch (err) {
    console.error('togglePublishCurrentAffair error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ─── Delete ───────────────────────────────────────────────────────────────────
export const deleteCurrentAffair = async (req, res) => {
  try {
    const record = await CurrentAffair.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Resource not found' });
    res.status(200).json({ success: true, message: 'Resource deleted' });
  } catch (err) {
    console.error('deleteCurrentAffair error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ─── Get One ──────────────────────────────────────────────────────────────────
export const getCurrentAffairById = async (req, res) => {
  try {
    const record = await CurrentAffair.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Resource not found' });
    res.status(200).json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ─── Get All (search, filter, sort, paginate) ─────────────────────────────────
export const getCurrentAffairs = async (req, res) => {
  try {
    const { search, year, sort, page = 1, limit = 12 } = req.query;
    const isAdmin = req.user?.role === 'admin';

    const query = {};

    // Students only see published resources
    if (!isAdmin) query.isPublished = true;

    // Filter by source name search
    if (search) {
      query.sourceName = { $regex: search.trim(), $options: 'i' };
    }

    // Filter by year
    if (year && !isNaN(Number(year))) {
      query.year = Number(year);
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    // Sort: newest = highest year+month, oldest = lowest
    const sortDir = sort === 'oldest' ? 1 : -1;
    const sortQuery = { year: sortDir, month: sortDir, createdAt: sortDir };

    const [data, totalRecords] = await Promise.all([
      CurrentAffair.find(query).sort(sortQuery).skip(skip).limit(limitNum),
      CurrentAffair.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data,
      currentPage: pageNum,
      totalPages: Math.ceil(totalRecords / limitNum),
      totalRecords
    });
  } catch (err) {
    console.error('getCurrentAffairs error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ─── Helper: fire-and-forget notification ─────────────────────────────────────
async function _createNotification(record, userId) {
  try {
    await Notification.create({
      title: '📰 New Current Affairs Resource Added',
      message: `${record.month} ${record.year} - ${record.sourceName}`,
      type: 'current_affairs',
      createdBy: userId || null
    });
  } catch (err) {
    console.error('Failed to create current affairs notification:', err);
  }
}
