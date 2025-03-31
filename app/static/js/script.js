const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const winScreen = document.getElementById('win-screen');
const loseScreen = document.getElementById('loose-screen');
const message = document.getElementById('message');
const progressBar = document.querySelector('#progress-bar div');
const audio = new Audio('/static/sounds/laugh_song.mp3'); // Chemin vers le fichier audio

let gameInterval;
let gameTimeout;
let isPlaying = false;

document.addEventListener('keydown', (event) => {
    console.log('Key pressed:', event.code);
    console.log('Start screen display style:', startScreen.style.display); // Log pour vérifier le style d'affichage
    if (event.code === 'Space' && startScreen.style.display === 'block') {
        console.log('Starting game...');
        startGame();
    }
});


function startGame() {
    startScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    progressBar.style.width = '0%';
    message.textContent = 'Vous devez rire';

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        let startTime = Date.now();

        function update() {
            if (Date.now() - startTime > 30000) {
                endGame(false);
                return;
            }

            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / bufferLength;
            const percentage = (average / 255) * 100;

            progressBar.style.width = `${percentage}%`;

            if (percentage >= 20) {
                endGame(true);
            } else {
                gameInterval = requestAnimationFrame(update);
            }
        }

        gameInterval = requestAnimationFrame(update);
        gameTimeout = setTimeout(() => endGame(false), 30000);
    });
}

function endGame(isWin) {
    cancelAnimationFrame(gameInterval);
    clearTimeout(gameTimeout);
    gameScreen.style.display = 'none';

    if (isWin) {
        winScreen.style.display = 'block';
        audio.play().then(() => {
            audio.onended = () => {
                resetGame();
            };
        });
    } else {
        looseScreen.style.display = 'block';
        setTimeout(resetGame, 5000);
    }
}

function resetGame() {
    winScreen.style.display = 'none';
    looseScreen.style.display = 'none';
    startScreen.style.display = 'block';
    isPlaying = false;
}
