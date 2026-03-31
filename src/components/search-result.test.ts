import { describe, test, expect, beforeEach, vi } from 'vitest';
import { html, render } from 'lit';
import { fireEvent } from '@testing-library/dom';
import { SearchResult } from './search-result';

describe('SearchResult', () => {
  let container: HTMLElement;

  const mockResults = [
    {
      id: 'cust-001',
      type: 'customer',
      title: 'John Tan',
      subtitle: 'Customer ID: C10293',
    },
    {
      id: 'acct-001',
      type: 'account',
      title: 'Savings Account',
      subtitle: '**** 2345',
    },
    {
      id: 'txn-001',
      type: 'transaction',
      title: 'Transfer to Mary Lim',
      subtitle: 'SGD 250.00',
    },
  ];

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);

    render(
      html`
        <search-result
          .filters=${['all', 'account', 'customer', 'transaction']}
          .results=${mockResults}
        ></search-result>
      `,
      container
    );
  });

  const getEl = () => document.querySelector('search-result') as SearchResult;

  test('renders all filter buttons', async () => {
    const el = getEl();
    await el.updateComplete;

    const buttons = el.shadowRoot!.querySelectorAll('button');
    expect(buttons.length).toBe(4);
    expect(buttons[0].textContent?.trim()).toBe('all');
    expect(buttons[1].textContent?.trim()).toBe('account');
    expect(buttons[2].textContent?.trim()).toBe('customer');
    expect(buttons[3].textContent?.trim()).toBe('transaction');
  });

  test('shows all results by default', async () => {
    const el = getEl();
    await el.updateComplete;

    const items = el.shadowRoot!.querySelectorAll('#results-list li');
    expect(items.length).toBe(3);
  });

  test('filters results when a filter button is clicked', async () => {
    const el = getEl();
    await el.updateComplete;

    const buttons = el.shadowRoot!.querySelectorAll('button');
    fireEvent.click(buttons[1]); // account
    await el.updateComplete;

    const items = el.shadowRoot!.querySelectorAll('#results-list li');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toContain('Savings Account');
  });

  test('dispatches filter-change event when filter is clicked', async () => {
    const el = getEl();
    const spy = vi.fn();
    el.addEventListener('filter-change', (e: any) => spy(e.detail));
    await el.updateComplete;

    const buttons = el.shadowRoot!.querySelectorAll('button');
    fireEvent.click(buttons[2]); // customer
    await el.updateComplete;

    expect(spy).toHaveBeenCalledWith({ f: 'customer' });
  });

  test('applies active class to selected filter button', async () => {
    const el = getEl();
    await el.updateComplete;

    const buttons = el.shadowRoot!.querySelectorAll('button');
    fireEvent.click(buttons[3]); // transaction
    await el.updateComplete;

    expect(buttons[3].classList.contains('active')).toBe(true);
  });

  test('shows "No results" when filtered list is empty', async () => {
    const el = getEl();
    el.results = [];
    await el.updateComplete;

    expect(el.shadowRoot!.textContent).toContain('No results');
  });

  test('highlights matching query text in title and subtitle', async () => {
    const el = getEl();
    el.query = 'john';
    await el.updateComplete;

    const highlights = el.shadowRoot!.querySelectorAll('.highlight');
    expect(highlights.length).toBeGreaterThan(0);
    expect(el.shadowRoot!.textContent).toContain('John Tan');
  });
});