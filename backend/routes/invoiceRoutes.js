const express = require('express');
const router = express.Router();
const { getInvoices, createInvoice } = require('../controllers/invoiceController');

router.route('/')
  .get(getInvoices)
  .post(createInvoice);

module.exports = router;