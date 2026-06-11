import { test, expect } from '@playwright/test';

test.describe('Persistence & Local Storage', () => {

  test.beforeEach(async ({ page }) => {
    // Intercept Gemini API
    await page.route('**/models/gemini-*-flash:generateContent*', async route => {
      const json = {
        candidates: [{
          content: {
            parts: [{
              text: JSON.stringify({
                topic: 'React Hooks',
                cards: [
                  { id: '1', question: 'Q1', answer: 'A1' },
                  { id: '2', question: 'Q2', answer: 'A2' },
                  { id: '3', question: 'Q3', answer: 'A3' },
                  { id: '4', question: 'Q4', answer: 'A4' },
                  { id: '5', question: 'Q5', answer: 'A5' }
                ]
              })
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

  test('TC-STO-01, TC-STO-02, TC-STO-03, TC-STO-04: Multi-deck persistence lifecycle', async ({ page }) => {
    // Generate a deck
    await page.getByPlaceholder(/Paste your notes here/i).fill('a'.repeat(60));
    await page.getByRole('button', { name: /generate flashcards/i }).click();
    await expect(page.getByText('Card 1 of 5')).toBeVisible();

    // TC-STO-01: Click Save Deck
    await page.getByRole('button', { name: /save deck/i }).click();
    
    // Verify toast appears
    await expect(page.getByText(/deck saved successfully/i)).toBeVisible();
    
    // Verify localStorage has array data
    const savedData = await page.evaluate(() => window.localStorage.getItem('flashgenius_saved_decks'));
    expect(savedData).toContain('React Hooks');
    expect(savedData).toContain('Q1');
    expect(savedData).toContain('A1');

    // TC-STO-02: Verify "My Decks" link appears and click it
    const myDecksLink = page.getByRole('link', { name: /my decks/i });
    await expect(myDecksLink).toBeVisible();
    await myDecksLink.click();

    // Verify it navigates to decks page
    await expect(page).toHaveURL(/.*decks/);
    await expect(page.getByRole('heading', { name: /my decks/i })).toBeVisible();
    await expect(page.getByText('React Hooks')).toBeVisible();

    // TC-STO-03: Click Study Deck and verify it opens in study view
    await page.getByRole('link', { name: /study deck/i }).click();
    await expect(page).toHaveURL(/.*study\?id=.*/);
    await expect(page.getByRole('heading', { name: 'React Hooks' })).toBeVisible();
    await expect(page.getByText('Card 1 of 5')).toBeVisible();
    await expect(page.getByText('Q1')).toBeVisible();

    // Go back to My Decks
    await page.getByRole('link', { name: /back to my decks/i }).click();
    await expect(page).toHaveURL(/.*decks/);

    // TC-STO-04: Delete deck
    await page.getByRole('button', { name: /delete/i }).click();
    await expect(page.getByText('No decks yet')).toBeVisible();

    // Verify localStorage is updated to empty array
    const updatedData = await page.evaluate(() => window.localStorage.getItem('flashgenius_saved_decks'));
    expect(updatedData).toBe('[]');
  });

  test('TC-STO-05: Enforce 10-deck limit', async ({ page }) => {
    // Inject 10 decks to simulate maximum storage reached
    await page.evaluate(() => {
      const decks = Array.from({ length: 10 }, (_, i) => ({
        deck_id: `deck-id-${i}`,
        title: `Deck Number ${i + 1}`,
        saved_at: new Date().toISOString(),
        cards: [
          { id: `c-${i}-1`, question: `Q-${i}-1`, answer: `A-${i}-1` },
          { id: `c-${i}-2`, question: `Q-${i}-2`, answer: `A-${i}-2` },
          { id: `c-${i}-3`, question: `Q-${i}-3`, answer: `A-${i}-3` },
          { id: `c-${i}-4`, question: `Q-${i}-4`, answer: `A-${i}-4` },
          { id: `c-${i}-5`, question: `Q-${i}-5`, answer: `A-${i}-5` }
        ]
      }));
      window.localStorage.setItem('flashgenius_saved_decks', JSON.stringify(decks));
    });

    await page.reload();

    // Generate a new deck
    await page.getByPlaceholder(/Paste your notes here/i).fill('a'.repeat(60));
    await page.getByRole('button', { name: /generate flashcards/i }).click();
    await expect(page.getByText('Card 1 of 5')).toBeVisible();

    // Try to save 11th deck
    await page.getByRole('button', { name: /save deck/i }).click();

    // Verify limit toast/error message appears
    await expect(page.getByText(/You can only save up to 10 decks/i)).toBeVisible();

    // Verify storage still has only 10 decks
    const rawDecks = await page.evaluate(() => window.localStorage.getItem('flashgenius_saved_decks'));
    const decks = JSON.parse(rawDecks || '[]');
    expect(decks.length).toBe(10);
  });
});
