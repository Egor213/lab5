import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

(async function testLoginPage() {
    let options = new chrome.Options();
    options.addArguments('headless');  

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)  
        .build();

    try {
        await driver.get('http://localhost:8080/login');

        const selectElement = await driver.wait(until.elementLocated(By.tagName('select')), 3000);
        await selectElement.click();
        const egorOption = await driver.wait(until.elementLocated(By.xpath("//option[text()='Egor']")), 3000);
        await egorOption.click();
        const loginLable = await driver.wait(until.elementLocated(By.tagName('h1')), 3000);
        loginLable.click();
        const btnLogin = await driver.wait(until.elementLocated(By.css('.btn')), 3000);
        btnLogin.click();
        const trading = await driver.wait(until.elementLocated(By.linkText('Торги')), 3000);
        trading.click();

        const priceBefore = await driver.wait(until.elementLocated(By.css('.open-sell')), 3000).getText();
        const floatPriceBefore = parseFloat((priceBefore.replace('$', '')).replace(',', ''))
    

        const buyBtn = await driver.wait(until.elementLocated(By.xpath("//button[text()='Купить']")), 5000);
        buyBtn.click();
        const priceElem = await driver.wait(until.elementLocated(By.tagName("p")), 5000);
        const priceLable = await priceElem.getText();
        const curPrice = parseFloat(priceLable.match(/(\d+\.\d+)/));
   
        const inputCount = await driver.wait(until.elementLocated(By.css('.form-control')), 5000);
        await inputCount.sendKeys('1');

        const finBuyBtn = await driver.wait(until.elementLocated(By.css(".btn.btn-primary")), 5000);
        finBuyBtn.click();

        const priceAfter = await driver.wait(until.elementLocated(By.css('.open-sell')), 3000).getText();
        const floatPriceAfter = parseFloat((priceAfter.replace('$', '')).replace(',', ''))
        if ((floatPriceBefore - floatPriceAfter - curPrice) < 0.1) {
            console.log('Баланс уменьшился на стоимость акции!');
        } else {
            console.log('Баланс не уменьшился на стоимость акции.');
        }


        const sellBtn = await driver.wait(until.elementLocated(By.xpath("//button[text()='Продать']")), 5000);
        sellBtn.click();
        const priceElemSell = await driver.wait(until.elementLocated(By.tagName("p")), 5000);
        const priceLableSell = await priceElemSell.getText();
        const curPriceSell = parseFloat(priceLableSell.match(/(\d+\.\d+)/));
        const inputCountSell = await driver.wait(until.elementLocated(By.css('.form-control')), 5000);
        await inputCountSell.sendKeys('1');
        const finSellBtn = await driver.wait(until.elementLocated(By.css(".btn.btn-danger")), 5000);
        finSellBtn.click();
        const priceAfterSell = await driver.wait(until.elementLocated(By.css('.open-sell')), 3000).getText();
        const floatPriceAfterSell = parseFloat((priceAfterSell.replace('$', '')).replace(',', ''))
        
        if ((floatPriceAfter + curPriceSell - floatPriceAfterSell - 1) < 0.1) {
            console.log('Баланс увеличился на стоимость акции!');
        } else {
            console.log('Баланс не увеличился на стоимость акции.');
        }
        const row = await driver.findElement(By.css('tbody tr')).getText();
        const matches = row.match(/(\d+(\.\d+)?)/g);
        const firstNumber = parseFloat(matches[0]);
        const secondNumber = parseFloat(matches[1]);
        let firstNumber1 = firstNumber
        let secondNumber1 = secondNumber
        while (true) {
            const row1 = await driver.findElement(By.css('tbody tr')).getText();
            const matches1 = row1.match(/(\d+(\.\d+)?)/g);
            firstNumber1 = parseFloat(matches1[0]);
            secondNumber1 = parseFloat(matches1[1]);
            if (secondNumber != secondNumber1)
                break
        }
        const second = Math.abs(secondNumber1 - secondNumber)
        const first = Math.abs(firstNumber1 - firstNumber)
        
        if (Math.abs(first - second) < 0.1) {
            console.log('Выгода показывает корректное изменение цены!')
        } else {
            console.log('Выгода показывает некорректное изменение цены!')
        }

    // await driver.sleep(5000); 
    } catch (error) {
        console.error('Тест не пройден:', error.message);
    } finally {
        await driver.quit();
    }
})();
