import { html } from "lit";

export function renderHighlight(text: string, query: string) {
  const q = query.trim();
  if (!q || q.length < 2) return html`${text}`;

  const escaped = escapeRegExp(q);
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));

  return html`
    ${parts.map(part =>
      part.toLowerCase() === q.toLowerCase()
        ? html`<span class="highlight">${part}</span>`
        : part
    )}
  `;
}

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}