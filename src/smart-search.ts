import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import globalStyles from './smart-search.css?inline'
import type { SearchSuggestions, SearchResults } from "./types.ts"

import './components/search-input.ts';
import './components/search-result.ts';

@customElement('smart-search')
export class SmartSearch extends LitElement {

    @property({ type: Array })
    searchSuggestions: SearchSuggestions[] = [];

    @property({ type: Array })
    filters: string[] = []

    @property({ type: String })
    placeholder: string = "Search"

    @property({ type: String })
    query: string = ""

    @property({ type: Array })
    results: SearchResults[] = []

    static styles = css`${unsafeCSS(globalStyles)}`;

    handleSearch(e: CustomEvent) {
        this.query = e.detail;
    }

    render() {
        return html`
            <div id="main-container">
                <search-input @search-change=${this.handleSearch} .searchSuggestions="${this.searchSuggestions}" .placeholder="${this.placeholder}"></search-input> 
                <search-result .query=${this.query} .results="${this.results}" .filters="${this.filters}"></search-result>
            </div>
        `
    }
}