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
const inventory_1 = require("../validations/inventory");
const router = (0, express_1.Router)();
// Get all inventory items
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield prismaClient_1.default.inventoryItem.findMany({
        include: {
            purchases: {
                orderBy: { date: 'desc' },
                take: 5
            },
            consumptions: {
                orderBy: { date: 'desc' },
                take: 10
            }
        }
    });
    res.json(items);
}));
// Add inventory item
router.post('/', (0, validate_1.validate)(inventory_1.createInventoryItemSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, category, stock, unit, expiryDate } = req.body;
    const item = yield prismaClient_1.default.inventoryItem.create({
        data: {
            name,
            category,
            stock: parseInt(stock),
            unit,
            expiryDate: expiryDate ? new Date(expiryDate) : null,
        },
    });
    res.json({ success: true, data: item });
}));
// Update stock (Inventory Adjustment)
router.patch('/:id/stock', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { stock } = req.body;
    const item = yield prismaClient_1.default.inventoryItem.update({
        where: { id: parseInt(id) },
        data: {
            stock: parseInt(stock),
        },
    });
    res.json({ success: true, data: item });
}));
// Record Purchase
router.post('/purchases', (0, validate_1.validate)(inventory_1.purchaseRecordSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId, quantity, cost, date } = req.body;
    const [purchase, updatedItem] = yield prismaClient_1.default.$transaction([
        prismaClient_1.default.purchaseRecord.create({
            data: {
                itemId: parseInt(itemId),
                quantity: parseInt(quantity),
                cost: parseFloat(cost),
                date: date ? new Date(date) : new Date(),
            },
        }),
        prismaClient_1.default.inventoryItem.update({
            where: { id: parseInt(itemId) },
            data: {
                stock: {
                    increment: parseInt(quantity)
                }
            }
        })
    ]);
    res.json({ success: true, purchase, updatedItem });
}));
// Record Consumption (Usage)
router.post('/consumptions', (0, validate_1.validate)(inventory_1.consumptionRecordSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId, quantity, usedFor, date } = req.body;
    const [consumption, updatedItem] = yield prismaClient_1.default.$transaction([
        prismaClient_1.default.materialConsumption.create({
            data: {
                itemId: parseInt(itemId),
                quantity: parseInt(quantity),
                usedFor,
                date: date ? new Date(date) : new Date(),
            },
        }),
        prismaClient_1.default.inventoryItem.update({
            where: { id: parseInt(itemId) },
            data: {
                stock: {
                    decrement: parseInt(quantity)
                }
            }
        })
    ]);
    res.json({ success: true, consumption, updatedItem });
}));
exports.default = router;
