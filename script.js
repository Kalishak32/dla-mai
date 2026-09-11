/* =========================
   DLA MAI - INTERAKCJE
   ========================= */

const screens = [...document.querySelectorAll(".screen")];
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

let currentScreen = 0;

function showScreen(index) {
  if (index < 0 || index >= screens.length) return;

  screens.forEach((screen, i) => {
    screen.classList.toggle("active", i === index);
  });

  currentScreen = index;

  const storyStep = Math.max(0, index);
  const percent = Math.min(100, (storyStep / 7) * 100);
  progressFill.style.width = `${percent}%`;
  progressText.textContent = `${storyStep} / 7`;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => {
    showScreen(currentScreen + 1);
  });
});

/* Ogólne elementy odsłaniane */
document.querySelectorAll("[data-reveal]").forEach((item) => {
  item.addEventListener("click", () => {
    item.classList.add("revealed");

    const screen = item.closest(".screen");
    if (!screen) return;

    const reveals = [...screen.querySelectorAll("[data-reveal]")];
    const allOpen = reveals.every((el) => el.classList.contains("revealed"));

    if (screen.id === "screen-5" && allOpen) {
      document.getElementById("fearFinal").classList.add("show");
    }

    if (allOpen) {
      const next = screen.querySelector("[data-next]");
      if (next) next.disabled = false;
    }
  });
});

/* Karty "co w Tobie lubię" */
const qualityCards = [...document.querySelectorAll("[data-quality]")];
const qualitiesScreen = document.getElementById("screen-3");
const qualitiesHint = document.getElementById("qualitiesHint");

qualityCards.forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.add("open");

    const allOpen = qualityCards.every((c) => c.classList.contains("open"));
    if (allOpen) {
      qualitiesHint.textContent = "chyba właśnie dlatego tak łatwo mi przy Tobie zostać";
      qualitiesScreen.querySelector("[data-next]").disabled = false;
    } else {
      const count = qualityCards.filter((c) => c.classList.contains("open")).length;
      qualitiesHint.textContent = `odkryte ${count} / ${qualityCards.length}`;
    }
  });
});

/* Otwieranie gry */
const openGameButton = document.getElementById("openGame");
const gameSection = document.getElementById("gameSection");

openGameButton.addEventListener("click", () => {
  gameSection.classList.remove("hidden");
  openGameButton.disabled = true;
  openGameButton.textContent = "gra jest niżej ↓";
  setTimeout(() => {
    gameSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 80);
});

/* =========================
   MINIGRA - DWA KOŃCE POLSKI
   ========================= */

const player = document.getElementById("player");
const gameBoard = document.getElementById("gameBoard");
const moveLeft = document.getElementById("moveLeft");
const moveRight = document.getElementById("moveRight");
const restartGame = document.getElementById("restartGame");
const wordCounter = document.getElementById("wordCounter");
const distanceText = document.getElementById("distanceText");
const collectedWords = document.getElementById("collectedWords");
const tokens = [...document.querySelectorAll(".word-token")];
const ending = document.getElementById("ending");

let playerPos = 2;
let collected = [];
let finished = false;

const wordsOrder = ["mimo", "tej", "całej", "odległości", "zależy"];

function setPlayerPosition() {
  player.style.left = `${playerPos}%`;

  if (playerPos < 25) {
    distanceText.textContent = "jeszcze kawałek…";
  } else if (playerPos < 55) {
    distanceText.textContent = "coraz bliżej";
  } else if (playerPos < 80) {
    distanceText.textContent = "już niedaleko";
  } else {
    distanceText.textContent = "prawie jesteś";
  }

  checkTokens();
  checkFinish();
}

function movePlayer(amount) {
  if (finished) return;
  playerPos = Math.max(2, Math.min(98, playerPos + amount));
  setPlayerPosition();
}

function checkTokens() {
  tokens.forEach((token) => {
    if (token.classList.contains("collected")) return;

    const tokenPos = Number(token.dataset.pos);
    if (Math.abs(playerPos - tokenPos) <= 5) {
      token.classList.add("collected");
      collected.push(token.dataset.word);
      renderCollected();
    }
  });
}

function renderCollected() {
  const spans = [...collectedWords.querySelectorAll("span")];

  spans.forEach((span, index) => {
    span.textContent = collected[index] || "_";
  });

  wordCounter.textContent = `słowa: ${collected.length} / 5`;
}

function checkFinish() {
  if (playerPos >= 94 && collected.length === 5 && !finished) {
    finished = true;
    distanceText.textContent = "dotarłaś ♡";
    wordCounter.textContent = "wszystkie słowa zebrane";

    setTimeout(() => {
      gameSection.classList.add("hidden");
      ending.classList.remove("hidden");
      ending.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 900);
  }

  if (playerPos >= 94 && collected.length < 5) {
    distanceText.textContent = "brakuje jeszcze któregoś słowa";
  }
}

moveLeft.addEventListener("click", () => movePlayer(-4));
moveRight.addEventListener("click", () => movePlayer(4));

gameBoard.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    movePlayer(-4);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    movePlayer(4);
  }
});

function resetGame() {
  finished = false;
  playerPos = 2;
  collected = [];

  tokens.forEach((token) => token.classList.remove("collected"));
  renderCollected();
  setPlayerPosition();
  distanceText.textContent = "jeszcze kawałek…";
  gameBoard.focus();
}

restartGame.addEventListener("click", resetGame);

/* Sekret na końcu */
const secretBtn = document.getElementById("secretBtn");
const secretMessage = document.getElementById("secretMessage");

secretBtn.addEventListener("click", () => {
  secretMessage.classList.add("show");
  secretBtn.disabled = true;
  secretBtn.textContent = "to właśnie chciałem powiedzieć";
});

showScreen(0);
resetGame();
