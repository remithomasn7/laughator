const message = document.getElementById('message');
const progressBar = document.querySelector('#progress-bar div');

const punchlines = [
    "C'est à en mourir de rire, n'est ce pas ?",
    "Rire est la meilleure médecine !",
    "Rire, c'est contagieux.",
    "Riez... si vous l'osez.",
    "La folie a un son : le rire.",
    "Tu ne peux pas arrêter de rire, n'est-ce pas ?",
    "Pourquoi si sérieux ? La mort adore l'humour.",
    "Un éclat de rire avant l'éclat... final.",
    "Le rire est juste un cri déguisé.",
];

function getRandomPunchline() {
    const randomIndex = Math.floor(Math.random() * punchlines.length);
    return punchlines[randomIndex];
}

message.textContent = getRandomPunchline();

let gameInterval;
let gameTimeout;

function startGame() {
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

            if (percentage >= 70) {
                endGame(true);
            } else {
                gameInterval = requestAnimationFrame(update);
            }
        }

        gameInterval = requestAnimationFrame(update);
        gameTimeout = setTimeout(() => endGame(false), 30000);
    }).catch(err => {
        console.error('Error accessing the microphone:', err);
    });
}

function endGame(isWin) {
    cancelAnimationFrame(gameInterval);
    clearTimeout(gameTimeout);
    if (isWin) {
        window.location.href = '/win';
    } else {
        window.location.href = '/loose';
    }
}

function setRandomPosition() {
    const maxX = window.innerWidth - message.offsetWidth;
    const maxY = window.innerHeight - message.offsetHeight;
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    message.style.position = 'absolute';
    message.style.left = `${randomX}px`;
    message.style.top = `${randomY}px`;
}

function blinkMessage() {
    const visibleTime = Math.random() * 2000 + 2000;
    const hiddenTime = Math.random() * 1000;
    if (message.style.visibility === 'hidden') {
        setRandomPosition();
        message.style.visibility = 'visible';
        setTimeout(blinkMessage, visibleTime);
    } else {
        message.style.visibility = 'hidden';
        setTimeout(blinkMessage, hiddenTime);
    }
}

startGame();
blinkMessage();