// STEP 2: 화면 이동과 집게 조작을 연결합니다.
const homeScreen = document.getElementById('home-screen');
const gameScreen = document.getElementById('game-screen');
const startButton = document.getElementById('start-button');
const homeButton = document.getElementById('home-button');
const machineWindow = document.querySelector('.machine-window');
const claw = document.querySelector('.game-claw');
const dropButton = document.querySelector('.drop-button');
const status = document.querySelector('.game-status');
const restartButton = document.getElementById('restart-game');
const prizePile = document.querySelector('.prize-pile');
const clawHead = document.querySelector('.claw-head');
const pointDisplays = [...document.querySelectorAll('.points')];
const originalPrizes = [...prizePile.children].map((prize) => prize.cloneNode(true));
const INITIAL_POINTS = 1000;
const directionButtons = [...document.querySelectorAll('[data-direction]')];

const MOVE_STEP = 18;
const REPEAT_MS = 75;
let clawX = 0.5;
let clawY = 0;
let moveTimer;
let dropInProgress = false;
let gameOver = false;
let points = INITIAL_POINTS;

function updatePoints() {
  pointDisplays.forEach((display) => {
    display.textContent = points.toLocaleString('ko-KR');
  });
}

function showHome() {
  stopMoving();
  homeScreen.hidden = false;
  gameScreen.hidden = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showGame() {
  homeScreen.hidden = true;
  gameScreen.hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderClaw() {
  const bounds = machineWindow.getBoundingClientRect();
  const clawWidth = claw.getBoundingClientRect().width;
  const xInset = (clawWidth / 2 + 4) / bounds.width;
  clawX = Math.max(xInset, Math.min(1 - xInset, clawX));
  const maxY = Math.max(0, bounds.height - claw.offsetHeight - 14);
  clawY = Math.max(0, Math.min(maxY, clawY));
  claw.style.setProperty('--claw-x', `${clawX * 100}%`);
  claw.style.setProperty('--claw-y', `${clawY}px`);
}

function move(direction) {
  if (dropInProgress || gameOver || gameScreen.hidden) return;
  const bounds = machineWindow.getBoundingClientRect();
  if (direction === 'left') clawX -= MOVE_STEP / bounds.width;
  if (direction === 'right') clawX += MOVE_STEP / bounds.width;
  if (direction === 'up') clawY -= MOVE_STEP;
  if (direction === 'down') clawY += MOVE_STEP;
  renderClaw();
}

function stopMoving() {
  window.clearInterval(moveTimer);
  moveTimer = undefined;
}

function startMoving(direction) {
  stopMoving();
  move(direction);
  moveTimer = window.setInterval(() => move(direction), REPEAT_MS);
}

function dropClaw() {
  if (dropInProgress || gameOver || gameScreen.hidden) return;
  dropInProgress = true;
  stopMoving();
  const windowBounds = machineWindow.getBoundingClientRect();
  const headBounds = clawHead.getBoundingClientRect();
  const maxCableLength = Math.max(0, windowBounds.bottom - headBounds.bottom - 8);
  claw.style.setProperty('--drop-length', `${maxCableLength}px`);
  const clawCenterX = headBounds.left + headBounds.width / 2;
  const prize = [...prizePile.querySelectorAll('span')]
    .map((item) => ({ item, bounds: item.getBoundingClientRect() }))
    .filter(({ bounds }) => bounds.width > 0)
    .sort((a, b) => Math.abs((a.bounds.left + a.bounds.width / 2) - clawCenterX)
      - Math.abs((b.bounds.left + b.bounds.width / 2) - clawCenterX))[0];
  const catchRange = Math.max(28, headBounds.width * 0.58);
  const horizontalOffset = prize
    ? Math.abs((prize.bounds.left + prize.bounds.width / 2) - clawCenterX)
    : Infinity;
  const aligned = prize && horizontalOffset <= catchRange;
  // Centered aim has a 40% chance; the edge of the catch range has a 10% chance.
  const catchChance = aligned ? 0.4 - 0.3 * (horizontalOffset / catchRange) : 0;
  const caught = aligned && Math.random() < catchChance ? prize.item : null;
  status.classList.remove('is-success', 'is-miss');
  claw.classList.add('dropping');
  dropButton.disabled = true;
  status.textContent = '집게가 인형을 향해 내려갑니다…';
  window.setTimeout(() => {
    if (caught && caught.isConnected) {
      const toy = caught.textContent;
      caught.remove();
      clawHead.textContent = toy;
      status.textContent = `획득 성공! ${toy} 인형을 뽑았어요!`;
      status.classList.add('is-success');
    } else {
      points = Math.max(0, points - 10);
      updatePoints();
      status.textContent = points > 0
        ? '아쉽네요! 인형을 잡지 못했어요. 10 PT 차감됐습니다.'
        : '포인트를 모두 사용했어요. 다시하기를 눌러 처음부터 시작하세요.';
      status.classList.add('is-miss');
      if (points === 0) {
        gameOver = true;
        restartButton.hidden = false;
      }
    }
    window.setTimeout(() => {
    claw.classList.remove('dropping');
    clawHead.textContent = '♧';
    dropButton.disabled = false;
    dropInProgress = false;
    renderClaw();
    }, 500);
  }, 500);
}

startButton.addEventListener('click', showGame);
homeButton.addEventListener('click', showHome);
dropButton.addEventListener('click', dropClaw);
restartButton.addEventListener('click', () => {
  points = INITIAL_POINTS;
  gameOver = false;
  dropInProgress = false;
  clawX = 0.5;
  clawY = 0;
  prizePile.replaceChildren(...originalPrizes.map((prize) => prize.cloneNode(true)));
  claw.classList.remove('dropping');
  clawHead.textContent = '♧';
  restartButton.hidden = true;
  status.classList.remove('is-success', 'is-miss');
  status.textContent = '방향키로 집게를 조작하세요.';
  updatePoints();
  renderClaw();
});

directionButtons.forEach((button) => {
  const direction = button.dataset.direction;
  button.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    startMoving(direction);
  });
  button.addEventListener('pointerup', stopMoving);
  button.addEventListener('pointercancel', stopMoving);
  button.addEventListener('lostpointercapture', stopMoving);
});

document.addEventListener('keydown', (event) => {
  if (gameScreen.hidden || event.repeat) return;
  const directions = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
  if (directions[event.key]) {
    event.preventDefault();
    startMoving(directions[event.key]);
  } else if (event.code === 'Space') {
    event.preventDefault();
    dropClaw();
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key.startsWith('Arrow')) stopMoving();
});
window.addEventListener('blur', stopMoving);
window.addEventListener('resize', renderClaw);

console.info('PIXEL CLAW ARCADE · STEP 2 ready');
