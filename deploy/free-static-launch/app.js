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
