"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
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
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/departments', departments_1.default);
app.use('/api/doctors', doctors_1.default);
app.use('/api/appointments', appointments_1.default);
app.use('/api/inquiries', inquiries_1.default);
app.use('/api/staff', staff_1.default);
app.use('/api/inventory', inventory_1.default);
app.use('/api/expenses', expenses_1.default);
app.use('/api/cases', cases_1.default);
app.use('/api/analytics', analytics_1.default);
app.use('/api/reception', reception_1.default);
app.use('/api/admin', admin_1.default);
app.get('/', (req, res) => {
    res.send('Hospital API is running');
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
