import { expect, test, describe, beforeEach, vi } from 'vitest';
import { fireEvent } from '@testing-library/dom';
import { html, render } from 'lit';
import { SearchInput } from './search-input';

describe('SearchInput Interactions', () => {
    let container: HTMLElement;

    const mockSuggestions = [
        { title: 'Apple' },
        { title: 'Banana' },
        { title: 'Cherry' }
    ];

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        render(html`<search-input .placeholder="${'Search'}"></search-input>`, container);
    });

    const getEl = () => document.querySelector('search-input')!;
    const getInput = () => getEl().shadowRoot!.querySelector('input')!;

    describe('Keyboard Interactions', () => {
        test('ArrowDown and ArrowUp should cycle through suggestions', async () => {
            const el = getEl() as SearchInput;
            const input = getInput();

            el.searchSuggestions = mockSuggestions;
            await el.updateComplete;

            expect(el.shadowRoot?.querySelector('.selected')?.textContent?.trim()).toBe('Apple');

            fireEvent.keyDown(input, { key: 'ArrowDown' });
            await el.updateComplete;
            expect(el.shadowRoot?.querySelector('.selected')?.textContent?.trim()).toBe('Banana');

            fireEvent.keyDown(input, { key: 'ArrowDown' });
            await el.updateComplete;
            expect(el.shadowRoot?.querySelector('.selected')?.textContent?.trim()).toBe('Cherry');

            fireEvent.keyDown(input, { key: 'ArrowDown' });
            await el.updateComplete;
            expect(el.shadowRoot?.querySelector('.selected')?.textContent?.trim()).toBe('Apple');

            fireEvent.keyDown(input, { key: 'ArrowUp' });
            await el.updateComplete;

            expect(el.shadowRoot?.querySelector('.selected')?.textContent?.trim()).toBe('Cherry');
        });

        test('Enter key should select the current item and dispatch event', async () => {
            const el = getEl() as SearchInput;
            const input = getInput();
            const spy = vi.fn();

            el.searchSuggestions = mockSuggestions;
            el._selectedIdx = 0
            el.addEventListener('result-selected', (e: any) => spy(e.detail));
            await el.updateComplete;

            fireEvent.keyDown(input, { key: 'ArrowDown' });
            await el.updateComplete;

            fireEvent.keyDown(input, { key: 'Enter' });
            await el.updateComplete;

            expect(spy).toHaveBeenCalledWith('Banana');
            expect(el.searchSuggestions.length).toBe(0);
        });

        test('Escape key should close the dropdown', async () => {
            const el = getEl() as SearchInput;
            const input = getInput();

            el.searchSuggestions = mockSuggestions;
            await el.updateComplete;

            fireEvent.keyDown(input, { key: 'Escape' });

            expect(el.searchSuggestions.length).toBe(0);
        });
    });

    describe('Mouse & Touch Interactions', () => {
        test('Clicking a suggestion should select it', async () => {
            const el = getEl() as SearchInput;
            const spy = vi.fn();

            el.searchSuggestions = mockSuggestions;
            el.addEventListener('result-selected', (e: any) => spy(e.detail));
            await el.updateComplete;

            const items = el.shadowRoot?.querySelectorAll('li');
            fireEvent.click(items![2]);

            expect(spy).toHaveBeenCalledWith('Cherry');
        });

        test('Clicking outside should clear suggestions', async () => {
            const el = getEl() as SearchInput;
            el.searchSuggestions = mockSuggestions;
            await el.updateComplete;

            fireEvent.click(document.body);

            expect(el.searchSuggestions.length).toBe(0);
        });
    });

    describe('SearchInput - Event Interface', () => {
        const getEl = () => document.querySelector('search-input') as SearchInput;

        test('Typing should dispatch search-change event', async () => {
            render(html`<search-input></search-input>`, document.body);
            const el = getEl();
            const input = el.shadowRoot!.querySelector('input')!;

            const searchSpy = vi.fn();
            el.addEventListener('search-change', (e: any) => searchSpy(e.detail));

            fireEvent.input(input, { target: { value: 'Apple' } });

            expect(searchSpy).toHaveBeenCalledWith('Apple');
        });

        test('Notify parent component when a result is selected', async () => {
            render(html`<search-input></search-input>`, document.body);
            const el = getEl();

            el.searchSuggestions = mockSuggestions
            await el.updateComplete;

            const selectSpy = vi.fn();
            el.addEventListener('result-selected', (e: any) => selectSpy(e.detail));

            const secondItem = el.shadowRoot!.querySelectorAll('li')[1];
            fireEvent.click(secondItem);

            expect(selectSpy).toHaveBeenCalledWith('Banana');
            expect(el.searchSuggestions.length).toBe(0);
        });
    });

    describe('Special edge cases & error scenarios', () => {
        const getEl = () => document.querySelector('search-input') as SearchInput;

        test('should handle empty suggestions array gracefully', async () => {
            const el = getEl();
            el.searchSuggestions = [];
            await el.updateComplete;

            const listItems = el.shadowRoot?.querySelectorAll('li');
            const dropdown = el.shadowRoot?.querySelector('.dropdown');

            expect(listItems?.length).toBe(0);
            expect(dropdown?.classList.contains('hide')).toBe(true);
        });

        test('should not throw errors when navigating an empty list', async () => {
            const el = getEl();
            const input = el.shadowRoot!.querySelector('input')!;
            el.searchSuggestions = [];
            await el.updateComplete;

            expect(() => {
                fireEvent.keyDown(input, { key: 'ArrowDown' });
                fireEvent.keyDown(input, { key: 'ArrowUp' });
                fireEvent.keyDown(input, { key: 'Enter' });
            }).not.toThrow();
        });

        test('should handle regex special characters in search text without crashing', async () => {
            const el = getEl();
            el._searchText = '[[.*+?^${}()|[\\]\\\\]';
            el.searchSuggestions = [{ title: 'Special (Characters) Item' }];
            await el.updateComplete;

            const listItem = el.shadowRoot?.querySelector('li');
            expect(listItem?.textContent?.trim()).toBe('Special (Characters) Item');
        });

        test('should handle very long suggestion titles without breaking logic', async () => {
            const el = getEl();
            const longTitle = 'a'.repeat(1000);
            el.searchSuggestions = [{ title: longTitle }];
            await el.updateComplete;

            const listItem = el.shadowRoot?.querySelector('li');
            expect(listItem?.textContent?.trim()).toBe(longTitle);
        });

        test('should handle missing placeholder property', async () => {
            render(html`<search-input></search-input>`, document.body);
            const el = getEl();
            await el.updateComplete;

            const input = el.shadowRoot!.querySelector('input')!;
            expect(input.placeholder).toBe("Search");
        });

        test('should reset selection index to 0 when list is cleared', async () => {
            const el = getEl();
            const input = el.shadowRoot!.querySelector('input')!;
            
            el.searchSuggestions = mockSuggestions;
            fireEvent.keyDown(input, { key: 'ArrowDown' });
            await el.updateComplete;
            
            fireEvent.keyDown(input, { key: 'Escape' });
            await el.updateComplete;

            expect(el._selectedIdx).toBe(0);
            expect(el.searchSuggestions.length).toBe(0);
        });
    });
});