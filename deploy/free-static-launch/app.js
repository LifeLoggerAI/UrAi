(function () {
  function go(path) {
    window.location.href = path;
  }

  document.addEventListener("click", function (event) {
    const action = event.target.closest("[data-go]");
    if (action) {
      event.preventDefault();
      go(action.getAttribute("data-go"));
    }
  });

  const sparkForm = document.querySelector("[data-spark-form]");
  if (sparkForm) {
    const output = document.querySelector("[data-spark-output]");
    const memory = sparkForm.querySelector("[name='memory']");
    const tone = sparkForm.querySelector("[name='tone']");

    sparkForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const m = (memory.value || "A quiet first spark").trim();
      const t = (tone.value || "hopeful").trim();
      localStorage.setItem("urai_static_first_spark", JSON.stringify({ memory: m, tone: t, createdAt: new Date().toISOString() }));
      output.innerHTML = `<strong>Preview spark saved.</strong><br>${m}<br><span class="small">Tone: ${t}. This is local-only until backend hosting is live.</span>`;
    });
  }

  const strip = document.querySelector("[data-asset-strip]");
  if (strip && window.URAI_STATIC_ASSETS && Array.isArray(window.URAI_STATIC_ASSETS.assets)) {
    const imgs = window.URAI_STATIC_ASSETS.assets.filter(a => a.type === "image").slice(0, 8);
    strip.innerHTML = imgs.map(a => `<div class="asset-tile"><img src="${a.path}" alt="${a.name || "URAI visual asset"}"></div>`).join("");
  }
})();
