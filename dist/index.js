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
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const port = process.env.PORT || 3000;
const prisma = new client_1.PrismaClient();
app.get("/", (req, res) => {
    res.send("API is up and running");
});
app.get("/employee-workinghours", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employee = yield prisma.employee.findMany({
            select: {
                name: true,
                workingHours: true,
            },
        });
        res.send(employee).status(200);
    }
    catch (error) {
        console.error(error);
        res.send("Unable to fetch data from the Database").status(500);
    }
}));
//@ts-ignore
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(401).send("Unauthenticated!");
});
app.listen(port, () => {
    console.log(`[info]: Server is running at port ${port}`);
});
