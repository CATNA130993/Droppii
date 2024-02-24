import { Page, expect } from "@playwright/test";
import BasePage from '../base/base'
import SignUpPage from '../signUp/signUp'
import SignInPage from '../signIn/signIn'

export default class HomePage extends BasePage {
    xpathSignUpButton = "//header//a[text() = 'Create an Account']"
    xpathSignInButton = "//header//a[contains(text(),'Sign In')]"

    constructor(page: Page) {
        super(page);
    }

    async clickSignUpButton() {
        await this.clickButton(this.xpathSignUpButton);
    }

    async openSignInPage() {
        await this.clickButton(this.xpathSignInButton);
        await this.page.waitForLoadState();
        return new SignInPage(this.page);
    }
}