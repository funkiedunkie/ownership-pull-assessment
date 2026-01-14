(function () {
  function tally(formData) {
    const dims = {
      motive_creation: 0,
      motive_escape: 0,
      desire_control: 0,
      desire_flex: 0,
      driver_status: 0,
      driver_autonomy: 0,
      fear_regret: 0,
      fear_failure: 0
    };

    const v = (k) => formData.get(k);

    // Motivation
    if (v("q1") === "creation") dims.motive_creation++;
    if (v("q1") === "escape") dims.motive_escape++;
    if (v("q2") === "creation") dims.motive_creation++;
    if (v("q2") === "escape") dims.motive_escape++;

    // Desire
    if (v("q3") === "control") dims.desire_control++;
    if (v("q3") === "flex") dims.desire_flex++;
    if (v("q4") === "control") dims.desire_control++;
    if (v("q4") === "flex") dims.desire_flex++;

    // Driver
    if (v("q5") === "status") dims.driver_status++;
    if (v("q5") === "autonomy") dims.driver_autonomy++;
    // mixed = no increment
    if (v("q6") === "status") dims.driver_status++;
    if (v("q6") === "autonomy") dims.driver_autonomy++;

    // Fear
    if (v("q7") === "regret") dims.fear_regret++;
    if (v("q7") === "failure") dims.fear_failure++;
    if (v("q8") === "regret") dims.fear_regret++;
    if (v("q8") === "failure") dims.fear_failure++;
    // mixed = no increment

    // Texture (not scored heavily, but used for phrasing)
    const texture = {
      uncertainty: v("q9"),   // uncertain_drain | uncertain_tolerate | uncertain_avoid
      pattern: v("q10"),      // quiet | research | park | pressure
      permission: v("q11")    // permission
    };

    return { dims, texture };
  }

  function pickDominant(a, b, labelA, labelB) {
    if (a > b) return labelA;
    if (b > a) return labelB;
    return "mixed";
  }

  function buildReflection(dims, texture) {
    const motive = pickDominant(dims.motive_creation, dims.motive_escape, "creation", "escape");
    const desire = pickDominant(dims.desire_control, dims.desire_flex, "control", "flexibility");
    const driver = pickDominant(dims.driver_status, dims.driver_autonomy, "status", "autonomy");
    const fear = pickDominant(dims.fear_regret, dims.fear_failure, "regret", "failure");

    const motiveLine = {
      creation: "What’s pulling you toward ownership looks less like a random idea and more like a creation urge—building something that reflects how you think and operate.",
      escape: "What’s pulling you toward ownership looks less like a shiny ambition and more like a pressure release—stepping out of constraints you didn’t choose.",
      mixed: "What’s pulling you toward ownership isn’t one clean reason. It’s a blend: part creation, part escape. That mix is common—and it matters."
    }[motive];

    const desireLine = {
      control: "A big part of the appeal is control: decisions, direction, and outcomes. Not because you need power—because you want ownership over consequence.",
      flexibility: "A big part of the appeal is flexibility: time, optionality, and a life that feels self-directed. Not because you want less work—because you want the work to fit."
    }[desire === "mixed" ? "flexibility" : desire]; // default if mixed

    const driverLine = {
      status: "You may also be carrying a quiet identity driver: recognition. Being someone who built something—seen, legitimate—matters more than most people admit.",
      autonomy: "Your identity driver is cleaner: autonomy. Not answering to someone else, choosing the rules, and designing your days is the core pull.",
      mixed: "Your identity driver isn’t singular. Part of you wants autonomy; part of you wants the legitimacy of being ‘the owner.’ Neither is wrong—just worth naming."
    }[driver];

    const fearLine = {
      regret: "The emotional engine underneath this is more regret than failure: the discomfort of looking back and wondering what could have been.",
      failure: "The emotional engine underneath this is more failure than regret: the desire to protect what’s stable and avoid a mistake that costs you time, money, or identity.",
      mixed: "The emotional engine underneath this is split: fear of regret and fear of failure are both active, which can create a push-pull that feels like ‘stuck.’"
    }[fear];

    const textureLine = (() => {
      if (texture.uncertainty === "uncertain_avoid") return "You’re not wired to live in open-ended uncertainty for long. That’s not a weakness—it’s a constraint to respect.";
      if (texture.uncertainty === "uncertain_drain") return "Uncertainty may energize you initially, then wear you down. Momentum matters more for you than perfect clarity.";
      return "You can tolerate uncertainty when there’s purpose. You don’t need certainty—you need a reason that feels real.";
    })();

    const closeLine =
      "This reflection isn’t telling you to act. It’s giving language to what’s already present. The next step—if you ever take one—should be small, voluntary, and grounded.";

    return [
      `<p>${motiveLine}</p>`,
      `<p>${desireLine}</p>`,
      `<p>${driverLine}</p>`,
      `<p>${fearLine}</p>`,
      `<p>${textureLine}</p>`,
      `<p><strong>${closeLine}</strong></p>`
    ].join("");
  }

  function persistAnswers(formEl) {
    const fd = new FormData(formEl);
    const data = Object.fromEntries(fd.entries());
    localStorage.setItem("ownership_pull_answers", JSON.stringify(data));
  }

  function loadAnswers() {
    const raw = localStorage.getItem("ownership_pull_answers");
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  // On index: intercept submit to compute reflection + still allow Netlify form POST
  const form = document.querySelector('form[name="ownership-pull"]');
  if (form) {
    form.addEventListener("submit", () => {
      persistAnswers(form);
    });
  }

  // On result: render reflection
  const reflectionEl = document.getElementById("reflection");
  if (reflectionEl) {
    const answers = loadAnswers();
    if (!answers) {
      reflectionEl.innerHTML = "<p>Couldn’t find your answers. Please take the assessment again.</p>";
      return;
    }
    const fd = new FormData();
    for (const [k, v] of Object.entries(answers)) fd.set(k, v);

    const { dims, texture } = tally(fd);
    reflectionEl.innerHTML = buildReflection(dims, texture);
  }
})();

