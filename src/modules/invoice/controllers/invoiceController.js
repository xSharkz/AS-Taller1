const Invoice = require('../../../database/models/invoiceModel');
const AppError = require('../../../utils/appError');
const catchAsync = require('../../../utils/catchAsync');

// Crear factura (solo administrador)
const createInvoice = catchAsync(async (req, res) => {
  const { role, id: tokenUserId } = req.user;

  if (role !== 'Administrador') {
    throw new AppError('Solo los administradores pueden crear facturas', 403);
  }

  const { clientId, monto, estado } = req.body;

  if (!monto || !estado) {
    throw new AppError('Todos los campos son obligatorios', 400);
  }

  const validStates = ['Pendiente', 'Pagado', 'Vencido'];
  if (!validStates.includes(estado)) {
    throw new AppError('El estado debe ser Pendiente, Pagado o Vencido', 400);
  }

  if (!Number.isInteger(monto) || monto <= 0) {
    throw new AppError('El monto debe ser un número entero positivo', 400);
  }

  const resolvedClientId = clientId || tokenUserId;

  const invoice = await Invoice.create({
    clientId: resolvedClientId,
    monto,
    estado
  });

  res.status(201).json({
    message: 'Factura creada correctamente',
    invoice
  });
});

// Listar todas las facturas (admins: todas, clientes: solo las suyas)
const getAllInvoices = catchAsync(async (req, res) => {
  const { role, id: userId } = req.user;
  const { estado } = req.query;

  const where = {
    eliminado: false,
    ...(estado ? { estado } : {})
  };

  if (role !== 'Administrador') {
    where.clientId = userId;
  }

  const invoices = await Invoice.findAll({ where });
  res.status(200).json(invoices);
});

// Obtener factura por ID
const getInvoiceById = catchAsync(async (req, res) => {
  const { role, id: userId } = req.user;
  const { id } = req.params;

  const invoice = await Invoice.findByPk(id);
  if (!invoice || invoice.eliminado) {
    throw new AppError('Factura no encontrada', 404);
  }

  if (role !== 'Administrador' && invoice.clientId !== userId) {
    throw new AppError('No tienes permisos para ver esta factura', 403);
  }

  res.status(200).json(invoice);
});

// Actualizar estado de factura (solo administrador)
const updateInvoiceById = catchAsync(async (req, res) => {
  const { role } = req.user;
  const { id } = req.params;
  const { estado } = req.body;

  if (role !== 'Administrador') {
    throw new AppError('Solo los administradores pueden actualizar facturas', 403);
  }

  const invoice = await Invoice.findByPk(id);
  if (!invoice || invoice.eliminado) {
    throw new AppError('Factura no encontrada', 404);
  }

  const validStates = ['Pendiente', 'Pagado', 'Vencido'];
  if (!validStates.includes(estado)) {
    throw new AppError('El estado debe ser Pendiente, Pagado o Vencido', 400);
  }

  invoice.estado = estado;

  if (estado === 'Pagado') {
    invoice.fechaPago = new Date();
  }

  await invoice.save();
  res.status(200).json({
    message: 'Factura actualizada correctamente',
    invoice
  });
});

// Eliminar factura (soft delete, solo si no está pagada)
const deleteInvoiceById = catchAsync(async (req, res) => {
  const { role } = req.user;
  const { id } = req.params;

  if (role !== 'Administrador') {
    throw new AppError('Solo los administradores pueden eliminar facturas', 403);
  }

  const invoice = await Invoice.findByPk(id);
  if (!invoice || invoice.eliminado) {
    throw new AppError('Factura no encontrada', 404);
  }

  if (invoice.estado === 'Pagado') {
    throw new AppError('No se puede eliminar una factura que ya ha sido pagada', 400);
  }

  invoice.eliminado = true;
  await invoice.save();

  res.status(204).end();
});

module.exports = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoiceById,
  deleteInvoiceById
};
