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

### 3. Build project

```
npm run build
```

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

  search.results = [
    {
      id: "cust-001",
      type: "customer",
      title: "John Tan",
      subtitle: "Customer ID: C10293"
    },
    {
      id: "acct-001",
      type: "account",
      title: "Savings Account",
      subtitle: "**** 2345"
    }
  ];

  search.addEventListener("search-change", (e) => {
    const query = e.detail.toLowerCase();

    if (query.length < 2) {
      search.searchSuggestions = [];
      return;
    }

    search.searchSuggestions = search.results
      .filter(r =>
        r.title.toLowerCase().includes(query)
      )
      .slice(0, 5);
  });

  search.addEventListener("result-selected", (e) => {
    console.log("Selected:", e.detail);
  });
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