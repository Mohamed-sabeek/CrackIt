import Paper from '../models/Paper.js';
import Notification from '../models/Notification.js';
import { convertDriveLink, convertDriveImageLink } from '../utils/driveHelper.js';

export const createPaper = async (req, res) => {
  try {
    const { title, exam, stage, paperType, year, driveLink, thumbnail } = req.body;

    const { previewUrl, downloadUrl } = convertDriveLink(driveLink);
    const processedThumbnail = convertDriveImageLink(thumbnail);

    const newPaper = new Paper({
      title,
      exam,
      stage,
      paperType,
      year,
      driveLink,
      previewUrl,
      downloadUrl,
      thumbnail: processedThumbnail || `https://placehold.co/400x600/10b981/ffffff?text=${encodeURIComponent(exam || 'Paper')}`,
      uploadedBy: req.user ? req.user._id : null
    });

    const savedPaper = await newPaper.save();

    // Automatically trigger notification
    try {
      await Notification.create({
        title: '📄 New Previous Paper Added',
        message: `${savedPaper.title} is now available.`,
        type: 'previous_paper',
        createdBy: req.user ? req.user._id : null
      });
    } catch (notifErr) {
      console.error('Failed to create notification for previous paper:', notifErr);
    }

    res.status(201).json(savedPaper);
  } catch (error) {
    console.error('Error creating paper:', error);
    res.status(500).json({ message: 'Failed to create paper', error: error.message });
  }
};

export const getPapers = async (req, res) => {
  try {
    const { exam, stage, paperType, year, search } = req.query;

    let query = {};

    if (exam && exam !== 'All') {
      query.exam = exam;
    }
    if (stage && stage !== 'All') {
      query.stage = stage;
    }
    if (paperType && paperType !== 'All') {
      query.paperType = paperType;
    }
    if (year && year !== 'All') {
      query.year = year;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { exam: { $regex: search, $options: 'i' } }
      ];
    }

    const papers = await Paper.find(query).sort({ year: -1, createdAt: -1 });
    res.status(200).json(papers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch papers', error: error.message });
  }
};

export const getPaperById = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ message: 'Paper not found' });
    res.status(200).json(paper);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch paper', error: error.message });
  }
};

export const updatePaper = async (req, res) => {
  try {
    const updates = { ...req.body };
    
    if (updates.driveLink) {
      const { previewUrl, downloadUrl } = convertDriveLink(updates.driveLink);
      updates.previewUrl = previewUrl;
      updates.downloadUrl = downloadUrl;
    }
    
    if (updates.thumbnail) {
      updates.thumbnail = convertDriveImageLink(updates.thumbnail);
    }

    const updatedPaper = await Paper.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updatedPaper) return res.status(404).json({ message: 'Paper not found' });
    
    res.status(200).json(updatedPaper);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update paper', error: error.message });
  }
};

export const deletePaper = async (req, res) => {
  try {
    const paper = await Paper.findByIdAndDelete(req.params.id);
    if (!paper) return res.status(404).json({ message: 'Paper not found' });

    res.status(200).json({ message: 'Paper deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete paper', error: error.message });
  }
};
