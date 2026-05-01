const FAQ = require('../model/FAQ.model');

// GET /api/admin/faqs
const getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({ tenantId: req.tenant._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: faqs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// GET /api/admin/faqs/:id
const getFAQById = async (req, res) => {
  try {
    const faq = await FAQ.findOne({ _id: req.params.id, tenantId: req.tenant._id });
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, data: faq });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// POST /api/admin/faqs
const createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ success: false, message: 'Question and answer are required' });
    }

    const faq = await FAQ.create({
      tenantId: req.tenant._id,
      question,
      answer,
    });

    res.status(201).json({ success: true, data: faq });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// PUT /api/admin/faqs/:id
const updateFAQ = async (req, res) => {
  try {
    const { question, answer, isActive } = req.body;

    const faq = await FAQ.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.tenant._id },
      { question, answer, isActive },
      { new: true, runValidators: true }
    );

    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });

    res.json({ success: true, data: faq });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// DELETE /api/admin/faqs/:id
const deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findOneAndDelete({ _id: req.params.id, tenantId: req.tenant._id });
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

module.exports = { getAllFAQs, getFAQById, createFAQ, updateFAQ, deleteFAQ };
