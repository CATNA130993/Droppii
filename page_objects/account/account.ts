import { Page } from "@playwright/test";
import BasePage from '../base/base'

export default class AccountPage extends BasePage {
    private xpathMessage = "//div[@role='alert']"
    private xpathWelcomeMesssage = "//header//span[@class='logged-in']"

    constructor(page: Page) {
        super(page);
    }

    async verifyMessage(expectedMessage: string) {
        await this.verifyText(this.xpathMessage, expectedMessage);
    }

    async verifyWelcomeMessage(expectedMessage: string) {
        await this.verifyText(this.xpathWelcomeMesssage, expectedMessage);
    }
}