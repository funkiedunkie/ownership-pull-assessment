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
        { label: "Impact / meaning matters more than either.", value: "impact" },
        { label: "Neither of these captures it.", value: "neither" },
      ],
    },
    {
      id: "q6",
      text: "Imagine two futures. Which one feels more satisfying?",
      options: [
        { label: "People recognize you as someone who built something.", value: "status" },
        { label: "You quietly design your days without much outside input.", value: "autonomy" },
        { label: "The work itself matters more than recognition.", value: "impact" },
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

  const answers = {};
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

    q.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "opt";
      btn.setAttribute("aria-pressed", selected === opt.value ? "true" : "false");
      btn.textContent = opt.label;
      btn.addEventListener("click", () => {
        answers[q.id] = opt.value;
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

  function dominant3(a, b, c, la, lb, lc) {
    const max = Math.max(a, b, c);
    const winners = [a === max, b === max, c === max].filter(Boolean).length;
    if (winners !== 1) return "mixed";
    if (a === max) return la;
    if (b === max) return lb;
    return lc;
  }

  function permissionLine(permissionKey) {
    const map = {
      permission_not_crazy: "You’re not crazy for wanting this.",
      permission_no_rush: "You don’t need to rush this.",
      permission_you_can: "You could actually do this.",
      permission_its_ok: "It’s okay if this never becomes anything.",
    };
    return map[permissionKey] || "You don’t need to rush this.";
  }

  function paintOwnershipFuture({ motive, desire, driver, fear, uncertainty, pattern }) {
    // Keep this descriptive, not prescriptive. No “you should start a business.”
    const motiveFrame = {
      creation: "You’re pulled toward ownership as a way to build—something that reflects how you think and operate.",
      escape: "You’re pulled toward ownership as a way to change constraints—more agency, less friction, fewer borrowed rules.",
      mixed: "You’re pulled toward ownership for more than one reason—part building, part changing what feels constrained.",
    }[motive];

    const driverFrame = {
      autonomy: "The best-fit version of ownership for you is self-directed: clear authority, clear standards, clear decision rights.",
      impact: "The best-fit version of ownership for you is meaning-driven: a business where the work itself matters more than how it looks.",
      status: "Recognition can be part of the picture, but it has to come from building something real—not posturing.",
      mixed: "Your driver isn’t singular. A good-fit business will satisfy autonomy and impact, without forcing a status game.",
    }[driver];

    const operatingShape = (() => {
      // Translate desire into what the business “feels like”
      if (desire === "control") {
        return [
          "A simple, focused business (one clear offer, one clear customer).",
          "You can set standards, tighten operations, and remove bottlenecks.",
          "You are the architect early—building a machine you can trust."
        ];
      }
      if (desire === "flexibility") {
        return [
          "A business that can be staffed and scheduled without you being the bottleneck.",
          "Fewer emergencies, fewer dependencies, more repeatable delivery.",
          "Your time is protected by design, not willpower."
        ];
      }
      return [
        "A business with enough structure to feel real, and enough flexibility to evolve.",
        "You can make meaningful decisions without drowning in complexity.",
        "The point is traction—not perfect certainty."
      ];
    })();

    const weekFeelsLike = (() => {
      if (driver === "impact") {
        return [
          "You spend time close to the customer problem, not just the numbers.",
          "You measure success by outcomes delivered, not by optics.",
          "You keep the business small enough to protect the mission."
        ];
      }
      if (driver === "autonomy") {
        return [
          "Monday: pick priorities, kill one bottleneck.",
          "Midweek: work on standards—quality, hiring, customer experience.",
          "Friday: tighten the machine so next week has fewer surprises."
        ];
      }
      return [
        "You alternate between decisions (direction) and systems (repeatability).",
        "You don’t chase chaos. You convert it into process.",
        "You protect momentum with a small set of weekly operating habits."
      ];
    })();

    const riskToWatch = (() => {
      // Use fear + pattern to name how they get stuck
      const fearLine =
        fear === "regret"
          ? "Your risk isn’t laziness. It’s letting time pass while you wait for certainty."
          : fear === "failure"
            ? "Your risk isn’t fear itself. It’s protecting stability so hard you never test what could work."
            : "Your risk is a push-pull loop: wanting movement and wanting safety at the same time.";

      const patternLine = {
        research: "When you’re unsure, you’ll tend to over-research. Your antidote is a bounded experiment that creates real information.",
        quiet: "When you’re unsure, you’ll tend to keep it internal. Your antidote is one external step that makes it real (conversation, shortlist, small action).",
        park: "When you’re unsure, you’ll tend to park it. Your antidote is a calendar-based decision: one small action this week, then reassess.",
        pressure: "When you’re unsure, you’ll tend to force a decision. Your antidote is permission to sequence: explore → test → commit.",
      }[pattern] || "Your antidote is a bounded experiment that creates real information.";

      const uncertaintyLine = (() => {
        if (uncertainty === "uncertain_avoid") return "Design around uncertainty: fewer moving parts, clearer economics, cleaner roles.";
        if (uncertainty === "uncertain_drain") return "Momentum matters: small wins beat big deliberation.";
        return "You can handle uncertainty when there’s purpose: pick a direction that feels meaningful, then test it.";
      })();

      return [fearLine, patternLine, uncertaintyLine];
    })();

    const whatItMightLookLike = (() => {
      // Category-level examples only. No “buy this type of business.”
      if (driver === "impact") {
        return [
          "Owner-led services with clear outcomes (where craft and care matter).",
          "Community-rooted businesses where values are visible in delivery.",
          "Small teams solving a specific, real problem."
        ];
      }
      if (desire === "control") {
        return [
          "Process-driven local businesses with repeatable delivery.",
          "B2B services where standards and reliability win.",
          "A business where ops improvements show up quickly in results."
        ];
      }
      return [
        "Businesses with stable demand and delegation potential.",
        "Offerings that can be delivered consistently by a team.",
        "A model where you can step back without the engine stalling."
      ];
    })();

    return `
      <div class="divider"></div>
      <h2 style="margin:0 0 10px; font-size:18px;">A picture of you as an owner (if you choose ownership)</h2>
      <p>${motiveFrame}</p>
      <p>${driverFrame}</p>

      <h3 style="margin:14px 0 8px; font-size:16px;">What the business tends to look like</h3>
      <ul style="margin:0 0 12px; padding-left:18px;">
        ${operatingShape.map(x => `<li>${x}</li>`).join("")}
      </ul>

      <h3 style="margin:14px 0 8px; font-size:16px;">What a good week feels like</h3>
      <ul style="margin:0 0 12px; padding-left:18px;">
        ${weekFeelsLike.map(x => `<li>${x}</li>`).join("")}
      </ul>

      <h3 style="margin:14px 0 8px; font-size:16px;">What to watch for</h3>
      <ul style="margin:0 0 12px; padding-left:18px;">
        ${riskToWatch.map(x => `<li>${x}</li>`).join("")}
      </ul>

      <h3 style="margin:14px 0 8px; font-size:16px;">Where people with this pattern often start looking</h3>
      <ul style="margin:0 0 4px; padding-left:18px;">
        ${whatItMightLookLike.map(x => `<li>${x}</li>`).join("")}
      </ul>
    `;
  }

  function computeReflection() {
    const dims = {
      motive_creation: 0,
      motive_escape: 0,
      desire_control: 0,
      desire_flex: 0,
      driver_status: 0,
      driver_autonomy: 0,
      driver_impact: 0,
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
    if (answers.q5 === "impact") dims.driver_impact++;
    if (answers.q6 === "status") dims.driver_status++;
    if (answers.q6 === "autonomy") dims.driver_autonomy++;
    if (answers.q6 === "impact") dims.driver_impact++;

    // fear
    if (answers.q7 === "regret") dims.fear_regret++;
    if (answers.q7 === "failure") dims.fear_failure++;
    if (answers.q8 === "regret") dims.fear_regret++;
    if (answers.q8 === "failure") dims.fear_failure++;

    const motive = dominant(dims.motive_creation, dims.motive_escape, "creation", "escape");
    const desire = dominant(dims.desire_control, dims.desire_flex, "control", "flexibility");
    const driver = dominant3(
      dims.driver_status,
      dims.driver_autonomy,
      dims.driver_impact,
      "status",
      "autonomy",
      "impact"
    );
    const fear = dominant(dims.fear_regret, dims.fear_failure, "regret", "failure");

    const uncertainty = answers.q9;  // uncertain_drain | uncertain_tolerate | uncertain_avoid
    const pattern = answers.q10;     // quiet | research | park | pressure
    const permission = answers.q11;  // permission_...

    const motiveLine = {
      creation:
        "What’s pulling you toward ownership looks less like a random idea and more like a creation urge—building something that reflects how you think and operate.",
      escape:
        "What’s pulling you toward ownership looks less like a shiny ambition and more like a pressure release—stepping out of constraints you didn’t choose.",
      mixed:
        "What’s pulling you toward ownership isn’t one clean reason. It’s a blend: part creation, part escape. That mix is common—and it matters.",
    }[motive];

    const desireLine =
      desire === "control"
        ? "A big part of the appeal is control: decisions, direction, and outcomes. Not because you need power—because you want ownership over consequence."
        : "A big part of the appeal is flexibility: time, optionality, and a life that feels self-directed. Not because you want less work—because you want the work to fit.";

    // Only mention recognition if status is strong (both driver questions picked status)
    const statusStrong = (dims.driver_status >= 2);

    const driverLine = (() => {
      if (statusStrong) {
        return "Recognition may play a role for you—less as ego, more as proof you built something real. Still, it doesn’t have to be the main driver.";
      }
      if (driver === "autonomy") {
        return "Your identity driver is autonomy: choosing the rules, owning decisions, and designing your days matters more than titles.";
      }
      if (driver === "impact") {
        return "Your identity driver is impact: the work and what it changes matters more than titles or recognition.";
      }
      return "Your identity driver isn’t singular. Autonomy, impact, and recognition can all show up—but none appears dominant enough to label you.";
    })();

    const fearLine = {
      regret:
        "The emotional engine underneath this is more regret than failure: the discomfort of looking back and wondering what could have been.",
      failure:
        "The emotional engine underneath this is more failure than regret: the desire to protect what’s stable and avoid a mistake that costs you time, money, or identity.",
      mixed:
        "The emotional engine underneath this is split: fear of regret and fear of failure are both active, which can create a push-pull that feels like ‘stuck.’",
    }[fear];

    const textureLine = (() => {
      if (uncertainty === "uncertain_avoid")
        return "You’re not wired to live in open-ended uncertainty for long. That’s a constraint to respect.";
      if (uncertainty === "uncertain_drain")
        return "Uncertainty may energize you initially, then wear you down. Momentum matters more for you than perfect clarity.";
      return "You can tolerate uncertainty when there’s purpose. You don’t need certainty—you need a reason that feels real.";
    })();

    const closeLine =
      "This reflection isn’t telling you to act. It’s giving language to what’s already present.";

    const permissionText = permissionLine(permission);

    const painted = paintOwnershipFuture({
      motive,
      desire,
      driver,
      fear,
      uncertainty,
      pattern,
    });

    return [
      `<p>${motiveLine}</p>`,
      `<p>${desireLine}</p>`,
      `<p>${driverLine}</p>`,
      `<p>${fearLine}</p>`,
      `<p>${textureLine}</p>`,
      `<p><strong>${closeLine}</strong></p>`,
      `<p><em>${permissionText}</em></p>`,
      painted,
    ].join("");
  }

  async function submitToNetlifyForms() {
    const form = document.querySelector('form[name="ownership-pull"]');
    if (!form) return;

    [...form.querySelectorAll('input[data-injected="true"]')].forEach(n => n.remove());

    Object.entries(answers).forEach(([k, v]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = k;
      input.value = v;
      input.setAttribute("data-injected", "true");
      form.appendChild(input);
    });

    const fd = new FormData(form);
    const body = new URLSearchParams(fd);

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
