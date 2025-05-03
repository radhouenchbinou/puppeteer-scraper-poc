import {Page} from "puppeteer";

export const clearInput = async (page:Page,selector:string) => {
    await page.click(selector, { clickCount: 3 });
    await page.keyboard.press('Backspace');
}
