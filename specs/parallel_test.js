var assert = require("assert"),
    webdriver = require("selenium-webdriver"),
    conf_file = process.argv[3] || "conf/single.conf.js";

const { Builder, By, Key, until, logging } = require('selenium-webdriver');
const { FileDetector } = require(`selenium-webdriver/remote`)
// require(`chromedriver`);
const { expect } = require(`chai`).use(require(`chai-as-promised`));

var capabilities = require("../" + conf_file).capabilities;

var buildDriver = function (caps) {
    return new webdriver.Builder()
        .usingServer(
            "http://" +
            LT_USERNAME +
            ":" +
            LT_ACCESS_KEY +
            "@hub.lambdatest.com/wd/hub"
        )
        .withCapabilities(caps)
        .build();
};

capabilities.forEach(function (caps) {

    describe("Lambda Test cretification project " + caps.browserName, async function () {
        let driver, filename;
        this.timeout(0);

        before(async function () {
            caps.name = this.currentTest.title;
            driver = buildDriver(caps);
            await driver.get('https://www.lambdatest.com/automation-demos/');
        });

        it(`accept cookies`, async () => {
            let cookieLocator = await driver.findElement(By.css(`.cookiesdiv`));
            await driver.wait(until.elementIsVisible(cookieLocator), 2000);
            await (await driver.findElement(By.css(`.btn_accept_ck`))).click();
            expect(await (await driver.findElement(By.css(`.cookiesdiv`))).isDisplayed()).to.be.false;
        })

        it(`Login to application`, async () => {
            await driver.findElement(By.css(`[id="username"]`)).sendKeys(`lambda`);
            await driver.findElement(By.css(`[id="password"]`)).sendKeys(`lambda123`, Key.RETURN);
            expect(await (await driver.findElement(By.css(`[id="developer-name"]`))).isDisplayed()).to.be.true;
        })

        it(`Check the form actions`, async () => {
            await driver.findElement(By.css(`[id="developer-name"]`)).sendKeys(`bharathkumarkarthick@gmail.com`);
            expect(await driver.findElement(By.css(`[id="developer-name"]`)).getAttribute(`value`)).to.equal(`bharathkumarkarthick@gmail.com`)
            await (await driver.findElement(By.css(`[id="populate"]`))).click();
            await driver.wait(until.alertIsPresent(), 2000);
            await (await driver.switchTo().alert()).accept();

            if (!await (await driver.findElement(By.css(`[id="month"]`))).isSelected())
                await (await driver.findElement(By.css(`[id="month"]`))).click();
            expect(await (await driver.findElement(By.css(`[id="month"]`))).isSelected()).to.equal(true);

            if (!await (await driver.findElement(By.css(`[name="customer-service"]`))).isSelected())
                await (await driver.findElement(By.css(`[name="customer-service"]`))).click();
            expect(await (await driver.findElement(By.css(`[name="customer-service"]`))).isSelected()).to.equal(true);

            await (await driver.findElement(By.xpath(`//option[text()="Wallets"]`))).click();
            expect(await driver.executeScript(`return $("option:selected").text()`)).to.equal(`Wallets`);

            if (!await (await driver.findElement(By.css(`[id="tried-ecom"]`))).isSelected())
                await (await driver.findElement(By.css(`[id="tried-ecom"]`))).click();
            expect(await (await driver.findElement(By.css(`[name="tried-ecom"]`))).isSelected()).to.equal(true);
        })

        it(`slider test`, async () => {
            await (await driver.findElement(By.css(`.ui-slider-handle`))).click();
            let i = 1;
            while (i < 9) {
                await driver.findElement(By.css(`.ui-slider-handle`)).sendKeys(Key.RIGHT)
                i++
            }
            expect(await driver.findElement(By.css(`[id="slider"] span`)).getAttribute(`style`)).to.equal(`left: 88.8889%;`)
        })

        it(`Forms - Comment`, async () => {
            await driver.findElement(By.css(`[id="comments"]`)).sendKeys(`This is comment`);
            expect(await driver.findElement(By.css(`[id="comments"]`)).getAttribute("value")).to.equal(`This is comment`);
        })

        it(`Download Jenkins SVG icon`, async () => {
            await driver.executeScript("window.open('https://www.lambdatest.com/selenium-automation', '_blank');");
            if(caps.platform.includes(`MacOS`))
            await driver.sleep(5000);
            handles = await driver.getAllWindowHandles();
            await driver.switchTo().window(handles[1]);
            expect(await driver.getTitle()).to.equal(`Selenium Grid on Cloud | Online Selenium Test Automation`)
            let imgUrl = await driver.findElement(By.css(`.citoolbox [alt="LambdaTest Jenkins integration"]`)).getAttribute(`src`);
            let http = require('http');
            http = require('follow-redirects').https;
            const fs = require('fs');
            filename = imgUrl.replace(/^.*[\\\/]/, '')
            const file = fs.createWriteStream(filename);
            const request = http.get(imgUrl, function (response) {
                response.pipe(file);
            });
        })

        it(`File upload`, async () => {
            await driver.switchTo().window(handles[0]);
            await driver.setFileDetector(new FileDetector);
            let path = require('os').type() === `Linux` ? __dirname.replace("\\", "/").split("/") : __dirname.split("\\");
            let strippedPath = require('os').type() === `Linux` ? path.slice(0, path.length - 1).join("/") : path.slice(0, path.length - 1).join("\\");
            let absoluteFilePath = require('os').type() === `Linux` ? `${strippedPath}/${filename}` : `${strippedPath}\\${filename}`;
            await driver.findElement(By.css(`[id="file"][type="file"]`)).sendKeys(absoluteFilePath);
            await (await driver.switchTo().alert()).accept();
        })

        it(`Submit form`, async () => {
            await (await driver.findElement(By.css(`[id="submit-button"]`))).click();
            expect(await driver.findElement(By.css(`[id="message"] h1`)).getText()).to.equal(`Thank you!`)
            expect(await driver.findElement(By.css(`[id="message"] p`)).getText()).to.equal(`You have successfully submitted the form.`)
            expect(await driver.findElement(By.css(`[id="message"] img`)).isDisplayed()).to.equal(true)
        })


        afterEach(function () {
            if (this.currentTest.isPassed) {
                driver.executeScript("lambda-status=passed");
            } else {
                driver.executeScript("lambda-status=failed");
            }
            //   driver.quit().then(function() {
            //     done();
            //   });
        });

        after(async()=>{
            await driver.quit()
        })
    });
});
