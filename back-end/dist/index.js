"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const departments_1 = __importDefault(require("./routes/departments"));
const doctors_1 = __importDefault(require("./routes/doctors"));
const appointments_1 = __importDefault(require("./routes/appointments"));
const inquiries_1 = __importDefault(require("./routes/inquiries"));
const staff_1 = __importDefault(require("./routes/staff"));
const inventory_1 = __importDefault(require("./routes/inventory"));
const expenses_1 = __importDefault(require("./routes/expenses"));
const cases_1 = __importDefault(require("./routes/cases"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const reception_1 = __importDefault(require("./routes/reception"));
const admin_1 = __importDefault(require("./routes/admin"));
const reports_1 = __importDefault(require("./routes/reports"));
const dental_1 = __importDefault(require("./routes/dental"));
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.use((0, cors_1.default)());
app.use((0, compression_1.default)());
app.use(express_1.default.json());
const auth_2 = require("./middleware/auth");
// ... (imports remain same)
// Routes
app.use('/api/auth', auth_1.default);
// Protected Routes
app.use('/api/admin', auth_2.authenticateToken, (0, auth_2.authorize)('ADMIN', 'SUPER_ADMIN'), admin_1.default);
app.use('/api/staff', auth_2.authenticateToken, (0, auth_2.authorize)('ADMIN', 'SUPER_ADMIN'), staff_1.default);
app.use('/api/inventory', auth_2.authenticateToken, (0, auth_2.authorize)('ADMIN', 'SUPER_ADMIN'), inventory_1.default);
app.use('/api/expenses', auth_2.authenticateToken, (0, auth_2.authorize)('ADMIN', 'SUPER_ADMIN'), expenses_1.default);
app.use('/api/analytics', auth_2.authenticateToken, (0, auth_2.authorize)('ADMIN', 'SUPER_ADMIN'), analytics_1.default);
app.use('/api/appointments', auth_2.authenticateToken, (0, auth_2.authorize)('ADMIN', 'SUPER_ADMIN', 'RECEPTIONIST'), appointments_1.default);
app.use('/api/reception', auth_2.authenticateToken, (0, auth_2.authorize)('RECEPTIONIST'), reception_1.default);
app.use('/api/reports', auth_2.authenticateToken, (0, auth_2.authorize)('ADMIN', 'SUPER_ADMIN', 'RECEPTIONIST'), reports_1.default);
app.use('/api/dental', auth_2.authenticateToken, (0, auth_2.authorize)('ADMIN', 'SUPER_ADMIN', 'RECEPTIONIST'), dental_1.default);
app.use('/api/doctors', auth_2.authenticateToken, (0, auth_2.authorize)('ADMIN', 'SUPER_ADMIN', 'RECEPTIONIST'), doctors_1.default);
app.use('/api/departments', auth_2.authenticateToken, (0, auth_2.authorize)('ADMIN', 'SUPER_ADMIN', 'RECEPTIONIST'), departments_1.default);
app.use('/api/inquiries', auth_2.authenticateToken, (0, auth_2.authorize)('ADMIN', 'SUPER_ADMIN', 'RECEPTIONIST'), inquiries_1.default);
app.use('/api/cases', auth_2.authenticateToken, (0, auth_2.authorize)('ADMIN', 'SUPER_ADMIN', 'RECEPTIONIST'), cases_1.default);
app.get('/', (req, res) => {
    res.send('Hospital API is running');
});
// Error handling - must be last
app.use(errorHandler_1.errorHandler);
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
