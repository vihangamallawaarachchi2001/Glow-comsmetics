const express = require('express');
const {
    getAllFAQs,
    getFAQById,
    createFAQ,
    updateFAQ,
    deleteFAQ,
    generateFAQSummaryPDF
} = require('../controllers/faq.controller');

const router = express.Router();

router.get('/', getAllFAQs);
router.get('/:id', getFAQById);
router.post('/createfaq', createFAQ);
router.put('/:id', updateFAQ);
router.delete('/:id', deleteFAQ);
router.get('/generate/pdf', generateFAQSummaryPDF);

module.exports = router;
