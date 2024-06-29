document.getElementById("start-button").addEventListener("click", startGame);
document
  .getElementById("start-level-button")
  .addEventListener("click", startLevel);
document.getElementById("restart-button").addEventListener("click", startGame);
document.getElementById("main-menu-button").addEventListener("click", backToMainMenu);
document.getElementById("help-button").addEventListener("click", toggleHelp);


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
let previousScreen = null;

const trashTypes = [
  ["slike/kesa.png", "slike/flase.png", "slike/slamcice.png"], // Nivo 1
  ["slike/baterije.png", "slike/farbe.png", "slike/kiselina.png"], // Nivo 2
  ["slike/tv.png", "slike/racunar.png", "slike/telefon.png"], // Nivo 3
];
const goodTypes = ["slike/biljka.png", "slike/leptiri.png", "slike/ptica.png"];
const kirbyImage = "slike/kirby.png";

const intros = [
  "OBJASNJENJE CELE IGRE(moze i da se ovo skroz obrise)",
  "Kirbi je u gradu. Pomozite mu da sakupi hemijski otpad kao što su stare baterije, boje i kiseline.",
  "Kirbi je na deponiji. Pomozite mu da sakupi elektronski otpad kao što su pokvareni računari, stari telefoni i televizori.",
];

const levelExplanations = [
  "Pomozite Kirbiju da očisti plažu klikom na smeće! Izbegavajte cveće i leptire.",
  "Pomozite Kirbiju da sakupi hemijski otpad u gradu. Tražite stare baterije, boje i kiseline.",
  "Pomozite Kirbiju da sakupi elektronski otpad na deponiji. Tražite pokvarene računare, stare telefone i televizore.",
];

function backToMainMenu() {
  clearInterval(gameInterval);
  document.getElementById("game-screen").classList.add("hidden");
  document.getElementById("start-screen").classList.remove("hidden");
  score = 0;
  level = 1;
  updateScore();
}

function toggleHelp() {
  const helpButton = document.getElementById("help-button");
  const introScreen = document.getElementById("intro-screen");
  
  if (introScreen.classList.contains("hidden")) {
    previousScreen = document.querySelector('body > div:not(.hidden)');
    previousScreen.classList.add("hidden");
    introScreen.classList.remove("hidden");
    helpButton.textContent = "Close Help";
  } else {
    introScreen.classList.add("hidden");
    if (previousScreen) {
      previousScreen.classList.remove("hidden");
    }
    helpButton.textContent = "Help";
  }
}

// function showIntro() {
//   introIndex = 0;
//   document.getElementById("start-screen").classList.add("hidden");
//   document.getElementById("intro-screen").classList.remove("hidden");
//   updateKirbyDialogue();
// }

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
  document.getElementById("start-screen").classList.add("hidden");
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
  document.getElementById("game-screen").className = `level-${level}`;

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
      //document.getElementById("game-screen").className = `level-${level}`;
    }
  }
}

function endGame(win) {
  clearInterval(gameInterval);
  document.getElementById("game-screen").classList.add("hidden");
  document.getElementById("end-screen").classList.remove("hidden");
  const kirbyImage = document.getElementById("kirby-nova-image");
  const playerName = document.getElementById("player-name").value || "Player";
  if (win) {
    endMessage.textContent = `Čestitamo ${playerName}! Pomogli ste Kirbiju da očisti planetu!`;
    kirbyImage.src = "./slike/kirby.png";  
    kirbyImage.alt = "Happy Kirby";
  } else {
    endMessage.textContent = `Žao mi je ${playerName}, izgubili ste. Pokušajte ponovo!`;
    kirbyImage.src = "./slike/meta knight.png";  
    kirbyImage.alt = "Sad Kirby";
  }
}
