//node automation.js --url="https://www.hackerrank.com" --config=config.json
let minimist = require("minimist");
let fs = require("fs");
let puppeteer = require("puppeteer");

let args = minimist(process.argv);

let configJSON = fs.readFileSync(args.config, "utf-8");
let configJSO = JSON.parse(configJSON);

async function run() {
    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });

    let pages = await browser.pages();
    let page = pages[0];
    await page.goto(args.url);

    await page.waitForSelector("a[data-event-action='Login']");
    await page.click("a[data-event-action='Login']");

    await page.waitForSelector("a[href='https://www.hackerrank.com/login']");
    await page.click("a[href='https://www.hackerrank.com/login']");

    await page.waitForSelector("input[name='username']");
    await page.type("input[name='username']", configJSO.userid, { delay: 30 });

    await page.waitForSelector("input[name='password']");
    await page.type("input[name='password']", configJSO.password, { delay: 30 });

    await page.waitForSelector("button[data-analytics='LoginPassword']");
    await page.click("button[data-analytics='LoginPassword']");

    await page.waitForSelector("a[data-analytics='NavBarContests']");
    await page.click("a[data-analytics='NavBarContests']");

    await page.waitForSelector("a[href='/administration/contests/']");
    await page.click("a[href='/administration/contests/']");


    // await page.waitForSelector("a[data-attr1='Last']");
    // let numPages = await page.$eval("a[data-attr1='Last']", function (atag) {
    // let totPages = parseInt(atag.getAttribute("data-page"));
    // return totPages;
    // });
    //   console.log(numPages);
    //   return;

    // for (let i = 1; i <= numPages; i++) {
    await handleAllContestOfAPage(page, browser);

    // if (i < numPages) {
    //     await page.waitForSelector("a[data-attr1='Right']");
    //     await page.click("a[data-attr1='Right']");
    // }
    // }

    //   console.log(curls);

    async function handleAllContestOfAPage(page, browser) {
        await page.waitForSelector("a.backbone.block-center");
        let curls = await page.$$eval("a.backbone.block-center", function (atags) {
            let urls = [];
            for (let i = 0; i < atags.length; i++) {
                let url = atags[i].getAttribute("href");
                urls.push(url);
            }
            return urls;

            // OR this urls can be done using arrow function

            // let urls = atags.map(atag => atag.getAttribute("href"))
            // return urls;

            // OR 

            // return atags.map(atag => atag.getAttribute("href"));

        });

        //     for (let i = 0; i < curls.length; i++) {
        //         let curl = curls[i];
        //         let ctab = await browser.newPage();

        //         await saveModeratorInContest(ctab, args.url + curl, configJSO.moderator);

        //         await ctab.close();
        //         await page.waitFor(1000);
        //     }
        // }
        // async function saveModeratorInContest(ctab, fullCurl, moderator) {
        //     await ctab.bringToFront();
        //     await ctab.goto(fullCurl);
        //     await ctab.waitFor(3000);

        //     await ctab.waitForSelector("li[data-tab='moderators']");
        //     await ctab.click("li[data-tab='moderators']");

        //     for (let i = 0; i < moderator.length; i++) {
        //         let mod = moderator[i];
        //         await ctab.waitForSelector("input#moderator");
        //         await ctab.type("input#moderator", mod, { delay: 30 });
        //         await ctab.keyboard.press("Enter");
        //     }

    }



    //   await browser.close();
}
run();

