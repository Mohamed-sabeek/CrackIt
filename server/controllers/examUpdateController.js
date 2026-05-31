import ExamUpdate from '../models/ExamUpdate.js';
import Notification from '../models/Notification.js';
import { validateExamUpdate } from '../validation/examUpdateValidation.js';

// ─── Create ──────────────────────────────────────────────────────────────────
export const createExamUpdate = async (req, res) => {
  try {
    const { errors, isValid } = validateExamUpdate(req.body);
    if (!isValid) return res.status(400).json({ success: false, errors });

    const { examName, notificationNumber, notificationDate, examDate, status, sourceName, officialUrl, isPublished } = req.body;

    const record = await ExamUpdate.create({
      examName: examName.trim(),
      notificationNumber: notificationNumber?.trim() || '',
      notificationDate: new Date(notificationDate),
      examDate: examDate ? new Date(examDate) : undefined,
      status,
      sourceName: sourceName.trim(),
      officialUrl: officialUrl.trim(),
      isPublished: !!isPublished,
      publishedAt: isPublished ? new Date() : undefined,
      createdBy: req.user?._id || null
    });

    if (record.isPublished) {
      await _createNotification(record, req.user?._id);
    }

    res.status(201).json({ success: true, data: record });
  } catch (err) {
    console.error('createExamUpdate error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ─── Update ──────────────────────────────────────────────────────────────────
export const updateExamUpdate = async (req, res) => {
  try {
    const { errors, isValid } = validateExamUpdate(req.body);
    if (!isValid) return res.status(400).json({ success: false, errors });

    const record = await ExamUpdate.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Resource not found' });

    const wasPublished = record.isPublished;
    const { examName, notificationNumber, notificationDate, examDate, status, sourceName, officialUrl, isPublished } = req.body;

    record.examName = examName.trim();
    record.notificationNumber = notificationNumber?.trim() || '';
    record.notificationDate = new Date(notificationDate);
    record.examDate = examDate ? new Date(examDate) : undefined;
    record.status = status;
    record.sourceName = sourceName.trim();
    record.officialUrl = officialUrl.trim();

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
    console.error('updateExamUpdate error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ─── Toggle Publish ───────────────────────────────────────────────────────────
export const togglePublishExamUpdate = async (req, res) => {
  try {
    const record = await ExamUpdate.findById(req.params.id);
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
    console.error('togglePublishExamUpdate error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ─── Delete ───────────────────────────────────────────────────────────────────
export const deleteExamUpdate = async (req, res) => {
  try {
    const record = await ExamUpdate.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Resource not found' });
    res.status(200).json({ success: true, message: 'Resource deleted' });
  } catch (err) {
    console.error('deleteExamUpdate error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ─── Get One ──────────────────────────────────────────────────────────────────
export const getExamUpdateById = async (req, res) => {
  try {
    const record = await ExamUpdate.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Resource not found' });
    res.status(200).json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ─── Get All (search, filter, sort, paginate) ─────────────────────────────────
export const getExamUpdates = async (req, res) => {
  try {
    const { search, status, year, sort, page = 1, limit = 12 } = req.query;
    const isAdmin = req.user?.role === 'admin';

    const query = {};

    // Students only see published resources
    if (!isAdmin) query.isPublished = true;

    // Filter by exam name search
    if (search) {
      query.examName = { $regex: search.trim(), $options: 'i' };
    }

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by year
    if (year && !isNaN(Number(year))) {
      const yearStart = new Date(`${year}-01-01T00:00:00.000Z`);
      const yearEnd = new Date(`${year}-12-31T23:59:59.999Z`);
      query.notificationDate = { $gte: yearStart, $lte: yearEnd };
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    // Sort: newest = highest notificationDate, oldest = lowest
    const sortDir = sort === 'oldest' ? 1 : -1;
    const sortQuery = { notificationDate: sortDir, createdAt: sortDir };

    const [data, totalRecords] = await Promise.all([
      ExamUpdate.find(query).sort(sortQuery).skip(skip).limit(limitNum),
      ExamUpdate.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data,
      currentPage: pageNum,
      totalPages: Math.ceil(totalRecords / limitNum),
      totalRecords
    });
  } catch (err) {
    console.error('getExamUpdates error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ─── Helper: fire-and-forget notification ─────────────────────────────────────
async function _createNotification(record, userId) {
  try {
    await Notification.create({
      title: '📢 New Exam Update',
      message: record.examName,
      type: 'exam_update',
      createdBy: userId || null
    });
  } catch (err) {
    console.error('Failed to create exam update notification:', err);
  }
}
