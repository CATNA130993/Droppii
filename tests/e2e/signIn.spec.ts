import { test } from '@playwright/test';
import HomePage from '../../page_objects/home/home'
import SignInPage from '../../page_objects/signIn/signIn';
import AccountPage from '../../page_objects/account/account';

test.describe('Sign In', () => {
    test("Verify that the system displays a success message when users click on the 'Sign In' button after they input all required fields.", async ({ page }) => {
        const homePage = new HomePage(page);
        let signInPage: SignInPage;
        let accountPage: AccountPage;
        const testData = await homePage.readDataJson("./datas/signIn.json", "Valid");
        for (const data of testData) {
            await test.step('Verify that the system navigates to the home page when users enter the URL.', async () => {
                await homePage.navigate("https://magento.softwaretestingboard.com/");
            });
            await test.step('Verify that the system displays the home page.', async () => {
                await homePage.verifyTitle("Home Page");
            });
            await test.step('Users click on the sign up button.', async () => {
                signInPage = await homePage.openSignInPage();
            });
            await test.step('Verify the system displays the sign in page.', async () => {
                await signInPage.verifyTitle("Customer Login");
            });
            await test.step("Users input '${data.email}' into 'Email' field.", async () => {
                await signInPage.inputEmail(data.email);
            });
            await test.step("Users input '${data.password}' into 'Password' field.", async () => {
                await signInPage.inputPassword(data.password);
            });
            await test.step("Users click on the 'Sign In' button.", async () => {
                accountPage = await signInPage.clickSignInButton();
            });
            await test.step('Verify that the system displays the home page.', async () => {
                await accountPage.verifyTitle("Home Page");
            });
            await test.step('Verify that the system displays the welcome message.', async () => {
                await accountPage.verifyWelcomeMessage(data.expected);
            });
        }
    });

    test("Verify that the system displays an error message when users click on the 'Sign In' button after they input some invalid fields.", async ({ page }) => {
        const homePage = new HomePage(page);
        let signInPage: SignInPage;
        const testData = await homePage.readDataJson("./datas/signIn.json", "Invalid");
        for (const data of testData) {
            await test.step('Verify that the system navigates to the home page when users enter the URL.', async () => {
                await homePage.navigate("https://magento.softwaretestingboard.com/");
            });
            await test.step('Verify that the system displays the home page.', async () => {
                await homePage.verifyTitle("Home Page");
            });
            await test.step('Users click on the sign up button.', async () => {
                signInPage = await homePage.openSignInPage();
            });
            await test.step('Verify the system displays the sign in page.', async () => {
                await signInPage.verifyTitle("Customer Login");
            });
            await test.step("Users input '${data.email}' into 'Email' field.", async () => {
                await signInPage.inputEmail(data.email);
            });
            await test.step("Users input '${data.password}' into 'Password' field.", async () => {
                await signInPage.inputPassword(data.password);
            });
            await test.step("Users click on the 'Sign In' button.", async () => {
                await signInPage.clickSignInButton();
            });
            await test.step("Verify that the system displays an error message responding to the invalid field.", async () => {
                await signInPage.verifyErrorMessage(data);
            });
        }
    });
});
