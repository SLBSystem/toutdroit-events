const $ = (sel) => document.querySelector(sel);

const fmtDate = (iso) => {
  if (!iso) return "À venir";
  try {
    const d = new Date(iso);
    return d.toLocaleString("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }).replace(".", "");
  } catch { return iso; }
};

async function load() {
  $("#next-wrap").innerHTML = "<p class='empty'>Chargement…</p>";
  $("#list-wrap").innerHTML = "";

  try {
    const res = await fetch("./events.json", { cache: "no-store" });
    if (!res.ok) throw new Error(res.statusText);
    const raw = await res.json();
    const list = Array.isArray(raw) ? raw : Object.values(raw || {});
    const now = new Date();

    const upcoming = list
      .filter(e => new Date(e.date) >= now)
      .sort((a,b) => new Date(a.date) - new Date(b.date));

    // Prochain event
    if (upcoming.length) {
      const n = upcoming[0];
      $("#next-wrap").innerHTML = `
        <article class="card">
          <div class="badge">À ne pas manquer</div>
          <div class="meta">📅 ${fmtDate(n.date)}<br>📍 ${n.location || "Lieu à venir"}</div>
          <h3>${n.title}</h3>
          ${n.description ? `<p>${n.description}</p>` : ""}
          ${n.places ? `<div class="places">👥 ${n.places}</div>` : ""}
          ${n.tally ? `<a class="btn primary small" href="${n.tally}" target="_blank" rel="noreferrer">Je m’inscris</a>` : ""}
        </article>
      `;
    } else {
      $("#next-wrap").innerHTML = `
        <div class="empty">
          Aucun événement en cours. Suis-nous sur
          <a href="https://www.instagram.com/toutdroit.td" target="_blank" rel="noreferrer">Instagram</a>
          pour être prévenu.
        </div>`;
    }

    // Grille
    if (upcoming.length) {
      $("#list-wrap").innerHTML = upcoming.map(e => `
        <article class="card event-card">
          <div class="badge">À venir</div>
          <div class="meta">📅 ${fmtDate(e.date)}<br>📍 ${e.location || "Lieu à venir"}</div>
          <h3>${e.title}</h3>
          ${e.description ? `<p>${e.description}</p>` : ""}
          ${e.places ? `<div class="places">👥 ${e.places}</div>` : ""}
          ${e.tally ? `<a class="btn primary small" href="${e.tally}" target="_blank" rel="noreferrer">Je m’inscris</a>` : ""}
        </article>
      `).join("");
    }

  } catch (err) {
    $("#next-wrap").innerHTML = `<div class="empty">Erreur de chargement. Recharge la page.</div>`;
  }
}

load();
