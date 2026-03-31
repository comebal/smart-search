import { describe, test, expect, beforeEach } from 'vitest';
import { html, render } from 'lit';
import { SmartSearch } from './smart-search';
import './components/search-input';
import './components/search-result';

describe('SmartSearch', () => {
  let container: HTMLElement;

  const mockSuggestions = [{ title: 'John Tan' }];
  const mockResults = [
    {
      id: 'cust-001',
      type: 'customer',
      title: 'John Tan',
      subtitle: 'Customer ID: C10293',
    },
  ];

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);

    render(
      html`
        <smart-search
          .searchSuggestions=${mockSuggestions}
          .filters=${['all', 'customer']}
          .placeholder=${'Search customer'}
          .results=${mockResults}
        ></smart-search>
      `,
      container
    );
  });

  const getEl = () => document.querySelector('smart-search') as SmartSearch;

  test('passes props to child components', async () => {
    const el = getEl();
    await el.updateComplete;

    const inputEl = el.shadowRoot!.querySelector('search-input') as any;
    const resultEl = el.shadowRoot!.querySelector('search-result') as any;

    expect(inputEl.searchSuggestions).toEqual(mockSuggestions);
    expect(inputEl.placeholder).toBe('Search customer');
    expect(resultEl.results).toEqual(mockResults);
    expect(resultEl.filters).toEqual(['all', 'customer']);
  });

  test('updates query when handleSearch is called', async () => {
    const el = getEl();

    el.handleSearch({ detail: 'john' } as CustomEvent);
    await el.updateComplete;

    expect(el.query).toBe('john');
  });

  test('passes updated query to search-result', async () => {
    const el = getEl();

    el.handleSearch({ detail: 'john' } as CustomEvent);
    await el.updateComplete;

    const resultEl = el.shadowRoot!.querySelector('search-result') as any;
    expect(resultEl.query).toBe('john');
  });
});