import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { SearchSuggestions } from "../types";
import searchStyle from './search-input.css?inline';
import { renderHighlight } from "../utils/highlights";

@customElement('search-input')
export class SearchInput extends LitElement {
    @state() _selectedIdx = 0;
    @state() _searchText = "";

    @property({ type: Array })
    searchSuggestions: SearchSuggestions[] = [];

    @property({ type: String })
    placeholder: string = ""

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

    _handleKeyDown(e: KeyboardEvent) {
        const listLength = this.searchSuggestions.length;
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
                this._handleSelection(this.searchSuggestions[this._selectedIdx]);
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
    }

    _handleOutsideClick = (e: MouseEvent) => {
        if (!this.contains(e.target as Node)) {
            this.searchSuggestions = [];
            this._selectedIdx = 0;
        }
    }

    renderSearchSuggestions(listId: string) {
        return html`
            <div class="dropdown ${this.searchSuggestions.length > 0 ? "show" : "hide"}">
                <ul
                    aria-label="Search suggestions" 
                    id="${listId}" 
                    class="results-suggestions" 
                    role="listbox"
                >
                    ${this.searchSuggestions.map((r, index) => {
                        const isSelected = index === this._selectedIdx;
                        return html`
                            <li 
                                id="option-${index}"
                                role="option"
                                aria-selected="${isSelected ? 'true' : 'false'}"
                                class="${isSelected ? "selected" : ""}"
                                @click="${() => this._handleSelection(r)}"
                            >
                                ${renderHighlight(r.title, this._searchText)}
                            </li>
                        `;
                    })}
                </ul>
            </div>
        `
    }

    updateDropdownPosition() {
        const input = this.shadowRoot?.querySelector("input") as HTMLInputElement;;
        const dropdown = this.shadowRoot?.querySelector(".dropdown") as HTMLElement;;

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

        if (this._searchText.length >= 2) {
            this.dispatchEvent(
                new CustomEvent("search-change", {
                    detail: this._searchText,
                    bubbles: true,
                    composed: true
                })
            )
        }else{
            this._closeDropdown()
        }
    }

    render() {
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
                        aria-expanded="${this.searchSuggestions.length > 0}"
                        aria-controls="results-listbox"
                        aria-activedescendant="${this._selectedIdx >= 0 ? `option-${this._selectedIdx}` : ''}"
                    />
                </div>
                ${this.renderSearchSuggestions("results-listbox")}
            </div> 
        `
    }
}