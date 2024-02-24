import { Page, expect } from "@playwright/test";

export default class BasePage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async navigate(url: string) {
        await this.page.goto(url);
    }

    async verifyTitle(expectedTitle: string) {
        await expect(this.page).toHaveTitle(expectedTitle);
    }

    async clickButton(xpath: string) {
        await this.page.waitForSelector(xpath, { state: 'visible', timeout: 60000 });
        await this.page.waitForFunction((xpath) => {
            const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as HTMLInputElement;
            if (element) {
                const { width, height } = element.getBoundingClientRect();
                return width > 0 && height > 0 && !element.disabled && !element.readOnly;
            }
            return false;
        }, xpath);
        const element = await this.page.$(xpath);
        if (element) {
            await element.click();
        } else {
            throw new Error(`Element with XPath '${xpath}' not found`);
        }
    }

    async inputTextField(xpath: string, valueOfField: string) {
        await this.page.waitForSelector(xpath, { state: 'visible' });
        await this.page.fill(xpath, valueOfField);
    }

    async verifyText(xpath: string, expectedText: string) {
        try {
            const element = await this.page.waitForSelector(xpath, { state: 'visible', timeout: 60000 });
            const textContent = await element.textContent();
            const actualText = textContent?.replace(/\n/g, '');
            expect(actualText).toBe(expectedText);
        } catch (error) {
            throw new Error(`Failed to verify text with XPath '${xpath}': ${error}`);
        }
    }

    async readDataJson(filePath: string, testCaseType: string): Promise<any[]> {
        const fs = require('fs');
        return new Promise<any[]>((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err: NodeJS.ErrnoException | null, data: string) => {
                if (err) {
                    console.error('Unable to read JSON file:', err);
                    reject(err);
                    return;
                }

                try {
                    const jsonData = JSON.parse(data);
                    if (testCaseType === "Valid") {
                        resolve(jsonData.TestCaseValid);
                    } else if (testCaseType === "Invalid") {
                        resolve(jsonData.TestCaseInvalid);
                    } else {
                        throw new Error('The invalid test case type.');
                    }
                } catch (err) {
                    console.error('Error parsing JSON:', err);
                    reject(err);
                }
            });
        });
    }

    isValidEmail(email: string) {
        const emailRegex = /^\S+@\S+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    isValidPassword(password: string) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])[A-Za-z\d!@#$%^&*()\-_=+{};:,<.>.]{8,}$/;
        return passwordRegex.test(password);
    }

    async generateFirstName() {
        const adjectives = ['Brave', 'Clever', 'Kind', 'Gentle', 'Wise', 'Happy', 'Loyal', 'Honest', 'Friendly', 'Funny'];
        const nouns = ['Lion', 'Tiger', 'Bear', 'Eagle', 'Dolphin', 'Butterfly', 'Owl', 'Fox', 'Elephant', 'Kangaroo'];

        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

        const firstName = randomAdjective + ' ' + randomNoun;

        return firstName;
    }

    async generateLastName() {
        const suffixes = ['son', 'man', 'wood', 'field', 'stone', 'ridge', 'brook', 'ford', 'worth', 'view'];
        const prefixes = ['Bright', 'Clear', 'Strong', 'Fair', 'Green', 'Long', 'Swift', 'Wise', 'Wild', 'Great'];

        const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];

        const lastName = randomPrefix + ' ' + randomSuffix;

        return lastName;
    }

    async generateEmail(firstName: string, lastName: string) {
        const normalizedFirstName = firstName.toLowerCase();
        const normalizedLastName = lastName.toLowerCase();

        const cleanedFirstName = normalizedFirstName.replace(/\s/g, '').replace(/[^a-zA-Z]/g, '');
        const cleanedLastName = normalizedLastName.replace(/\s/g, '').replace(/[^a-zA-Z]/g, '');

        const email = `${cleanedFirstName}.${cleanedLastName}@vcatna.com`;
        return email;
    }

    // async generatePassword() {
    //     const minLength = 8;
    //     const classes = ['lowerCase', 'upperCase', 'digits', 'specialCharacters'];

    //     const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    //     const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    //     const digitChars = '0123456789';
    //     const specialChars = '!@#$%^&*()_-+=<>?';

    //     let password = '';

    //     password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
    //     password += upperCaseChars.charAt(Math.floor(Math.random() * upperCaseChars.length));
    //     password += lowerCaseChars.charAt(Math.floor(Math.random() * lowerCaseChars.length));
    //     for (let index = 0; index < minLength - 3; index++) {
    //         const randomClass = classes[Math.floor(Math.random() * classes.length)];
            
    //         switch (randomClass) {
    //             case 'lowerCase':
    //                 password += lowerCaseChars.charAt(Math.floor(Math.random() * lowerCaseChars.length));
    //                 break;
    //             case 'upperCase':
    //                 password += upperCaseChars.charAt(Math.floor(Math.random() * upperCaseChars.length));
    //                 break;
    //             case 'digits':
    //                 password += digitChars.charAt(Math.floor(Math.random() * digitChars.length));
    //                 break;
    //             case 'specialCharacters':
    //                 password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
    //                 break;
    //         }
    //     }

    //     password = password.split('').sort(() => Math.random() - 0.5).join('');

    //     return password;
    // }

    async generatePassword(minPasswordLength: number, maxPasswordLength: number, minClass: number) {
        const classes = {
            lowerCase: 'abcdefghijklmnopqrstuvwxyz',
            upperCase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            digits: '0123456789',
            specialCharacters: '!@#$%^&*()_-+=<>?'
        };
    
        let password = '';
        let promises: Promise<string>[] = [];
    
        for (const key in classes) {
            if (Object.prototype.hasOwnProperty.call(classes, key) && minClass > 0) {
                if (Math.random() < 0.5) {
                    promises.push(this.getRandomCharacter(classes[key]));
                    minClass--;
                }
            }
        }
    
        const results = await Promise.all(promises);
        password += results.join('');
    
        const remainingLength = Math.floor(Math.random() * (maxPasswordLength - minPasswordLength + 1)) + minPasswordLength - password.length;
        for (let index = 0; index < remainingLength; index++) {
            const randomKey = this.getRandomKey(classes);
            promises.push(this.getRandomCharacter(classes[randomKey]));
        }
    
        const remainingResults = await Promise.all(promises.slice(results.length));
        password += remainingResults.join('');
    
        password = password.split('').sort(() => Math.random() - 0.5).join('');
        return password;
    }
    
    private getRandomCharacter(characters: string): Promise<string> {
        return new Promise(resolve => {
            resolve(characters.charAt(Math.floor(Math.random() * characters.length)));
        });
    }
    
    private getRandomKey(obj: any): string {
        const keys = Object.keys(obj);
        return keys[Math.floor(Math.random() * keys.length)];
    }
    
    
    
    



}