import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { SearchSuggestions } from "../types";
import searchStyle from './search-input.css?inline';
import { renderHighlight } from "../utils/highlights";

@customElement('search-input')
export class SearchInput extends LitElement {
    @state() _selectedIdx = 0;
    @state() _searchText = "";
    @state() _isDropdownOpen = false;

    @property({ type: Array })
    searchSuggestions: SearchSuggestions[] = [];

    @property({ type: String })
    placeholder: string = "";

    private _boundPosition!: () => void;

    static styles = css`${unsafeCSS(searchStyle)}`;

    constructor() {
        super();
        this._handleOutsideClick = this._handleOutsideClick.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('click', this._handleOutsideClick);
        this._boundPosition = this.updateDropdownPosition.bind(this);

        window.addEventListener("resize", this._boundPosition);
        window.addEventListener("scroll", this._boundPosition, true);
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        document.removeEventListener('click', this._handleOutsideClick);

        window.removeEventListener("resize", this._boundPosition);
        window.removeEventListener("scroll", this._boundPosition, true);
    }

    get computedSuggestions(): SearchSuggestions[] {
        const text = this._searchText.trim();

        if (!this._isDropdownOpen) return [];

        if (!text) return this.searchSuggestions;

        return [
            { title: text },
            ...this.searchSuggestions.filter(
                (item) => item.title.toLowerCase() !== text.toLowerCase()
            )
        ];
    }

    _handleKeyDown(e: KeyboardEvent) {
        const suggestions = this.computedSuggestions;
        const listLength = suggestions.length;

        if (listLength === 0 && e.key !== 'Escape') return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this._selectedIdx = (this._selectedIdx + 1) % listLength;
                break;

            case 'ArrowUp':
                e.preventDefault();
                this._selectedIdx = (this._selectedIdx - 1 + listLength) % listLength;
                break;

            case 'Enter':
                e.preventDefault();
                this._handleSelection(suggestions[this._selectedIdx]);
                break;

            case 'Escape':
                this._closeDropdown();
                break;
        }
    }

    _handleSelection(selected: SearchSuggestions) {
        if (!selected) return;

        this._searchText = selected.title;
        this.dispatchEvent(new CustomEvent("result-selected", {
            detail: this._searchText,
            bubbles: true,
            composed: true
        }));

        this._closeDropdown();
    }

    _closeDropdown() {
        this._selectedIdx = 0;
        this.searchSuggestions = [];
        this._isDropdownOpen = false;
    }

    _handleOutsideClick = (e: MouseEvent) => {
        if (!this.contains(e.target as Node)) {
            this._closeDropdown();
        }
    }

    renderSearchSuggestions(listId: string) {
        const suggestions = this.computedSuggestions;

        return html`
            <div class="dropdown ${suggestions.length > 0 ? "show" : "hide"}">
                <ul
                    aria-label="Search suggestions" 
                    id="${listId}" 
                    class="results-suggestions" 
                    role="listbox"
                >
                    ${suggestions.map((r, index) => {
                        const isSelected = index === this._selectedIdx;
                        return html`
                            <li 
                                id="option-${index}"
                                role="option"
                                aria-selected="${isSelected ? 'true' : 'false'}"
                                class="${isSelected ? "selected" : ""}"
                                @click="${() => this._handleSelection(r)}"
                            >
                                ${index === 0 && this._searchText.trim()
                                    ? html`Search for "${r.title}"`
                                    : renderHighlight(r.title, this._searchText)}
                            </li>
                        `;
                    })}
                </ul>
            </div>
        `;
    }

    updateDropdownPosition() {
        const input = this.shadowRoot?.querySelector("input") as HTMLInputElement;
        const dropdown = this.shadowRoot?.querySelector(".dropdown") as HTMLElement;

        if (!input || !dropdown) return;

        const rect = input.getBoundingClientRect();

        dropdown.style.top = `${rect.bottom + 8}px`;
        dropdown.style.left = `${rect.left}px`;
        dropdown.style.width = `${rect.width}px`;
    }

    updated() {
        this.updateDropdownPosition();
    }

    onSearch = (e: Event) => {
        const input = e.target as HTMLInputElement;
        this._searchText = input.value;
        this._selectedIdx = 0;

        if (this._searchText.length >= 2) {
            this._isDropdownOpen = true;

            this.dispatchEvent(
                new CustomEvent("search-change", {
                    detail: this._searchText,
                    bubbles: true,
                    composed: true
                })
            );
        } else {
            this._closeDropdown();
        }
    }

    render() {
        const suggestions = this.computedSuggestions;

        return html`
            <div id="input-container">
                <div class="input-search">
                    <span><div></div></span>
                    <input
                        .value="${this._searchText}" 
                        @keydown="${this._handleKeyDown}" 
                        type="text" 
                        placeholder="${this.placeholder}" 
                        @input="${this.onSearch}"
                        role="combobox"
                        aria-autocomplete="list"
                        aria-haspopup="listbox"
                        aria-expanded="${suggestions.length > 0}"
                        aria-controls="results-listbox"
                        aria-activedescendant="${this._selectedIdx >= 0 ? `option-${this._selectedIdx}` : ''}"
                    />
                </div>
                ${this.renderSearchSuggestions("results-listbox")}
            </div> 
        `;
    }
}