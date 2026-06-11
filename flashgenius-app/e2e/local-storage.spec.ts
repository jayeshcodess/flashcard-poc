import { test, expect } from '@playwright/test';

test.describe('Persistence & Local Storage', () => {

  test.beforeEach(async ({ page }) => {
    // Intercept Gemini API
    await page.route('**/models/gemini-*-flash:generateContent*', async route => {
      const json = {
        candidates: [{
          content: {
            parts: [{
              text: JSON.stringify([
                { id: '1', question: 'Q1', answer: 'A1' },
                { id: '2', question: 'Q2', answer: 'A2' },
                { id: '3', question: 'Q3', answer: 'A3' },
                { id: '4', question: 'Q4', answer: 'A4' },
                { id: '5', question: 'Q5', answer: 'A5' }
              ])
            }]
          }
        }]
      };
      await route.fulfill({ json });
    });

    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test('TC-STO-01 & TC-STO-02: Save deck and load on reload', async ({ page }) => {
    // Generate a deck
    await page.getByPlaceholder(/Paste your notes here/i).fill('a'.repeat(60));
    await page.getByRole('button', { name: /generate flashcards/i }).click();
    await expect(page.getByText('Card 1 of 5')).toBeVisible();

    // TC-STO-01: Click Save Deck
    await page.getByRole('button', { name: /save deck/i }).click();
    
    // Verify toast appears
    await expect(page.getByText(/deck saved successfully/i)).toBeVisible();
    
    // Verify localStorage has data
    const savedData = await page.evaluate(() => window.localStorage.getItem('flashgenius_saved_deck'));
    expect(savedData).toContain('Q1');
    expect(savedData).toContain('A1');

    // TC-STO-02: Reload page
    await page.reload();
    
    // User should be prompted to load saved deck
    await expect(page.getByText(/You have a saved deck from a previous session/i)).toBeVisible();
    
    // Click Load
    await page.getByRole('button', { name: /Load Saved Deck/i }).click();
    
    // Verify deck is loaded
    await expect(page.getByText('Card 1 of 5')).toBeVisible();
    await expect(page.getByText('Q1')).toBeVisible();
  });

  test('TC-STO-03: Save new deck triggers confirm dialog', async ({ page }) => {
    // Inject a saved deck to simulate existing data
    await page.evaluate(() => {
      window.localStorage.setItem('flashgenius_saved_deck', JSON.stringify({
        deck_id: 'test-deck-1',
        title: 'Mock Deck',
        saved_at: new Date().toISOString(),
        cards: [
          { id: 'old1', question: 'Old Q1', answer: 'Old A1' },
          { id: 'old2', question: 'Old Q2', answer: 'Old A2' },
          { id: 'old3', question: 'Old Q3', answer: 'Old A3' },
          { id: 'old4', question: 'Old Q4', answer: 'Old A4' },
          { id: 'old5', question: 'Old Q5', answer: 'Old A5' }
        ]
      }));
    });
    
    await page.reload();
    
    // Click ignore/create new to go to input
    await page.getByRole('button', { name: /Create New Deck/i }).click();

    // Generate a new deck
    await page.getByPlaceholder(/Paste your notes here/i).fill('a'.repeat(60));
    await page.getByRole('button', { name: /generate flashcards/i }).click();
    await expect(page.getByText('Card 1 of 5')).toBeVisible();

    // Click Save Deck
    await page.getByRole('button', { name: /save deck/i }).click();
    
    // Verify confirm dialog appears
    await expect(page.getByText(/Replace Existing Deck\?/i)).toBeVisible();
    
    // Confirm replacement
    await page.getByRole('button', { name: /Replace Existing Deck/i }).click();
    
    // Verify success toast
    await expect(page.getByText(/deck saved successfully/i)).toBeVisible();
  });
});
