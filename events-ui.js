const $ = (s) => document.querySelector(s);

const icons = {
  calendar: `<svg class="td-ic" viewBox="0 0 24 24" width="16" height="16"><path d="M8 2v4M16 2v4M3 10h18M5 6h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="2" fill="none"/></svg>`,
  map: `<svg class="td-ic" viewBox="0 0 24 24" width="16" height="16"><path d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 1 1 18 0z"/><path d="M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke="currentColor" stroke-width="2" fill="none"/></svg>`,
  users: `<svg class="td-ic" viewBox="0 0 24 24" width="16" height="16"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><path d="M12 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" fill="none"/></svg>`,
  arrow: `<svg class="td-ic" viewBox="0 0 24 24" width="16" height="16"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none"/></svg>`
};

async function loadEvents() {
  const grid = $("#td-events-grid");
  if (!grid) return;

  try {
    const res = await fetch("./events.json", { cache: "no-store" });
    if (!res.ok) throw new Error(res.statusText);
    const events = await res.json();

    grid.innerHTML = events
      .map(
        (e) => `
        <article class="td-card ${e.featured ? "featured" : ""}">
          ${e.featured ? `<div class="td-badge">À ne pas manquer</div>` : ""}
          <div class="td-row">${icons.calendar}<span>${e.date} • ${e.time}</span></div>
          <h3 class="td-title-sm">${e.title}</h3>
          <p class="td-desc">${e.description}</p>
          <div class="td-row">${icons.map}<span>${e.location}</span></div>
          <div class="td-row">${icons.users}<span>${e.spots}</span></div>
          <a href="${e.tally}" class="td-btn td-btn-primary" target="_blank" rel="noreferrer">
            Je m’inscris ${icons.arrow}
          </a>
        </article>`
      )
      .join("");
  } catch (err) {
    grid.innerHTML =
      "<div class='td-center'><p>Aucun événement pour le moment.</p></div>";
  }
}

document.addEventListener("DOMContentLoaded", loadEvents);
