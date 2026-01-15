(() => {
  const QUESTIONS = [
    {
      id: "q1",
      text: "When the idea of owning a business comes up, what’s usually underneath it?",
      options: [
        { label: "I want to build something of my own.", value: "creation" },
        { label: "I want to get out of my current situation.", value: "escape" },
        { label: "Both, but escape is louder right now.", value: "escape" },
        { label: "Both, but creation is louder right now.", value: "creation" },
      ],
    },
    {
      id: "q2",
      text: "Which thought feels more familiar?",
      options: [
        { label: "“I want to create something that reflects how I think.”", value: "creation" },
        { label: "“I’m tired of working inside constraints I didn’t choose.”", value: "escape" },
      ],
    },
    {
      id: "q3",
      text: "If ownership worked the way you imagine, what would change first?",
      options: [
        { label: "I’d control decisions and direction.", value: "control" },
        { label: "I’d control my time and schedule.", value: "flex" },
        { label: "I’d have more influence, even if I worked a lot.", value: "control" },
        { label: "I’m not sure—I just know things would feel different.", value: "unsure" },
      ],
    },
    {
      id: "q4",
      text: "Which tradeoff feels more acceptable right now?",
      options: [
        { label: "More responsibility in exchange for control.", value: "control" },
        { label: "Less control in exchange for flexibility.", value: "flex" },
      ],
    },
    {
      id: "q5",
      text: "Which statement feels closer—even if you don’t love it?",
      options: [
        { label: "Being “the owner” matters more than I admit.", value: "status" },
        { label: "Not answering to someone else matters more than titles.", value: "autonomy" },
        { label: "I go back and forth.", value: "mixed" },
      ],
    },
    {
      id: "q6",
      text: "Imagine two futures. Which one feels more satisfying?",
      options: [
        { label: "People recognize you as someone who built something.", value: "status" },
        { label: "You quietly design your days without much outside input.", value: "autonomy" },
      ],
    },
    {
      id: "q7",
      text: "Which fear shows up more often?",
      options: [
        { label: "“I’ll regret not trying.”", value: "regret" },
        { label: "“I’ll regret trying and failing.”", value: "failure" },
        { label: "They show up about equally.", value: "mixed" },
      ],
    },
    {
      id: "q8",
      text: "When you imagine doing nothing different for the next 5 years, you feel:",
      options: [
        { label: "Uneasy, restless.", value: "regret" },
        { label: "Relieved, stable.", value: "failure" },
        { label: "Both, depending on the day.", value: "mixed" },
      ],
    },
    {
      id: "q9",
      text: "Which feels more true?",
      options: [
        { label: "Uncertainty energizes me at first, then drains me.", value: "uncertain_drain" },
        { label: "Uncertainty stresses me, but I can tolerate it if there’s purpose.", value: "uncertain_tolerate" },
        { label: "I avoid uncertainty whenever possible.", value: "uncertain_avoid" },
      ],
    },
    {
      id: "q10",
      text: "When you don’t have a clear next step, you tend to:",
      options: [
        { label: "Keep thinking about it quietly.", value: "quiet" },
        { label: "Research endlessly.", value: "research" },
        { label: "Park it and revisit later.", value: "park" },
        { label: "Feel pressure to decide even if it’s premature.", value: "pressure" },
      ],
    },
    {
  id: "q11",
  text: "Which sentence do you most want to hear from someone credible?",
  options: [
    { label: "“You’re not crazy for wanting this.”", value: "permission_not_crazy" },
    { label: "“You don’t need to rush this.”", value: "permission_no_rush" },
    { label: "“You could actually do this.”", value: "permission_you_can" },
    { label: "“It’s okay if this never becomes anything.”", value: "permission_its_ok" },
  ],
},
  ];

  const els = {
    progressBar: document.getElementById("progressBar"),
    stepLabel: document.getElementById("stepLabel"),
    questionText: document.getElementById("questionText"),
    options: document.getElementById("options"),
    backBtn: document.getElementById("backBtn"),
    nextBtn: document.getElementById("nextBtn"),
    stageQuestion: document.getElementById("stageQuestion"),
    stageResult: document.getElementById("stageResult"),
    reflection: document.getElementById("reflection"),
    restartBtn: document.getElementById("restartBtn"),
  };

  const answers = {}; // { q1: value, ... }
  let step = 0;

  function pct(n, d) {
    return Math.round((n / d) * 100);
  }

  function render() {
    const total = QUESTIONS.length;
    const q = QUESTIONS[step];
    els.nextBtn.textContent = (step === QUESTIONS.length - 1) ? "See results" : "Next";
    els.stepLabel.textContent = `${step + 1} / ${total}`;
    els.progressBar.style.width = `${pct(step, total - 1)}%`;

    els.questionText.textContent = q.text;
    els.options.innerHTML = "";

    const selected = answers[q.id];

    q.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "opt";
      btn.setAttribute("aria-pressed", selected === opt.value ? "true" : "false");
      btn.textContent = opt.label;
      btn.addEventListener("click", () => {
        answers[q.id] = opt.value;
        // update pressed state
        [...els.options.querySelectorAll(".opt")].forEach(b => b.setAttribute("aria-pressed", "false"));
        btn.setAttribute("aria-pressed", "true");
        els.nextBtn.disabled = false;
      });
      els.options.appendChild(btn);
    });

    els.backBtn.disabled = step === 0;
    els.nextBtn.disabled = !selected;
  }

  function dominant(a, b, labelA, labelB) {
    if (a > b) return labelA;
    if (b > a) return labelB;
    return "mixed";
  }

  function computeReflection() {
    const dims = {
      motive_creation: 0,
      motive_escape: 0,
      desire_control: 0,
      desire_flex: 0,
      driver_status: 0,
      driver_autonomy: 0,
      fear_regret: 0,
      fear_failure: 0,
    };

    // motivation
    if (answers.q1 === "creation") dims.motive_creation++;
    if (answers.q1 === "escape") dims.motive_escape++;
    if (answers.q2 === "creation") dims.motive_creation++;
    if (answers.q2 === "escape") dims.motive_escape++;

    // desire
    if (answers.q3 === "control") dims.desire_control++;
    if (answers.q3 === "flex") dims.desire_flex++;
    if (answers.q4 === "control") dims.desire_control++;
    if (answers.q4 === "flex") dims.desire_flex++;

    // driver
    if (answers.q5 === "status") dims.driver_status++;
    if (answers.q5 === "autonomy") dims.driver_autonomy++;
    if (answers.q6 === "status") dims.driver_status++;
    if (answers.q6 === "autonomy") dims.driver_autonomy++;

    // fear
    if (answers.q7 === "regret") dims.fear_regret++;
    if (answers.q7 === "failure") dims.fear_failure++;
    if (answers.q8 === "regret") dims.fear_regret++;
    if (answers.q8 === "failure") dims.fear_failure++;

    const motive = dominant(dims.motive_creation, dims.motive_escape, "creation", "escape");
    const desire = dominant(dims.desire_control, dims.desire_flex, "control", "flexibility");
    const driver = dominant(dims.driver_status, dims.driver_autonomy, "status", "autonomy");
    const fear = dominant(dims.fear_regret, dims.fear_failure, "regret", "failure");

    const textureUncertainty = answers.q9;   // drain | tolerate | avoid

    const motiveLine = {
      creation: "What’s pulling you toward ownership looks less like a random idea and more like a creation urge—building something that reflects how you think and operate.",
      escape: "What’s pulling you toward ownership looks less like a shiny ambition and more like a pressure release—stepping out of constraints you didn’t choose.",
      mixed: "What’s pulling you toward ownership isn’t one clean reason. It’s a blend: part creation, part escape. That mix is common—and it matters."
    }[motive];

    const desireLine = (desire === "control")
      ? "A big part of the appeal is control: decisions, direction, and outcomes. Not because you need power—because you want ownership over consequence."
      : "A big part of the appeal is flexibility: time, optionality, and a life that feels self-directed. Not because you want less work—because you want the work to fit.";

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
      if (textureUncertainty === "uncertain_avoid") return "You’re not wired to live in open-ended uncertainty for long. That’s not a weakness—it’s a constraint to respect.";
      if (textureUncertainty === "uncertain_drain") return "Uncertainty may energize you initially, then wear you down. Momentum matters more for you than perfect clarity.";
      return "You can tolerate uncertainty when there’s purpose. You don’t need certainty—you need a reason that feels real.";
    })();

    const closeLine = "This reflection isn’t telling you to act. It’s giving language to what’s already present. If you ever take a next step, it should be small, voluntary, and grounded.";

    return [
      `<p>${motiveLine}</p>`,
      `<p>${desireLine}</p>`,
      `<p>${driverLine}</p>`,
      `<p>${fearLine}</p>`,
      `<p>${textureLine}</p>`,
      `<p><strong>${closeLine}</strong></p>`
    ].join("");
  }

  async function submitToNetlifyForms() {
    const form = document.querySelector('form[name="ownership-pull"]');
    if (!form) return;

    // remove prior injected inputs
    [...form.querySelectorAll('input[data-injected="true"]')].forEach(n => n.remove());

    // inject answers as hidden inputs
    Object.entries(answers).forEach(([k, v]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = k;
      input.value = v;
      input.setAttribute("data-injected", "true");
      form.appendChild(input);
    });

    // netlify honeypot left empty by default
    const fd = new FormData(form);
    const body = new URLSearchParams(fd);

    // POST to root (Netlify will capture)
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
    } catch {
      // ignore submission errors; do not block UX
    }
  }

  function showResults() {
    if (!els.stageResult || !els.reflection) {
    alert("Results view is missing. Check index.html ids: stageResult and reflection.");
    return;
  }
    els.stageQuestion.classList.add("stage--hidden");
    els.stageResult.classList.remove("stage--hidden");
    els.progressBar.style.width = "100%";
    els.stepLabel.textContent = `Done`;
    els.reflection.innerHTML = computeReflection();
    submitToNetlifyForms(); // optional capture
  }

  els.nextBtn.addEventListener("click", () => {
    if (step < QUESTIONS.length - 1) {
      step++;
      render();
    } else {
      showResults();
    }
  });

  els.backBtn.addEventListener("click", () => {
    if (step > 0) {
      step--;
      render();
    }
  });

  els.restartBtn.addEventListener("click", () => {
    Object.keys(answers).forEach(k => delete answers[k]);
    step = 0;
    els.stageResult.classList.add("stage--hidden");
    els.stageQuestion.classList.remove("stage--hidden");
    render();
  });

  render();
})();
