import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { SearchResults } from "../types";
import searchResultStyle from './search-result.css?inline';
import { renderHighlight } from "../utils/highlights";

@customElement('search-result')
export class SearchResult extends LitElement {

    @property({ type: Array })
    filters: string[] = []

    @property({ type: String })
    filter: string = "all"

    @property({ type: String })
    query: string = ""

    @property({ type: Array })
    results: SearchResults[] = []

    _setFilter(f: string) {
        this.filter = f

        this.dispatchEvent(
            new CustomEvent("filter-change", {
                detail: { f },
                bubbles: true,
                composed: true
            })
        )
    }

    static styles = css`${unsafeCSS(searchResultStyle)}`;

    _renderSearchResults() {
        return html`
            <div id="results-list">
               ${this.filteredResults.length === 0
                ? html`<div class="empty">No results</div>`
                : html`
                        <ul class="results">
                            ${this.filteredResults.map(result => html`
                                <li>
                                    <div>${renderHighlight(result.title, this.query)}</div>
                                    <div>${renderHighlight(result.subtitle ?? "", this.query)}</div>
                                </li>
                            `)}
                        </ul>
                    `
            }
            </div>
        `
    }

    get filteredResults() {
        if (this.filter === "all") {
            return this.results
        }

        return this.results.filter(
            r => r.type === this.filter
        )
    }

    render() {
        return html`
            <div id="results-container">
                ${this.filters.map(f => html`
                    <button
                        class=${this.filter === f ? "active" : ""}
                        @click=${() => this._setFilter(f)}
                    >${f}</button>
                `)}

                ${this._renderSearchResults()}
            </div>
        `
    }
}