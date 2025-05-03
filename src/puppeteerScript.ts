import puppeteer, { Browser, Page } from 'puppeteer';
import express, { Request, Response } from 'express';
import {showAlert,closeAlert, confirmationModal} from './startTeledeclarationAlerte';
import {clearInput} from "./utils";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
const app = express();
const port = 3000;
let isLoggedIn = false;
// Middleware to parse JSON body
app.use(express.json());

let browser: Browser;
let page: Page;

// Start Puppeteer browser and open the login page at server startup
const startPuppeteer = async () => {
    browser = await puppeteer.launch({
        headless: false, // Show the browser window
        defaultViewport: null,
        args: ['--start-maximized'],
    });

    browser.on('disconnected', () => {
        console.log('❌ Browser was closed by the user.');
        // You can handle cleanup or exit logic here
        process.exit(0); // Optional: shut down your app
    });

    page = await browser.newPage();
    await page.goto('https://novia.axeane.com/', { waitUntil: 'networkidle2' });
    showAlert(page,'Please login to continue and navigate to facture page',true);
    await delay(2000);
    closeAlert(page);
    await page.waitForSelector('#appMainContainer', { timeout: 0 });
    isLoggedIn = true
    showAlert(page,'you are logged in please start the process from kompta',false);
};

// POST endpoint to receive credentials and interact with the page
app.post('/create-facture', async (req: Request, res: Response) => {
    let isFormFilledWithSuccess = false
    if(!isLoggedIn){
        res.status(400).send({ error: 'you are not logged in' });
        return;
    }
    const { firstname,lastname } = req.body;


    if (!firstname || !lastname) {
        res.status(500).send({ error: 'firstname and lastname are required' });
        return;
    }
    if (!page) {
        res.status(500).send({ error: 'Puppeteer page is not initialized yet' });
        return;
    }

    res.send({ success: true });

    closeAlert(page);
    try{
        await page.goto('https://www.w3schools.com/html/html_forms.asp', { waitUntil: 'networkidle2' });
        // wait for page to show
        await page.waitForSelector(".contentcontainer", { timeout: 0 });

        // remove cookies propmt if exist
        await page.evaluate(() => {
            const el = document.querySelector('#snigel-cmp-framework'); // or '.some-class', etc.
            if (el) {
                el.remove();
            }
        });

        // Fill "First name" field
        const fnameSelector = '#fname';
        await page.waitForSelector(fnameSelector, { visible: true });
        await page.click(fnameSelector);
        await clearInput(page,fnameSelector);
        await page.type(fnameSelector, firstname, { delay: 100 });

        // Simulate typing (with keyboard events for realism)

        // Fill "Last name" field
        const lnameSelector = '#lname';
        await page.waitForSelector(lnameSelector, { visible: true });
        await page.click(lnameSelector);
        await clearInput(page,lnameSelector);
        await page.type(lnameSelector, lastname, { delay: 100 });

        const userConfirmation = await confirmationModal(page);
        if(userConfirmation){
            // Click submit
            const submitSelector = "div:nth-of-type(3) input[type='submit']";
            await page.waitForSelector(submitSelector, { visible: true });
            await page.click(submitSelector);
            isFormFilledWithSuccess = true;
        }else {
            await clearInput(page,fnameSelector);
            await clearInput(page,lnameSelector);

            showAlert(page,'you have canceled the process please restart it from kompta',false);
        }

        console.log('✅ Form filled and submitted.');

        // Optionally close the browser
        // await browser.close();

        console.log('Interaction completed.');
        if(isFormFilledWithSuccess){
            showAlert(page,'you have successfully submitted the form please check your email, this page will be closed in 20 seconds',false);
            setTimeout(async () => {
                await browser.close();
            },20000)
        }
    } catch (error) {
        console.error('Error running Puppeteer script:', error);
    } finally {
        // Keep the browser open for inspection or debugging
        // Uncomment the next line if you want to auto-close
        // await browser?.close();
    }


});

// Start both the Express server and Puppeteer
app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
    await startPuppeteer();
});
