import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextInputEngine from '@/components/TextInputEngine';

describe('TextInputEngine', () => {
  const mockSetInputText = jest.fn();
  const mockOnGenerate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = (inputText = '', loadingState: 'idle' | 'loading' | 'error' = 'idle', errorMessage = '') => {
    return render(
      <TextInputEngine
        inputText={inputText}
        setInputText={mockSetInputText}
        loadingState={loadingState}
        errorMessage={errorMessage}
        onGenerate={mockOnGenerate}
      />
    );
  };

  it('TC-INP-01: Validates Generate button is disabled when input < 50 characters', () => {
    setup('Short text');
    const generateBtn = screen.getByRole('button', { name: /generate flashcards/i });
    expect(generateBtn).toBeDisabled();
    
    // Test with 50 chars
    const validText = 'a'.repeat(50);
    setup(validText);
    const generateBtnValid = screen.getAllByRole('button', { name: /generate flashcards/i })[1];
    expect(generateBtnValid).not.toBeDisabled();
  });

  it('TC-INP-02: Validates input truncates or prevents typing beyond 10,000 characters', async () => {
    const user = userEvent.setup();
    const almostFullText = 'a'.repeat(9999);
    const { rerender } = setup(almostFullText);
    
    const textarea = screen.getByPlaceholderText(/paste your notes here/i);
    await user.type(textarea, 'b');
    expect(mockSetInputText).toHaveBeenCalledWith(almostFullText + 'b');
    
    mockSetInputText.mockClear();
    
    // Re-render with full text
    const fullText = 'a'.repeat(10000);
    
    // We already have rendered, so let's just clear DOM or use rerender
    rerender(
      <TextInputEngine
        inputText={fullText}
        setInputText={mockSetInputText}
        loadingState="idle"
        errorMessage=""
        onGenerate={mockOnGenerate}
      />
    );
    
    await user.type(textarea, 'c');
    
    // setInputText shouldn't be called because length is already >= 10000
    // Wait, the logic in TextInputEngine is: if (val.length <= MAX_CHARS) setInputText(val);
    // If we type into a 10000 char textarea, val.length becomes 10001, so setInputText is not called.
    expect(mockSetInputText).not.toHaveBeenCalled();
  });

  it('TC-INP-03: Verify paste sanitization handles plain text stripping correctly', () => {
    setup('Some text ');
    const textarea = screen.getByPlaceholderText(/paste your notes here/i);
    
    // Simulate paste event
    const pasteEvent = new Event('paste', { bubbles: true, cancelable: true });
    Object.assign(pasteEvent, {
      clipboardData: {
        getData: jest.fn().mockReturnValue('pasted content'),
      },
    });
    
    fireEvent(textarea, pasteEvent);
    
    expect(mockSetInputText).toHaveBeenCalledWith('Some text pasted content');
  });
});
