import EnemyController from "./EnemyController.js";
import Player from "./Player.js";
import BulletController from "./BulletController.js";
import BossController from "./BossController.js";
import PowerUpController from "./PowerUpController.js";
import SoundManager from "./sound.js";
import { initMobileControls } from "./mobileControls.js";

// SOUND MANAGER 
const sound = new SoundManager();

// BUTTON REFERENCES 
const startBtn = document.getElementById("start-btn");
const mainMenuBtn = document.getElementById("main-menu-btn");
const nextRoundBtn = document.getElementById("next-round-btn");
const gameScreen = document.querySelector(".game-screen");
const leaderboardBtn = document.getElementById("leaderboard-btn");

// CANVAS SETUP 
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 800;

// BACKGROUND 
const background = new Image();
background.src = "images/space.png";

// GAME STATE VARS 
let playerBulletController;
let enemyBulletController;
let enemyCtrl;
let bossCtrl;
let player;

let isBossRound = false;
let isGameOver = false;
let didWIn = false;
let gameRunning = false;
let gameLoop;

window.currentLevel = 1;
window.score = 0;
window.flashStat = flashStat;
window.flashStatr = flashStatr;

let enemyFireRate = 80;
let enemyRows = 4;

const startScreen = document.querySelector(".start-screen");
const menuItems = Array.from(startScreen.querySelectorAll("#player-name, .menu button"));

const playerRef = { current: null };
const currentMenuIndexRef = { value: 0 };

initMobileControls(playerRef, startScreen, menuItems, currentMenuIndexRef, updateMenuFocus);

// PLAYER NAME SETUP 
const playerInput = document.getElementById("player-name");

function generateRandomName() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const suffix = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `Player-${suffix}`;
}
playerInput.value = generateRandomName();

playerInput.addEventListener("input", () => {
  localStorage.setItem("playerName", playerInput.value);
});

// SCOREBOARD 
function updateScoreboard() {
  const scoreDisplay = document.getElementById("score");
  const levelDisplay = document.getElementById("level");
  const livesDisplay = document.getElementById("lives");
  const boostDisplay = document.getElementById("boost");

  if (scoreDisplay) scoreDisplay.textContent = window.score;
  if (levelDisplay) levelDisplay.textContent = window.currentLevel;
  if (livesDisplay) livesDisplay.textContent = player?.lives ?? 3;
  if (boostDisplay) boostDisplay.textContent = player?.boostCount ?? 0;
}

// GAME RESET FUNCTION 
function resetGame(resetLevel = false) {
  if (gameLoop) {
    clearInterval(gameLoop);
    gameLoop = null;
  }

  if (resetLevel) {
    window.currentLevel = 1;
    window.score = 0;
    enemyFireRate = 20;
    enemyRows = 4;
  }

  isGameOver = false;
  didWIn = false;
  gameRunning = false;

  playerBulletController = new BulletController(canvas, 50, true, "images/bullet.png");
  enemyBulletController = new BulletController(canvas, 100, false, "images/enemybullet.png");

  isBossRound = window.currentLevel % 3 === 0;
  if (isBossRound) {
    bossCtrl = new BossController(canvas, enemyBulletController, playerBulletController);
    enemyCtrl = null;
  } else {
    enemyCtrl = new EnemyController(canvas, enemyBulletController, playerBulletController, enemyFireRate, enemyRows);
    bossCtrl = null;
  }

  player = new Player(canvas, 5, playerBulletController);
  playerRef.current = player; 
  player.boostCount = 1;
  window.powerUpCtrl = new PowerUpController(canvas, player);
}

// GAME LOOP 
function startGameLoop() {
  if (gameRunning) return;
  gameRunning = true;
  gameLoop = setInterval(game, 1000 / 60);
}

function game() {
  updatePlayerMovement();
  checkGameOver();
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  displayGameOver();

  if (!isGameOver) {
    if (isBossRound) {
      bossCtrl?.draw(ctx);
    } else {
      enemyCtrl?.draw(ctx);
    }

    player.draw(ctx);
    playerBulletController.draw(ctx);
    enemyBulletController.draw(ctx);
    powerUpCtrl.draw(ctx);
    updateScoreboard();
  }
}

