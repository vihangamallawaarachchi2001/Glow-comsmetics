const FAQ = require('../models/FAQ');
const PDFDocument = require('pdfkit');

// Get all FAQs
const getAllFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, message: 'FAQs retrieved successfully.', data: faqs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch FAQs.', error: error.message });
    }
};

// Get single FAQ by ID
const getFAQById = async (req, res) => {
    try {
        const faq = await FAQ.findById(req.params.id);
        if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found.' });
        res.status(200).json({ success: true, message: 'FAQ retrieved successfully.', data: faq });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving FAQ.', error: error.message });
    }
};

// Create new FAQ
const createFAQ = async (req, res) => {
    try {
        const newFAQ = new FAQ(req.body);
        const savedFAQ = await newFAQ.save();
        res.status(201).json({ success: true, message: 'FAQ created successfully.', data: savedFAQ });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to create FAQ.', error: error.message });
    }
};

// Update FAQ
const updateFAQ = async (req, res) => {
    try {
        const updatedFAQ = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedFAQ) return res.status(404).json({ success: false, message: 'FAQ not found.' });
        res.status(200).json({ success: true, message: 'FAQ updated successfully.', data: updatedFAQ });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to update FAQ.', error: error.message });
    }
};

// Delete FAQ
const deleteFAQ = async (req, res) => {
    try {
        const deletedFAQ = await FAQ.findByIdAndDelete(req.params.id);
        if (!deletedFAQ) return res.status(404).json({ success: false, message: 'FAQ not found.' });
        res.status(200).json({ success: true, message: 'FAQ deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete FAQ.', error: error.message });
    }
};

// Generate FAQ Summary PDF
const generateFAQSummaryPDF = async (req, res) => {
    try {
        const faqs = await FAQ.find();

        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="faq_summary.pdf"');

        doc.pipe(res);

        doc.fontSize(20).text('FAQ Summary', { align: 'center' });
        doc.moveDown();

        faqs.forEach((faq, index) => {
            doc.fontSize(14).text(`${index + 1}. ${faq.question}`, { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(12).text(`Answer: ${faq.answer || 'Not answered yet'}`);
            doc.text(`Category: ${faq.category}`);
            doc.text(`Status: ${faq.status}`);
            doc.text(`Asked by: ${faq.full_name}`);
            if (faq.answered_by) doc.text(`Answered by: ${faq.answered_by}`);
            doc.moveDown();
        });

        doc.end();
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to generate PDF.', error: error.message });
    }
};

module.exports = {
    getAllFAQs,
    getFAQById,
    createFAQ,
    updateFAQ,
    deleteFAQ,
    generateFAQSummaryPDF
};
