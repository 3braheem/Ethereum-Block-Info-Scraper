import express, { Application, Request, Response, NextFunction } from 'express';
import cheerio from 'cheerio';
import axios from 'axios';

const getBlockInfo = async () => {
    const siteUrl = "https://etherscan.io/blocks";
    const { data } = await axios({
        method: "GET",
        url: siteUrl,
    });
    
    const $ = cheerio.load(data);
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
    ]
    const blockArr: any[] = [];

    $(elmSelector).each((parentI, parentElm) => {
        let keyI = 0;
        const block: {[index: string]: any} = {};

        $(parentElm).children().each((childI, childElm) => {
            let tdVal = $(childElm).text();
            if (!$(childElm).hasClass("showDate")) {
                if (tdVal) {
                    block[keys[keyI]] = tdVal;
                    keyI++;
                }
            }
        })
        blockArr.push(block);
    });
    return blockArr;
}

const app: Application = express();

app.get('/', async (req: Request, res: Response) => {
    const blockInfo = await getBlockInfo();
    if (!blockInfo) {
        throw new Error("Data couldn't be reached.");
    }
    res.status(200).json({
        result: blockInfo,
    });
});

app.listen(8080, () => console.log("Running."));