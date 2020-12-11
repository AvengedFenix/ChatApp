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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.sendMessage = exports.getChats = exports.newChat = exports.storeUser = void 0;
var functions = require("firebase-functions");
var admin = require('firebase-admin');
var fieldValue = require('firebase-admin').firestore.FieldValue;
admin.initializeApp();
var db = admin.firestore();
exports.storeUser = functions.https.onCall(function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var email, oneSignal, userRef, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(data);
                email = data.email, oneSignal = data.oneSignal;
                // const email = 'hola@hola.com';
                // const oneSignal = 'hey';
                console.log('store user call');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, db.collection('users').doc(email)];
            case 2:
                userRef = _a.sent();
                return [4 /*yield*/, userRef.get()];
            case 3:
                if ((_a.sent()).exists) {
                    return [2 /*return*/];
                }
                else {
                    userRef.set({ chat: [], device: oneSignal });
                }
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                console.log(error_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.newChat = functions.https.onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var email, receiverPhoneNumber, oneSignalUserId, receiverRef, newChatID, senderRef, receiverOneSignalId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = context.auth.token.email;
                receiverPhoneNumber = data.receiverPhoneNumber, oneSignalUserId = data.oneSignalUserId;
                receiverRef = db.collection('users').doc(receiverPhoneNumber);
                return [4 /*yield*/, receiverRef.get()];
            case 1:
                if (!(_a.sent()).exists) {
                    console.log('no existe');
                    return [2 /*return*/, true];
                }
                console.log('oneSignalUserId', oneSignalUserId);
                newChatID = db.collection('chats').doc().id;
                senderRef = db.collection('users').doc(email === null || email === void 0 ? void 0 : email.toString());
                return [4 /*yield*/, receiverRef.get()];
            case 2:
                receiverOneSignalId = (_a.sent()).data().device;
                console.log('receiverOneSignal', receiverOneSignalId);
                return [4 /*yield*/, db.collection('chats').doc(newChatID).set({
                        id: newChatID,
                        createdBy: email,
                        creatorOneSignalId: oneSignalUserId,
                        receiverOneSignalId: receiverOneSignalId,
                        receiver: receiverPhoneNumber,
                        creationDate: fieldValue.serverTimestamp()
                    })];
            case 3:
                _a.sent();
                return [4 /*yield*/, db
                        .collection('chats')
                        .doc(newChatID)
                        .collection('messages')
                        .doc()
                        .set({
                        message: 'Your new conversation is ready, say hello!',
                        sender: 'system',
                        creationDate: fieldValue.serverTimestamp()
                    })];
            case 4:
                _a.sent();
                return [4 /*yield*/, senderRef.update({ chat: fieldValue.arrayUnion(newChatID) })];
            case 5:
                _a.sent();
                return [4 /*yield*/, receiverRef.update({ chat: fieldValue.arrayUnion(newChatID) })];
            case 6:
                _a.sent();
                return [2 /*return*/, false];
        }
    });
}); });
exports.getChats = functions.https.onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var email, chatsGetter, chatIDs, userChatList, _i, userChatList_1, item, chatInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = data.email;
                console.log('email from data', email);
                console.log('email from context', context.auth.token.email);
                chatsGetter = [];
                return [4 /*yield*/, db.collection('users').doc(email).get()];
            case 1:
                chatIDs = _a.sent();
                userChatList = chatIDs.data().chat;
                _i = 0, userChatList_1 = userChatList;
                _a.label = 2;
            case 2:
                if (!(_i < userChatList_1.length)) return [3 /*break*/, 5];
                item = userChatList_1[_i];
                return [4 /*yield*/, db.collection('chats').doc(item).get()];
            case 3:
                chatInfo = _a.sent();
                chatsGetter.push(chatInfo.data());
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, chatsGetter];
        }
    });
}); });
exports.sendMessage = functions.https.onCall(function (data, context) { return __awaiter(void 0, void 0, void 0, function () {
    var message, id, chatConnection;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                message = data.message, id = data.id;
                chatConnection = db.collection('chats').doc(id);
                console.log('context val:', context.auth.token.email);
                return [4 /*yield*/, chatConnection.collection('messages').doc().set({
                        message: message,
                        creationDate: fieldValue.serverTimestamp(),
                        sender: context.auth.token.email
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