// GAME OVER DISPLAY 
function displayGameOver() {
  if (!isGameOver) return;

  clearInterval(gameLoop);
  gameRunning = false;

  const gameWrapper = document.querySelector(".game-wrapper");
  const resultScreen = document.getElementById("result-screen");
  const resultMsg = document.getElementById("result-message");
  const nextRoundBtn = document.getElementById("next-round-btn");
  const mainMenuBtn = document.getElementById("main-menu-btn");

  gameWrapper.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  sound.fadeOut(sound.combatMusic);
  sound.playMainMenuMusic();

  if (didWIn) {
    resultMsg.innerHTML = `LEVEL ${window.currentLevel} COMPLETE!<br>Score: ${window.score}`;
    nextRoundBtn.classList.remove("hidden");
    mainMenuBtn.classList.add("hidden");
    nextRoundBtn.focus(); 
  } else {
    const playerName = playerInput.value;
    updateLeaderboard(playerName, window.score);
    resultMsg.innerHTML = `GAME OVER!<br>Final Score: ${window.score}<br>Reached Level: ${window.currentLevel}`;
    nextRoundBtn.classList.add("hidden");
    mainMenuBtn.classList.remove("hidden");
    mainMenuBtn.focus(); 
  }

  let resultHandled = false;

  function handleResultKey(e) {
    if (resultHandled) return;
    if (e.code === "Enter" || e.code === "Space") {
      e.preventDefault();
      resultHandled = true; 
      if (didWIn) nextRoundBtn.click();
      else mainMenuBtn.click();
      document.removeEventListener("keydown", handleResultKey);
    }
  }

  document.addEventListener("keydown", handleResultKey);
}

// GAME OVER CHECK 
function checkGameOver() {
  if (isGameOver) return;

  if (enemyBulletController.collideWith(player)) player.takeDamage();

  if (player.lives <= 0) {
    isGameOver = true;
    return;
  }

  if (isBossRound) {
    if (bossCtrl?.collideWith(player)) {
      isGameOver = true;
      return;
    }
    if (bossCtrl?.isDefeated()) {
      didWIn = true;
      isGameOver = true;
      window.score += 1000;
      return;
    }
  } else {
    if (enemyCtrl?.collideWith(player)) {
      isGameOver = true;
      return;
    }
    if (enemyCtrl?.enemyRows.length === 0) {
      didWIn = true;
      isGameOver = true;
      return;
    }
  }
}

// START / MENU BUTTONS 
startBtn.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  document.querySelector(".game-wrapper").classList.remove("hidden");
  document.querySelector(".game-wrapper").classList.add("fade-in");

  showRoundStart(() => {
    sound.playCombatMusic();
    resetGame(true);
    startGameLoop();
  });
});

mainMenuBtn.addEventListener("click", () => {
  document.getElementById("result-screen").classList.add("hidden");
  startScreen.classList.remove("hidden");

  sound.playMainMenuMusic();
  resetGame(true);
  currentMenuIndex = 0;
  updateMenuFocus();
});

nextRoundBtn.addEventListener("click", () => {
  document.getElementById("result-screen").classList.add("hidden");
  document.querySelector(".game-wrapper").classList.remove("hidden");

  sound.fadeOut(sound.mainMenuMusic);

  window.currentLevel++;
  enemyFireRate = Math.max(5, 20 - (window.currentLevel - 1) * 5);
  enemyRows = Math.min(10, 4 + Math.floor((window.currentLevel - 1) / 2));

  showRoundStart(() => {
    sound.playCombatMusic();
    resetGame();
    startGameLoop();
  });
});

// ROUND START EFFECT 
function showRoundStart(callback) {
  const overlay = document.getElementById("round-start");
  const warningSound = new Audio("sounds/warning.mp3");
  warningSound.volume = 0.8;

  overlay.classList.remove("hidden");
  warningSound.play();

  setTimeout(() => {
    overlay.classList.add("hidden");
    callback();
  }, 2000);
}

// SCREEN TILT EFFECT 
let currentTilt = 0;
let targetTilt = 0;

function updateScreenTilt() {
  if (!player) return requestAnimationFrame(updateScreenTilt); 

  if (player.rightPressed) targetTilt = 4;       
  else if (player.leftPressed) targetTilt = -4;  
  else targetTilt = 0;                           

  currentTilt += (targetTilt - currentTilt) * 0.1;
  gameScreen.style.transform = `rotate(${currentTilt}deg)`;

  requestAnimationFrame(updateScreenTilt);
}
requestAnimationFrame(updateScreenTilt);

// MOUSE + KEYBOARD CONTROLS
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
let isMouseActive = false;

let keyLeftPressed = false;
let keyRightPressed = false;

