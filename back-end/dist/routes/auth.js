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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = __importDefault(require("../prismaClient"));
const validate_1 = require("../middleware/validate");
const auth_1 = require("../validations/auth");
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
router.post('/register', (0, validate_1.validate)(auth_1.registerSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role } = req.body;
    try {
        const existing = yield prismaClient_1.default.users.findUnique({ where: { email } });
        if (existing) {
            return res.status(409).json({
                success: false,
                errorCode: 'CONFLICT',
                message: 'Email already registered'
            });
        }
        // Security: Only allow RECEPTIONIST role from public registration
        // SUPER_ADMIN, ADMIN or DOCTOR roles should be created by an existing administrator
        const finalRole = (role === 'ADMIN' || role === 'DOCTOR' || role === 'SUPER_ADMIN') ? 'RECEPTIONIST' : (role || 'RECEPTIONIST');
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield prismaClient_1.default.users.create({
            // @ts-ignore
            data: { email, password: hashedPassword, role: finalRole },
        });
        res.json({ success: true, user: { id: user.id, email: user.email, role: user.role } });
    }
    catch (error) {
        next(error);
    }
}));
router.post('/login', (0, validate_1.validate)(auth_1.loginSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield prismaClient_1.default.users.findUnique({ where: { email } });
        if (!user || !user.password) {
            return res.status(401).json({
                success: false,
                errorCode: 'INVALID_CREDENTIALS',
                message: 'Invalid email or password'
            });
        }
        const valid = yield bcryptjs_1.default.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({
                success: false,
                errorCode: 'INVALID_CREDENTIALS',
                message: 'Invalid email or password'
            });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
        res.json({
            success: true,
            token,
            user: { id: user.id, email: user.email, role: user.role }
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
