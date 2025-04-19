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
exports.getAllNotifications = exports.sendNotification = void 0;
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const rabbitmqPublish_1 = require("../utils/rabbitmq/rabbitmqPublish");
const userConsumer_1 = require("../consumers/userConsumer");
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const isValidObjectId = (id) => mongoose_1.default.Types.ObjectId.isValid(id);
const sendNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        throw new CustomError_1.default("User ID is required", 400);
    }
    const { title, message, type, status, targetType, targetAgeGroup, recipientId, } = req.body;
    console.log("userId", userId);
    yield (0, rabbitmqPublish_1.publishToQueue)("allUserDetailsNotification", userId);
    yield new Promise((resolve) => setTimeout(resolve, 1500));
    const allUsers = Array.from(userConsumer_1.users.values());
    console.log("allUsers:", allUsers);
    if (!title || !message || !type || !targetType) {
        throw new CustomError_1.default("Missing required fields.", 400);
    }
    //to all users 
    if (targetType === 'all') {
        const notifications = allUsers.map((user) => ({
            title,
            message,
            type,
            targetType,
            recipient: user._id,
        }));
        yield notificationModel_1.default.insertMany(notifications);
        // console.log(object)
        return res.status(200).json({ message: 'Notification sent to all users.', notifications });
    }
    //To all users bby catagory
    if (targetType === 'age-group') {
        if (!targetAgeGroup) {
            throw new CustomError_1.default("targetGroup is required", 400);
        }
        let ageRange;
        switch (targetAgeGroup) {
            case '5-8':
                ageRange = [5, 8];
                break;
            case '9-12':
                ageRange = [9, 12];
                break;
            case '13-18':
                ageRange = [13, 18];
                break;
            default:
                return res.status(400).json({ message: 'Invalid age group.' });
        }
        const filteredUsers = allUsers.filter((user) => {
            const userAge = user.age;
            return userAge >= ageRange[0] && userAge <= ageRange[1];
        });
        const notifications = filteredUsers.map((user) => ({
            title,
            message,
            type,
            targetType,
            targetAgeGroup,
            recipient: user._id,
        }));
        yield notificationModel_1.default.insertMany(notifications);
        return res
            .status(200)
            .json({ message: `Notification sent to age group ${targetAgeGroup}.` });
    }
    //TO send individually
    if (targetType === 'individual') {
        if (!recipientId || !isValidObjectId(recipientId)) {
            throw new CustomError_1.default("Valid recipientId is required.", 400);
        }
        const user = allUsers.find((u) => u._id.toString() === recipientId);
        if (!user) {
            throw new CustomError_1.default("User not found", 400);
        }
        const notification = yield notificationModel_1.default.create({
            title,
            message,
            type,
            targetType,
            recipient: recipientId,
        });
        console.log(notification);
        return res.status(200).json({ message: 'Notification sent to user.', notification });
    }
    throw new CustomError_1.default("Invalid target type", 400);
});
exports.sendNotification = sendNotification;
const getAllNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        // If you want to fetch only notifications for the logged-in user:
        const filter = userId ? { recipient: userId } : {};
        const notifications = yield notificationModel_1.default.find();
        return res.status(200).json({
            success: true,
            count: notifications.length,
            notifications,
        });
    }
    catch (error) {
        console.error("Error fetching notifications:", error);
        throw new CustomError_1.default("Failed to fetch notifications", 500);
    }
});
exports.getAllNotifications = getAllNotifications;
