"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prismaClient_1 = __importDefault(require("../prismaClient"));
const validate_1 = require("../middleware/validate");
const auth_1 = require("../middleware/auth");
const reports_1 = require("../validations/reports");
const response_1 = require("../utils/response");
const router = (0, express_1.Router)();
// --- Diagnostic Orders ---
// Create a new diagnostic order (X-Ray / Ultrasound)
router.post('/orders', (0, validate_1.validate)(reports_1.diagnosticOrderSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const order = yield prismaClient_1.default.diagnosticOrder.create({
        data: {
            patientId: data.patientId,
            appointmentId: data.appointmentId,
            type: data.type,
            testName: data.testName,
            priority: data.priority || 'Normal',
            cost: data.cost || 0,
            status: 'Pending'
        },
        include: { patient: true }
    });
    (0, response_1.sendSuccess)(res, order, 'Diagnostic Order Initiated');
}));
// Get all orders (for technician view)
router.get('/orders', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield prismaClient_1.default.diagnosticOrder.findMany({
        include: {
            patient: true,
            report: true
        },
        orderBy: { createdAt: 'desc' }
    });
    (0, response_1.sendSuccess)(res, orders);
}));
// Update order status (In Progress, Completed)
router.patch('/orders/:id/status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status, technicianName, notes } = req.body;
    const updated = yield prismaClient_1.default.diagnosticOrder.update({
        where: { id: parseInt(id) },
        data: { status, technicianName, notes }
    });
    (0, response_1.sendSuccess)(res, updated, `Workflow: Order marked as ${status}`);
}));
// --- Medical Reports ---
// Get all finalized reports (for Reports module)
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reports = yield prismaClient_1.default.medicalReport.findMany({
        include: {
            patient: true,
            order: true
        },
        orderBy: { createdAt: 'desc' }
    });
    (0, response_1.sendSuccess)(res, reports);
}));
// Create/Update draft report
router.post('/', (0, validate_1.validate)(reports_1.medicalReportSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const report = yield prismaClient_1.default.medicalReport.upsert({
        where: { orderId: data.orderId || -1 },
        update: {
            findings: data.findings,
            impression: data.impression,
            recommendations: data.recommendations,
            status: data.status || 'Under Review', // Default to Under Review for Admin check
            finalizedAt: data.status === 'Final' ? new Date() : null
        },
        create: {
            orderId: data.orderId,
            patientId: data.patientId,
            serviceType: data.serviceType,
            findings: data.findings,
            impression: data.impression,
            recommendations: data.recommendations,
            status: data.status || 'Under Review'
        }
    });
    (0, response_1.sendSuccess)(res, report, data.status === 'Final' ? "Report Finalized." : "Report Submitted for Review.");
}));
// Admin-only: Finalize report
router.patch('/:id/finalize', (0, auth_1.authorize)('ADMIN', 'SUPER_ADMIN'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { finalizedBy } = req.body;
    const updated = yield prismaClient_1.default.medicalReport.update({
        where: { id: parseInt(id) },
        data: {
            status: 'Final',
            finalizedAt: new Date(),
            finalizedBy: finalizedBy || 'Admin'
        }
    });
    (0, response_1.sendSuccess)(res, updated, 'Report marked as Final');
}));
// Super Admin-only: Reopen a finalized report
router.patch('/:id/reopen', (0, auth_1.authorize)('SUPER_ADMIN'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { reason } = req.body;
    const updated = yield prismaClient_1.default.medicalReport.update({
        where: { id: parseInt(id) },
        data: {
            status: 'Under Review',
            finalizedAt: null,
            finalizedBy: null,
            // Ideally log reason in audit or comments if schema supported it
        }
    });
    (0, response_1.sendSuccess)(res, updated, 'Report reopened and returned to Review state');
}));
// Delete a report
router.delete('/:id', (0, auth_1.authorize)('SUPER_ADMIN'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prismaClient_1.default.medicalReport.delete({ where: { id: parseInt(id) } });
    (0, response_1.sendSuccess)(res, null, 'Report deleted');
}));
exports.default = router;
