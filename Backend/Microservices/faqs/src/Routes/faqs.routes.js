const express = require('express');
const router = express.Router();
const { getAllFAQs, getFAQById, createFAQ, updateFAQ, deleteFAQ } = require('../controller/faq.Controller');
const jwtAuth = require('../middleware/jwtAuth');

// All FAQ routes are protected by JWT (admin only)
router.use(jwtAuth);

router.get('/', getAllFAQs);
router.get('/:id', getFAQById);
router.post('/', createFAQ);
router.put('/:id', updateFAQ);
router.delete('/:id', deleteFAQ);

module.exports = router;
