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
const dental_1 = require("../validations/dental");
const response_1 = require("../utils/response");
const router = (0, express_1.Router)();
// --- Dental Treatment Plans ---
// Create a new treatment plan
router.post('/plans', (0, validate_1.validate)(dental_1.dentalPlanSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const plan = yield prismaClient_1.default.dentalTreatmentPlan.create({
        data: {
            patientId: data.patientId,
            patientName: data.patientName,
            primaryConcern: data.primaryConcern,
            totalStages: data.totalStages || 1,
            status: 'Active'
        }
    });
    (0, response_1.sendSuccess)(res, plan, 'Dental Treatment Plan Initiated');
}));
// Get all treatment plans
router.get('/plans', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const plans = yield prismaClient_1.default.dentalTreatmentPlan.findMany({
        include: {
            sittings: true,
            patient: true
        },
        orderBy: { createdAt: 'desc' }
    });
    (0, response_1.sendSuccess)(res, plans);
}));
// --- Dental Sittings ---
// Add a sitting to a plan
router.post('/plans/:id/sittings', (0, validate_1.validate)(dental_1.dentalSittingSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const data = req.body;
    const sitting = yield prismaClient_1.default.dentalSitting.create({
        data: {
            planId: parseInt(id),
            sittingNumber: data.sittingNumber,
            procedureDone: data.procedureDone,
            toothNumber: data.toothNumber,
            materialUsed: data.materialUsed,
            notes: data.notes,
            status: data.status || 'Completed'
        }
    });
    (0, response_1.sendSuccess)(res, sitting, 'Sitting Committed: Record added to treatment plan.');
}));
// Update a sitting
router.patch('/sittings/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { procedureDone, toothNumber, materialUsed, notes, status } = req.body;
    const updated = yield prismaClient_1.default.dentalSitting.update({
        where: { id: parseInt(id) },
        data: { procedureDone, toothNumber, materialUsed, notes, status }
    });
    (0, response_1.sendSuccess)(res, updated);
}));
// --- Dental Lab Orders ---
router.post('/lab-orders', (0, validate_1.validate)(dental_1.dentalLabOrderSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const labOrder = yield prismaClient_1.default.dentalLabOrder.create({
        data: {
            patientName: data.patientName,
            treatmentType: data.treatmentType,
            labName: data.labName || 'Internal Lab',
            caseType: data.caseType || 'Generic',
            expectedReturn: data.expectedReturn ? new Date(data.expectedReturn) : null,
            status: 'Sent to Lab'
        }
    });
    (0, response_1.sendSuccess)(res, labOrder, 'Lab Order Initiated successfully.');
}));
exports.default = router;
