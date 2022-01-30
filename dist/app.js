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
const cheerio_1 = __importDefault(require("cheerio"));
const axios_1 = __importDefault(require("axios"));
const getBlockInfo = () => __awaiter(void 0, void 0, void 0, function* () {
    const siteUrl = "https://etherscan.io/blocks";
    const { data } = yield (0, axios_1.default)({
        method: "GET",
        url: siteUrl,
    });
    const $ = cheerio_1.default.load(data);
    const elmSelector = ".table > tbody:nth-child(2) > tr";
    const keys = [
        "block",
        "age",
        "tx",
        "uncles",
        "miner",
        "gasUsed",
        "gasLimit",
        "baseFee",
        "ethReward",
        "burntFeesEth"
    ];
    const blockArr = [];
    $(elmSelector).each((parentI, parentElm) => {
        let keyI = 0;
        const block = {};
        $(parentElm).children().each((childI, childElm) => {
            const tdVal = $(childElm).text();
            if (!$(childElm).hasClass("showDate")) {
                if (tdVal) {
                    block[keys[keyI]] = tdVal;
                    keyI++;
                }
            }
        });
        blockArr.push(block);
    });
    return blockArr;
});
const app = (0, express_1.default)();
app.get('/api/blocks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blockInfo = yield getBlockInfo();
    return res.status(200).json({
        result: blockInfo,
    });
}));
app.listen(3000, () => console.log("Running."));
