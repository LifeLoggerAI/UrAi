const waitlist = document.querySelector("[data-waitlist-form]");
if (waitlist) {
  waitlist.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = new FormData(waitlist).get("email");
    const output = document.querySelector("[data-waitlist-output]");
    if (!String(email || "").includes("@")) {
      output.textContent = "Drop a real email and we’ll keep it ready for the backend lane.";
      return;
    }
    const entries = JSON.parse(localStorage.getItem("urai_waitlist_static") || "[]");
    entries.push({ email, createdAt: new Date().toISOString(), mode: "free-static-shell" });
    localStorage.setItem("urai_waitlist_static", JSON.stringify(entries));
    output.textContent = "Saved locally on this device. Full server waitlist turns on with the backend deploy.";
    waitlist.reset();
  });
}


// URAI_CURATED_ASSET_LAYER
(() => {
  function label(name) {
    return String(name || "URAI asset").replace(/[-_]+/g, " ").slice(0, 48);
  }

  function card(asset) {
    const el = document.createElement("article");
    el.className = "urai-asset-card";

    if (asset.type === "image") {
      const img = document.createElement("img");
      img.src = asset.url;
      img.alt = label(asset.name);
      img.loading = "lazy";
      el.appendChild(img);
    } else if (asset.type === "video") {
      const v = document.createElement("video");
      v.src = asset.url;
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.controls = true;
      el.appendChild(v);
    } else if (asset.type === "audio") {
      const a = document.createElement("audio");
      a.src = asset.url;
      a.controls = true;
      el.appendChild(a);
    }

    const l = document.createElement("div");
    l.className = "urai-asset-card__label";
    l.textContent = label(asset.name);
    el.appendChild(l);
    return el;
  }

  function mount() {
    const manifest = window.URAI_STATIC_ASSETS;
    if (!manifest || !Array.isArray(manifest.items) || document.getElementById("urai-asset-dropin")) return;

    const images = manifest.items.filter(a => a.type === "image").slice(0, 12);
    const video = manifest.items.filter(a => a.type === "video").slice(0, 1);
    const audio = manifest.items.filter(a => a.type === "audio").slice(0, 5);
    const show = [...images, ...video, ...audio];

    const section = document.createElement("section");
    section.id = "urai-asset-dropin";
    section.className = "urai-asset-dropin";
    section.innerHTML = `
      <div class="urai-asset-dropin__head">
        <div class="urai-asset-dropin__eyebrow">Genesis assets live</div>
        <h2 class="urai-asset-dropin__title">The public shell is carrying real URAI media.</h2>
        <p class="urai-asset-dropin__copy">
          Curated Spatial chambers, memory images, aura layers, interface marks,
          ambient audio, and demo media are now staged through Firebase Hosting.
        </p>
        <div class="urai-asset-proof-pill">${manifest.count} curated assets · ${Math.round(manifest.totalBytes / 1024 / 1024)} MB live</div>
      </div>
    `;

    const grid = document.createElement("div");
    grid.className = "urai-asset-grid";
    show.forEach(a => grid.appendChild(card(a)));
    section.appendChild(grid);

    (document.querySelector("main") || document.body).appendChild(section);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
