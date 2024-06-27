document.getElementById("start-button").addEventListener("click", showIntro);
document
  .getElementById("next-button")
  .addEventListener("click", showLevelIntro);
document
  .getElementById("start-level-button")
  .addEventListener("click", startLevel);
document.getElementById("restart-button").addEventListener("click", startGame);

const gameArea = document.getElementById("game-area");
const scoreDisplay = document.getElementById("score");
const levelTitle = document.getElementById("level-title");
const endMessage = document.getElementById("end-message");
const kirbyDialogue = document.getElementById("kirby-dialogue");
const levelDialogue = document.getElementById("level-dialogue");

let score = 0;
let level = 1;
let gameInterval;
let introIndex = 0;

const trashTypes = [
  ["slike/kesa.png", "slike/flase.png", "slike/slamcice.png"], // Nivo 1
  ["slike/baterije.png", "slike/farbe.png", "slike/kiselina.png"], // Nivo 2
  ["slike/tv.png", "slike/racunar.png", "slike/telefon.png"], // Nivo 3
];
const goodTypes = ["slike/biljka.png", "slike/leptiri.png", "slike/ptica.png"];
const kirbyImage = "slike/kirby.png";

const intros = [
  "OBJASNJENJE CELE IGRE(moze i da se ovo skroz obrise)",
  "Kirby is in the city. Help him collect chemical waste like old batteries, paints, and acids.",
  "Kirby is at the landfill. Help him collect electronic waste like broken computers, old phones, and TVs.",
];

const levelExplanations = [
  "Help Kirby clean the beach by clicking on the trash! Avoid flowers and butterflies.",
  "Help Kirby collect chemical waste in the city. Look for old batteries, paints, and acids.",
  "Help Kirby collect electronic waste at the landfill. Look for broken computers, old phones, and TVs.",
];

function showIntro() {
  introIndex = 0;
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("intro-screen").classList.remove("hidden");
  updateKirbyDialogue();
}

function showLevelIntro() {
  document.getElementById("intro-screen").classList.add("hidden");
  document.getElementById("level-intro-screen").classList.remove("hidden");
  updateLevelDialogue();
}

function updateKirbyDialogue() {
  kirbyDialogue.textContent = intros[introIndex];
  introIndex++;
  if (introIndex >= intros.length) {
    document
      .getElementById("next-button")
      .removeEventListener("click", showLevelIntro);
    document
      .getElementById("next-button")
      .addEventListener("click", showLevelIntro);
  }
}

function updateLevelDialogue() {
  levelDialogue.textContent = levelExplanations[level - 1];
}

function startGame() {
  const playerName = document.getElementById("player-name").value || "Player";
  score = 0;
  level = 1;
  document.getElementById("intro-screen").classList.add("hidden");
  document.getElementById("level-intro-screen").classList.remove("hidden");
  document.getElementById("end-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.add("hidden");
  updateLevelDialogue();
  updateScore();
}

function startLevel() {
  document.getElementById("level-intro-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.remove("hidden");
  levelTitle.textContent = `Level ${level}`;
  gameArea.innerHTML = "";
  for (let i = 0; i < 16; i++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    gameArea.appendChild(tile);
  }
  gameInterval = setInterval(() => {
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach((tile) => {
      tile.innerHTML = "";
    });
    const randomTileIndex = Math.floor(Math.random() * tiles.length);
    const randomTile = tiles[randomTileIndex];
    if (Math.random() > 0.5) {
      const trash = document.createElement("img");
      trash.src =
        trashTypes[level - 1][
          Math.floor(Math.random() * trashTypes[level - 1].length)
        ];
      trash.className = "trash";
      trash.addEventListener("click", hitTrash);
      randomTile.appendChild(trash);
    } else {
      const good = document.createElement("img");
      good.src = goodTypes[Math.floor(Math.random() * goodTypes.length)];
      good.className = "good";
      good.addEventListener("click", missTrash);
      randomTile.appendChild(good);
    }
  }, 1000 - level * 100);
}

function hitTrash() {
  score += 10;
  updateScore();
  checkLevelUp();
}

function missTrash() {
  score -= 5;
  updateScore();
  if (score < 0) {
    endGame(false);
  }
}

function updateScore() {
  scoreDisplay.textContent = `Score: ${score}`;
}

function checkLevelUp() {
  if (score >= level * 100) {
    level++;
    if (level > 3) {
      endGame(true);
    } else {
      document.getElementById("game-screen").classList.add("hidden");
      document.getElementById("level-intro-screen").classList.remove("hidden");
      updateLevelDialogue();
      clearInterval(gameInterval);
    }
  }
}

function endGame(win) {
  clearInterval(gameInterval);
  document.getElementById("game-screen").classList.add("hidden");
  document.getElementById("end-screen").classList.remove("hidden");
  const playerName = document.getElementById("player-name").value || "Player";
  if (win) {
    endMessage.textContent = `Congratulations ${playerName}! You helped Kirby clean up the world!`;
  } else {
    endMessage.textContent = `Sorry ${playerName}, you lost. Try again!`;
  }
}
