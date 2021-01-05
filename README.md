# Mocha-Tutorial
![LambdaTest Logo](https://www.lambdatest.com/images/logo.svg)

![Mocha](https://www.lambdatest.com/blog/wp-content/uploads/2019/07/Front-end-development-frameworks-3-768x230.png)

**Automate** your **acceptance tests** and run them in **real browsers!**

## Prerequisites for Mocha tutorial for Selenium and JavaScript
* **Node.js and 
Package Manager (npm)** : Install Node.js from [here](https://nodejs.org/en/#home-downloadhead) Or Install Node.js with [Homebrew](http://brew.sh/)
```
$ brew install node
```
* **Mocha Package Module** :  <code>npm</code> to install Mocha
```
$ npm init
```
Install the Mocha using npm 
```
$ npm install -g mocha 
```
<code>npm</code> to install Mocha in <code>./node_modules/.bin folder</code>
```
$ npm install --save-dev mocha
```

* **LambdaTest Credentials**
   * Set LambdaTest username and access key in environment variables. It can be obtained from [LambdaTest Automation Dashboard](https://automation.lambdatest.com/)    
    example:
   - For linux/mac
    ```
    export LT_USERNAME="YOUR_USERNAME"
    export LT_ACCESS_KEY="YOUR ACCESS KEY"

    ```
    - For Windows
    ```
    set LT_USERNAME="YOUR_USERNAME"
    set LT_ACCESS_KEY="YOUR ACCESS KEY"

    ```
3. Setup
   * Clone the repo
   * Install dependencies `npm install`
   * Update `*.conf.js` files inside the `conf/` directory with your LambdaTest Username and Access Key

## Executing Mocha JavaScript Testing

We will create a project directory named mocha_test and then we will create a subfolder name scripts with a test script name single_test.js inside it.

Finally, we will initialize our project by hitting the command npm init. This will create a package.json file in an interactive way, which will contain all our required project configurations. It will be required to execute our test script <code>single_test.js</code>.

```
mocha_selenium_sample
        | -- specs
                    | -- parallel_test.js
        | -- package.json
{
  "name": "Bharath-Lambda-certification",
  "version": "0.0.1",
  "description": "Selenium. Mocha and LambdaTest",
  "scripts": {
    "test": "npm run parallel",
    "parallel": "./node_modules/.bin/mocha specs/parallel_test.js conf/parallel.conf.js --timeout=100000"
  },
  "keywords": [
    "mocha",
    "LambdaTest",
    "selenium",
   ],
  "dependencies": {
    "bluebird": "^3.4.6",
    "mocha": "^6.2.0",
    "selenium-webdriver": "^3.0.0-beta-3"
  },
  "devDependencies": {
    "chai": "^4.2.0",
    "chai-as-promised": "^7.1.1",
    "follow-redirects": "^1.13.1"
  }
}

```
### Test Scenario

```
Now we have a first script ready. Let us specify the capabilituies to run the script on LambdaTest cloud-based Selenium Grid.
```
LT_USERNAME = process.env.LT_USERNAME || "<your username>";
LT_ACCESS_KEY = process.env.LT_ACCESS_KEY || "<your accessKey>";

exports.capabilities = {
  'build': 'Your-build-name', //Build name
  'name': 'Your Test Name', // Test name
  'platform':'Windows 10', // OS name
  'browserName': 'chrome', // Browser name
  'version': '73.0', // Browser version
  'visual': false,  // To take step by step screenshot
  'network':false,  // To capture network Logs
  'console':false, // To capture console logs.
  'tunnel': false // If you want to run the localhost than change it to true
  };
```
## Parallel Testing for Mocha JavaScript

Will use the same test script over different configration to demonstarte parallel testing. Parallel testing with Mocha will help you to run multiple test cases simultaneously.

* **Parallel Test**- Here is JavaScript file to run Mocha Testing on a parallel environment i.e. different operating system (Windows 10 and Mac OS Catalina) and different browsers (Chrome, Mozilla Firefox, and Safari).


```
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

```

Now lets define the capabilities. Since, we are performig parallel testing over different configrations we will make use of <code>multiCapabilities[]</code>.

```
LT_USERNAME = process.env.LT_USERNAME || "<your username>";
LT_ACCESS_KEY = process.env.LT_ACCESS_KEY || "<your accessKey>";

var config = {
  commanCapabilities: {
    build: "Mocha-Selenium-Sample", //Build name
    tunnel: false // Make it true to run the localhost through tunnel
  },
  multiCapabilities: [
    {
      // Desired capabilities
      name: "Your Test Name", // Test name
      platform: "Windows 10", // OS name
      browserName: "firefox",
      version: "66.0",
      visual: false, // To take step by step screenshot
      network: false, // To capture network Logs
      console: false // To capture console logs.
    },
    {
      name: "Your Test Name", // Test name
      platform: "Windows 10", // OS name
      browserName: "chrome",
      version: "75.0",
      visual: false, // To take step by step screenshot
      network: false, // To capture network Logs
      console: false // To capture console logs.
    }
  ]
};

exports.capabilities = [];
// Code to support common capabilities
config.multiCapabilities.forEach(function(caps) {
  var temp_caps = JSON.parse(JSON.stringify(config.commanCapabilities));
  for (var i in caps) temp_caps[i] = caps[i];
  exports.capabilities.push(temp_caps);
});

```


## Running your tests
- To run a single test, run `npm run single`
- To run parallel tests, run `npm run parallel`

 Know how many concurrent sessions needed by using our [Concurrency Test Calculator](https://www.lambdatest.com/concurrency-calculator?ref=github)
 
 Output from the command line
 
![ouptput](https://www.lambdatest.com/blog/wp-content/uploads/2020/01/outputcode.png)

Below we see a screenshot that depicts our Mocha code is running over different browsers i.e Chrome, Firefox and Safari on the LambdaTest Selenium Grid Platform. The results of the test script execution along with the logs can be accessed from the LambdaTest Automation dashboard.

![Automation-Dashboard](https://www.lambdatest.com/blog/wp-content/uploads/2020/01/automationdashboard.png)

 ###  Routing traffic through your local machine
 - Set tunnel value to `true` in test capabilities
 > OS specific instructions to download and setup tunnel binary can be found at the following links.
 >    - [Windows](https://www.lambdatest.com/support/docs/display/TD/Local+Testing+For+Windows)
 >    - [Mac](https://www.lambdatest.com/support/docs/display/TD/Local+Testing+For+MacOS)
 >    - [Linux](https://www.lambdatest.com/support/docs/display/TD/Local+Testing+For+Linux)

 ### Important Note:
 Some Safari & IE browsers, doesn't support automatic resolution of the URL string "localhost". Therefore if you test on URLs like "http://localhost/" or "http://localhost:8080" etc, you would get an error in these browsers. A possible solution is to use "localhost.lambdatest.com" or replace the string "localhost" with machine IP address. For example if you wanted to test "http://localhost/dashboard" or, and your machine IP is 192.168.2.6 you can instead test on "http://192.168.2.6/dashboard" or "http://localhost.lambdatest.com/dashboard".


## Notes
* You can view your test results on the [LambdaTest Automation Dashboard](https://www.automation.lambdatest.com)
* To test on a different set of browsers, check out our [capabilities generator](https://www.lambdatest.com/capabilities-generator)

## About LambdaTest

[LambdaTest](https://www.lambdatest.com/) is a cloud based selenium grid infrastructure that can help you run automated cross browser compatibility tests on 2000+ different browser and operating system environments. LambdaTest supports all programming languages and frameworks that are supported with Selenium, and have easy integrations with all popular CI/CD platforms. It's a perfect solution to bring your [selenium automation testing](https://www.lambdatest.com/selenium-automation) to cloud based infrastructure that not only helps you increase your test coverage over multiple desktop and mobile browsers, but also allows you to cut down your test execution time by running tests on parallel.

## Resources
### [SeleniumHQ Documentation](http://www.seleniumhq.org/docs/)
### [Mocha Documentation](https://mochajs.org/)
