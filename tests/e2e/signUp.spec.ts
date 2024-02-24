import { test } from '@playwright/test';
import HomePage from '../../page_objects/home/home'
import SignUpPage from '../../page_objects/signUp/signUp';
import AccountPage from '../../page_objects/account/account';

test.describe('Sign Up', () => {
    test("Verify that the system displays the home page when users go to Luma's store.", async ({ page }) => {
        const homePage = new HomePage(page);
        await test.step('Verify that the system navigates to the home page when users enter the URL.', async () => {
            await homePage.navigate("https://magento.softwaretestingboard.com/");
        });
        await test.step('Verify that the system displays the home page.', async () => {
            await homePage.verifyTitle("Home Page");
        });
    });

    test("Verify that the system displays the registration page when users click on the 'Create an Account' button.", async ({ page }) => {
        const homePage = new HomePage(page);
        await test.step('Verify that the system navigates to the home page when users enter the URL.', async () => {
            await homePage.navigate("https://magento.softwaretestingboard.com/");
        });
        await test.step('Verify that the system displays the home page.', async () => {
            await homePage.verifyTitle("Home Page");
        });
        await test.step('Users click on the sign up button.', async () => {
            await homePage.clickSignUpButton();
        });
        let signUpPage: SignUpPage = new SignUpPage(page);
        await test.step('Verify the system displays the sign up page.', async () => {
            await signUpPage.verifyTitle("Create New Customer Account");
        });
    });

    test("Verify that the system displays a success message when users click on the 'Create an Account' button after they input all required fields.", async ({ page }) => {
        const homePage = new HomePage(page);
        let accountPage: AccountPage;
        const testData = await homePage.readDataJson("./datas/signUp.json", "Valid");
        for (const data of testData) {
            await test.step('Verify that the system navigates to the home page when users enter the URL.', async () => {
                await homePage.navigate("https://magento.softwaretestingboard.com/");
            });
            await test.step('Verify that the system displays the home page.', async () => {
                await homePage.verifyTitle("Home Page");
            });
            await test.step('Users click on the sign up button.', async () => {
                await homePage.clickSignUpButton();
            });
            let signUpPage: SignUpPage = new SignUpPage(page);
            await test.step('Verify the system displays the sign up page.', async () => {
                await signUpPage.verifyTitle("Create New Customer Account");
            });
            await test.step("Users input '${data.firstName}' into 'First Name' field.", async () => {
                await signUpPage.inputFirstName(data.firstName);
            });
            await test.step("Users input '${data.lastName}' into 'Last Name' field.", async () => {
                await signUpPage.inputLastName(data.lastName);
            });
            await test.step("Users input '${data.email}' into 'Email' field.", async () => {
                await signUpPage.inputEmail(data.email);
            });
            await test.step("Users input '${data.password}' into 'Password' field.", async () => {
                await signUpPage.inputPassword(data.password);
            });
            await test.step("Users input '${data.confirmPassword}' into 'Confirm Password' field.", async () => {
                await signUpPage.inputConfirmPassword(data.confirmPassword);
            });
            await test.step("Users click on the 'Create an Account' button.", async () => {
                accountPage = await signUpPage.clickCreateAccountButton();
            });
            await test.step("Verify the success message when the account has been successfully created.", async () => {
                await accountPage.verifyMessage(data.expected);
            });
        }
    });

    test("Verify that the system displays an error message when users click on the 'Create an Account' button after they input some invalid fields.", async ({ page }) => {
        const homePage = new HomePage(page);
        const testData = await homePage.readDataJson("./datas/signUp.json", "Invalid");
        for (const data of testData) {
            await test.step('Verify that the system navigates to the home page when users enter the URL.', async () => {
                await homePage.navigate("https://magento.softwaretestingboard.com/");
            });
            await test.step('Verify that the system displays the home page.', async () => {
                await homePage.verifyTitle("Home Page");
            });
            await test.step('Users click on the sign up button.', async () => {
                await homePage.clickSignUpButton();
            });
            let signUpPage: SignUpPage = new SignUpPage(page);
            await test.step('Verify the system displays the sign up page.', async () => {
                await signUpPage.verifyTitle("Create New Customer Account");
            });
            await test.step("Users input '${data.firstName}' into 'First Name' field.", async () => {
                await signUpPage.inputFirstName(data.firstName);
            });
            await test.step("Users input '${data.lastName}' into 'Last Name' field.", async () => {
                await signUpPage.inputLastName(data.lastName);
            });
            await test.step("Users input '${data.email}' into 'Email' field.", async () => {
                await signUpPage.inputEmail(data.email);
            });
            await test.step("Users input '${data.password}' into 'Password' field.", async () => {
                await signUpPage.inputPassword(data.password);
            });
            await test.step("Users input '${data.confirmPassword}' into 'Confirm Password' field.", async () => {
                await signUpPage.inputConfirmPassword(data.confirmPassword);
            });
            await test.step("Users click on the 'Create an Account' button.", async () => {
                await signUpPage.clickCreateAccountButton();
            });
            await test.step("Verify that the system displays an error message responding to the invalid field.", async () => {
                await signUpPage.verifyErrorMessage(data);
            });
        }
    });

    test("Verify that the system displays a success message when users click on the 'Create an Account' button after the form is automatically filled out by the system.", async ({ page }) => {
        const homePage = new HomePage(page);
        let signUpPage: SignUpPage = new SignUpPage(page);
        await test.step('Verify that the system navigates to the home page when users enter the URL.', async () => {
            await homePage.navigate("https://magento.softwaretestingboard.com/");
        });
        await test.step('Verify that the system displays the home page.', async () => {
            await homePage.verifyTitle("Home Page");
        });
        await test.step('Users click on the sign up button.', async () => {
            await homePage.clickSignUpButton();
        });
        await test.step('Verify the system displays the sign up page.', async () => {
            await signUpPage.verifyTitle("Create New Customer Account");
        });
        let firstName = await signUpPage.generateFirstName();
        await test.step("Users input '${firstName}' into 'First Name' field.", async () => {
            await signUpPage.inputFirstName(firstName);
        });
        let lastName = await signUpPage.generateLastName();
        await test.step("Users input '${lastName}' into 'Last Name' field.", async () => {
            await signUpPage.inputLastName(lastName);
        });
        let email = await signUpPage.generateEmail(firstName, lastName);
        await test.step("Users input '${email}' into 'Email' field.", async () => {
            await signUpPage.inputEmail(email);
        });
        let password: string, confirmPassword: string;
        password = confirmPassword = await signUpPage.generatePassword(8, 10, 3);
        await test.step("Users input '${password}' into 'Password' field.", async () => {
            await signUpPage.inputPassword(password);
        });
        await test.step("Users input '${confirmPassword}' into 'Confirm Password' field.", async () => {
            await signUpPage.inputConfirmPassword(confirmPassword);
        });

        let accountPage: AccountPage;
        await test.step("Users click on the 'Create an Account' button.", async () => {
            accountPage = await signUpPage.clickCreateAccountButton();
        });
        await test.step("Verify the success message when the account has been successfully created.", async () => {
            await accountPage.verifyMessage("Thank you for registering with Main Website Store.");
        });
    });
});
