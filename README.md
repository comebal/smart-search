# Smart Search Component

A reusable, accessible **search component built with LitElement**, supporting dynamic suggestions, filtering, keyboard navigation, and result highlighting.

---

## ✨ Features

* 🔍 Search input with suggestions dropdown
* ⌨️ Full keyboard navigation (Arrow keys, Enter, Escape)
* 🎯 Result selection via mouse or keyboard
* 🧠 Local search filtering (no API required)
* 🏷️ Filter by category (e.g. account, customer, transaction)
* 🔤 Search term highlighting (suggestions + results)
* 📐 Dynamic dropdown positioning (scroll + resize aware)
* 🎨 Theming support (light/dark mode via CSS variables)
* 🧩 Modular component structure
* 🧪 Tested with Vitest

---

## 🏗️ Project Structure

```
src/
  components/
    search-input.ts
    search-result.ts
  utils/
    highlights.ts
  smart-search.ts
  types.ts
index.html
```

---

## 🚀 Getting Started

### 1. Install dependencies

```
npm install
```

### 2. Run development server

```
npm run dev
```

### 3. Run Demo

http://localhost:5173/

https://github.com/user-attachments/assets/d648ff74-8d3d-4b5c-9ea9-81c33471659c

---

## 🧪 Running Tests

```
npm test
```

Watch mode:

```
npm run test:watch
```

---

## 🧱 Usage

### Basic Example

```html
<smart-search id="search"></smart-search>

<script type="module">
  const search = document.getElementById("search");

  search.filters = ["all", "account", "customer", "transaction"];

  search.addEventListener("search-change", (e) => {
    const query = e.detail.toLowerCase()

    const searchSuggestions = searchResults.filter(item =>
      item.title.toLowerCase().includes(query)
    )

    search.searchSuggestions = searchSuggestions
  });

  search.addEventListener("result-selected", (e) => {
    const title = e.detail.toLowerCase()
    search.results = searchResults
    search.searchSuggestions = []
  });

  search.addEventListener("filter-change", (e) => {
    const query = e.detail
  })

  const searchResults = [
    {
      "id": "cust-001",
      "type": "customer",
      "title": "John Tan",
      "subtitle": "Customer ID: C10293",
      "metadata": {
        "email": "john.tan@email.com",
        "phone": "+65 8123 4567"
      }
    },
    {
      "id": "acct-001",
      "type": "account",
      "title": "Savings Account",
      "subtitle": "**** 2345",
      "metadata": {
        "balance": 12500.5,
        "currency": "SGD",
        "status": "Active"
      }
    },
    {
      "id": "acct-002",
      "type": "account",
      "title": "Current Account",
      "subtitle": "**** 9821",
      "metadata": {
        "balance": 8200.75,
        "currency": "SGD",
        "status": "Active"
      }
    },
    {
      "id": "txn-001",
      "type": "transaction",
      "title": "Transfer to Mary Lim",
      "subtitle": "SGD 250.00",
      "metadata": {
        "date": "2026-03-20",
        "status": "Completed"
      }
    },
    {
      "id": "txn-002",
      "type": "transaction",
      "title": "Salary Credit - TechCorp Pte Ltd",
      "subtitle": "SGD 4,500.00",
      "metadata": {
        "date": "2026-03-01",
        "status": "Completed"
      }
    },
    {
      "id": "cust-002",
      "type": "customer",
      "title": "Mary Lim",
      "subtitle": "Customer ID: C20488",
      "metadata": {
        "email": "mary.lim@email.com",
        "phone": "+65 9123 8765"
      }
    },
    {
      "id": "txn-003",
      "type": "transaction",
      "title": "Payment to Amazon",
      "subtitle": "SGD 89.90",
      "metadata": {
        "date": "2026-03-18",
        "status": "Completed"
      }
    }
  ]
</script>
```

---

## ⚙️ API

### Properties

| Property            | Type                  | Description         |
| ------------------- | --------------------- | ------------------- |
| `results`           | `SearchResults[]`     | Full dataset        |
| `filters`           | `string[]`            | Filter categories   |
| `searchSuggestions` | `SearchSuggestions[]` | Suggestions list    |
| `placeholder`       | `string`              | Input placeholder   |
| `query`             | `string`              | Current search text |

---

### Events

| Event             | Payload         | Description                         |
| ----------------- | --------------- | ----------------------------------- |
| `search-change`   | `string`        | Fired when user types               |
| `result-selected` | `string`        | Fired when a suggestion is selected |
| `filter-change`   | `{ f: string }` | Fired when filter changes           |

---

## 🎨 Theming

Customize using CSS variables:

```css
smart-search {
  --bg-color: #ffffff;
  --text-color: #1a1a1a;
  --dropdown-bg: #f9f9f9;
  --border-color: rgba(0,0,0,0.1);
  --highlight-color: rgba(0,0,0,0.1);
}
```

Supports automatic dark mode via `prefers-color-scheme`.

---

## ♿ Accessibility

* Uses ARIA roles:

  * `combobox`
  * `listbox`
  * `option`
* Supports keyboard navigation
* Maintains `aria-activedescendant`

---

## 🧠 Design Decisions

* Uses **event-driven architecture** for flexibility
* Keeps components **decoupled and reusable**
* Suggestion logic handled externally (simulates API)
* Highlighting extracted into reusable utility

---

## 📌 Notes

* Suggestions are generated locally (no API required)
* Minimum query length is recommended (≥ 2 characters)
* Dropdown positioning updates on scroll and resize

---

## 🧑‍💻 Author

Benedict Bisana

---
