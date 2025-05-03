import puppeteer, { Browser, Page } from 'puppeteer';

(async () => {
    // Launch Puppeteer
    const browser: Browser = await puppeteer.launch({
        headless: false, // Show the browser window
        defaultViewport: null,
        args: ['--start-maximized']
    });

    const page: Page = await browser.newPage();

    // Step 1: Set the viewport size
    await page.setViewport({
        width: 1139,
        height: 944,
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false,
        isLandscape: false
    });

    // Step 2: Navigate to the URL
    await page.goto('http://localhost:8000/');

    // Wait for the navigation event and assert the page title
    const pageTitle = await page.title();
    if (pageTitle === 'Axeane Kompta') {
        console.log('Successfully navigated to Axeane Kompta');
    } else {
        console.error('Page title did not match');
    }

    // Step 3: Double-click on the "Identifiant" input field
    await page.click('#loginInput');
    await page.type('#loginInput', 'support-ax');
    console.log('Entered username: support-ax');

    // Step 4: Simulate selecting all text in the input field (Ctrl + A)
    await page.keyboard.down('Control');
    await page.keyboard.press('a');
    await page.keyboard.up('Control');

    // Step 5: Change the value in the "Identifiant" input field to "K"
    await page.type('#loginInput', 'K');

    // Step 6: Change the value in the "Identifiant" input field to "Kompta-test"
    await page.type('#loginInput', 'Kompta-test');

    // Step 7: Double-click on the "Mot de passe" input field
    await page.click('#passwordInput');

    // Step 8: Change the value in the "Mot de passe" input field to "test-kompta"
    await page.type('#passwordInput', 'test-kompta');

    // Step 9: Add a confirmation prompt for the user before clicking the "Authentification" button
    const userConfirmed = await page.evaluate(() => {
        // Display a confirmation prompt in the browser
        return window.confirm('Voulez-vous valider les changements avant de vous authentifier ?');
    });

    // If the user confirms, proceed with clicking the "Authentification" button
    if (userConfirmed) {
        // Click the "Authentification" button
        await page.click('div:nth-of-type(1) > div.modal-footer span');
        console.log('User confirmed the changes and clicked "Authentification".');
    } else {
        console.log('User did not confirm the changes.');
    }

    // Close the browser
    await page.waitForSelector('body');  // This keeps the script alive while waiting for the user to close the browser.
})();
