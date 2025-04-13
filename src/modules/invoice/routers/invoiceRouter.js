const { Router } = require('express');
const {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoiceById,
  deleteInvoiceById
} = require('../controllers/invoiceController');

const authMiddleware = require('../../../middlewares/authMiddleware');

const invoiceRouter = Router();

invoiceRouter.route('/')
  .get(authMiddleware, getAllInvoices)      
  .post(authMiddleware, createInvoice);     

invoiceRouter.route('/:id')
  .get(authMiddleware, getInvoiceById)      
  .patch(authMiddleware, updateInvoiceById) 
  .delete(authMiddleware, deleteInvoiceById); 

module.exports = invoiceRouter;
