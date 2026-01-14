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
        { label: "“You’re not crazy for wanting this.”", value: "permission" },
        { label: "“You don’t need to rush this.”", value: "permission" },
        { label: "“You could actually do this.”", value: "permission" },
        { label: "“It’s okay if this never becomes anything.”", value: "permission" },
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
    stageResult: document.getElementById("s
