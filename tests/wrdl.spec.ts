import {test, expect, Locator} from '@playwright/test';

test.beforeEach(async ({page}) => {
    await page.goto('https://www.nytimes.com/games/wordle/index.html');

    //If ToS modal pops up -> click continue to close it
    const toSModal: Locator = page.locator('.purr-blocker-card__content')
    const toSModalCount: number = await toSModal.count();
    if (toSModalCount > 0) {
        await toSModal.getByRole('button', {name: 'Continue'}).click();
    }
    //Click Play to go to board
    await page.getByTestId('Play').click();
    //Close How to Play modal
    await page.getByTestId('modal-overlay').getByRole('button').click();
});


test('has correct title', async ({page}) => {
    // Title starts with "Wordle" on its own
    await expect(page).toHaveTitle(/^Wordle\b/);
});

test('board exists', async ({page}) => {
    const board: Locator = page.locator('.Board-module_board__jeoPS');
    expect(board).toBeDefined()
});

test('board has correct dimensions', async ({page}) => {
    const rows: Locator = page.locator('.Board-module_board__jeoPS').locator('.Row-module_row__pwpBq');
    await expect(rows).toHaveCount(6);
    for (const row of await rows.all()) {
        const tiles: Locator = row.getByTestId('tile');
        await expect(tiles).toHaveCount(5);
    }
});

test('submitting an invalid word displays an error message', async ({page}) => {
    const aButton: Locator = page.getByLabel('add a');
    for (let i = 0; i < 5; i++) {
        await aButton.click();
    }
    await page.getByRole('button', {name: 'enter'}).click();

    const toastContainer: Locator = page.locator('#ToastContainer-module_gameToaster__HPkaC');
    const snapshot = await toastContainer.ariaSnapshot();
    expect(snapshot).toMatch(/\bNot in word list\b/);
});

test('submitting an valid word does not display an error message', async ({page}) => {
    await page.getByLabel('add t').click();
    await page.getByLabel('add r').click();
    await page.getByLabel('add i').click();
    await page.getByLabel('add p').click();
    await page.getByLabel('add s').click();
    await page.getByRole('button', {name: 'enter'}).click();

    const toastContainer: Locator = page.locator('#ToastContainer-module_gameToaster__HPkaC');
    const snapshot = await toastContainer.ariaSnapshot();
    expect(snapshot).not.toMatch(/\bNot in word list\b/);
});
