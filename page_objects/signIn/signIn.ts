import { Page } from "@playwright/test";
import BasePage from '../base/base'
import AccountPage from "../account/account";
import { SignInData } from "./signInInterfaces";

export default class SignInPage extends BasePage {
    private xpathEmailField = "//input[@id = 'email']"
    private xpathPasswordField = "//input[@id = 'pass']"
    private xpathSignInButton = "//button[@id='send2']"
    private xpathEmailErrorField = "//div[@id = 'email-error']"
    private xpathPasswordErrorField = "//div[@id = 'pass-error']"
    private xpathMessage = "//div[@role='alert']"

    constructor(page: Page) {
        super(page);
    }

    async inputEmail(email: string) {
        if (email.trim() !== "") {
            await this.inputTextField(this.xpathEmailField, email);
        }
    }

    async inputPassword(password: string) {
        if (password.trim() !== "") {
            await this.inputTextField(this.xpathPasswordField, password);
        }
    }
    
    async clickSignInButton() {
        await this.clickButton(this.xpathSignInButton);
        await this.page.waitForLoadState();
        return new AccountPage(this.page);
    }

    async verifyErrorMessage(data: SignInData) {
        var errors = {} as SignInData;

        if (!this.isValidEmail(data.email)) {
            errors.email = this.xpathEmailErrorField;
        }
        if (data.password === "") {
            errors.password = this.xpathPasswordErrorField;
        }
        if (Object.keys(errors).length === 0) {
            await this.verifyText(this.xpathMessage, data.expected);
        } else {
            for (let i = 0; i < Object.values(errors).length; i++) {
                const expected = Array.isArray(data.expected) ? data.expected[i] : data.expected;
                await this.verifyText(Object.values(errors)[i], expected);
            }
        }
    }
}