// Mouse move
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
  mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
  isMouseActive = true;
});

// Mouse buttons
canvas.addEventListener("mousedown", (e) => {
  if (!player || isGameOver || !gameRunning) return;
  if (e.button === 0) player.shootPressed = true;
});
canvas.addEventListener("mouseup", (e) => {
  if (!player) return;
  if (e.button === 0) player.shootPressed = false;
});
canvas.addEventListener("contextmenu", (e) => {
  if (!player || isGameOver || !gameRunning) return;
  e.preventDefault();
  player.useBoost();
});

// Keyboard
document.addEventListener("keydown", (e) => {
  if (["ArrowLeft", "KeyA"].includes(e.code)) keyLeftPressed = true;
  if (["ArrowRight", "KeyD"].includes(e.code)) keyRightPressed = true;
});
document.addEventListener("keyup", (e) => {
  if (["ArrowLeft", "KeyA"].includes(e.code)) keyLeftPressed = false;
  if (["ArrowRight", "KeyD"].includes(e.code)) keyRightPressed = false;
});

// Combined update
function updatePlayerMovement() {
  if (!player || isGameOver || !gameRunning) return;

  let moveLeft = keyLeftPressed;
  let moveRight = keyRightPressed;

  if (isMouseActive) {
    const playerCenterX = player.x + player.width / 2;
    const tolerance = 3;
    if (mouseX > playerCenterX + tolerance) moveRight = true;
    else if (mouseX < playerCenterX - tolerance) moveLeft = true;
  }

  player.leftPressed = moveLeft;
  player.rightPressed = moveRight;
}

// MENU NAVIGATION 
let currentMenuIndex = 0;
function updateMenuFocus() {
  menuItems.forEach((el, i) => {
    if (i === currentMenuIndex) {
      el.focus();
      if (el.tagName === "BUTTON") el.classList.add("selected");
    } else if (el.tagName === "BUTTON") {
      el.classList.remove("selected");
    }
  });
}

updateMenuFocus();
document.addEventListener("keydown", (event) => {
  if (startScreen.classList.contains("hidden")) return;
  const activeEl = document.activeElement;
  if (activeEl.id === "player-name" && !["ArrowUp", "ArrowDown"].includes(event.code)) return;

  if (["ArrowDown", "ArrowRight"].includes(event.code)) {
    currentMenuIndex = (currentMenuIndex + 1) % menuItems.length;
    updateMenuFocus();
  } else if (["ArrowUp", "ArrowLeft"].includes(event.code)) {
    currentMenuIndex = (currentMenuIndex - 1 + menuItems.length) % menuItems.length;
    updateMenuFocus();
  } else if (["Enter", "Space"].includes(event.code)) {
    const currentEl = menuItems[currentMenuIndex];
    if (currentEl.tagName === "BUTTON") currentEl.click();
  }
});

// FLASH STATS 
function flashStat(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove("stat-flash");
  void el.offsetWidth;
  el.classList.add("stat-flash");
}
function flashStatr(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove("stat-flashr");
  void el.offsetWidth;
  el.classList.add("stat-flashr");
}

// LEADERBOARD SYSTEM 
function loadLeaderboard() {
  return JSON.parse(localStorage.getItem("leaderboard") || "[]");
}
function saveLeaderboard(leaderboard) {
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}
function updateLeaderboard(name, score) {
  let leaderboard = loadLeaderboard();
  const existing = leaderboard.find(p => p.name === name);
  if (existing) existing.score = Math.max(existing.score, score);
  else leaderboard.push({ name, score });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 5);
  saveLeaderboard(leaderboard);
}
function renderLeaderboard() {
  const list = document.getElementById("leaderboard-list");
  const leaderboard = loadLeaderboard();
  list.innerHTML = leaderboard.length
    ? leaderboard.map(p => `<li>${p.name} <span>${p.score}</span></li>`).join("")
    : "<li>No scores yet</li>";
}
document.getElementById("leaderboardModal").addEventListener("show.bs.modal", renderLeaderboard);

// SOUND INIT 
function initSound() {
  sound.playMainMenuMusic();
  window.removeEventListener("click", initSound);
  window.removeEventListener("keydown", initSoundOnKey);
}
function initSoundOnKey(e) {
  if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Enter","Space"].includes(e.code)) initSound();
}
window.addEventListener("click", initSound, { once: true });
window.addEventListener("keydown", initSoundOnKey);
