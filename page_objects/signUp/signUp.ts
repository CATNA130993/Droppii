import { Page } from "@playwright/test";
import BasePage from '../base/base'
import AccountPage from "../account/account";
import { SignUpData } from "./signUpInterfaces";

export default class SignUpPage extends BasePage {
    private xpathFirstNameField = "//input[@id = 'firstname']"
    private xpathLastNameField = "//input[@id = 'lastname']"
    private xpathEmailField = "//input[@id = 'email_address']"
    private xpathPasswordField = "//input[@id = 'password']"
    private xpathConfirmPasswordField = "//input[@id = 'password-confirmation']"
    private xpathCreateAccountButton = "//button[@title='Create an Account']"
    private xpathFirstNameErrorField = "//div[@id = 'firstname-error']"
    private xpathLastNameErrorField = "//div[@id = 'lastname-error']"
    private xpathEmailErrorField = "//div[@id = 'email_address-error']"
    private xpathPasswordErrorField = "//div[@id = 'password-error']"
    private xpathConfirmPasswordErrorField = "//div[@id = 'password-confirmation-error']"
    private xpathMessage = "//div[@role='alert']"

    constructor(page: Page) {
        super(page);
    }

    async inputFirstName(firstName: string) {
        if (firstName !== "") {
            await this.inputTextField(this.xpathFirstNameField, firstName);
        }
    }

    async inputLastName(lastName: string) {
        if (lastName !== "") {
            await this.inputTextField(this.xpathLastNameField, lastName);
        }
    }

    async inputEmail(email: string) {
        if (email !== "") {
            await this.inputTextField(this.xpathEmailField, email);
        }
    }

    async inputPassword(password: string) {
        if (password !== "") {
            await this.inputTextField(this.xpathPasswordField, password);
        }
    }

    async inputConfirmPassword(confirmPassword: string) {
        if (confirmPassword.trim() !== "") {
            await this.inputTextField(this.xpathConfirmPasswordField, confirmPassword);
        }
    }

    async clickCreateAccountButton() {
        await this.clickButton(this.xpathCreateAccountButton);
        await this.page.waitForLoadState("domcontentloaded");
        return new AccountPage(this.page);
    }

    async verifyErrorMessage(data: SignUpData) {
        var errors = {} as SignUpData;

        if (data.firstName === "") {
            errors.firstName = this.xpathFirstNameErrorField;
        }
        if (data.lastName === "") {
            errors.lastName = this.xpathLastNameErrorField;
        }
        if (!this.isValidEmail(data.email)) {
            errors.email = this.xpathEmailErrorField;
        }
        if (!this.isValidPassword(data.password)) {
            errors.password = this.xpathPasswordErrorField;
        }
        if (data.password !== data.confirmPassword) {
            errors.confirmPassword = this.xpathConfirmPasswordErrorField;
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