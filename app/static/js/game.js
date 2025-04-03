const message = document.getElementById('message');
const progressBar = document.querySelector('#progress-bar div');

const punchlines = [
    "C'est à en mourir de rire, n'est ce pas ?",
    "Rire, c'est contagieux.",
    "Riez... si vous l'osez.",
    "La folie a un son : le rire.",
    "Tu ne peux pas arrêter de rire, n'est-ce pas ?",
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
let laughTime = 0; // Accumulate laugh time in milliseconds
const laughThreshold = 5;
const laughDuration = 5000; // In milliseconds

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
        let lastTime = startTime;

        function update(currentTime) {
            if (Date.now() - startTime > 30000) {
                endGame(false);
                return;
            }

            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / bufferLength;
            const percentage = (average / 255) * 100;
            console.log(percentage);

            if (percentage >= laughThreshold) {
                const deltaTime = currentTime - lastTime; // Delta time in milliseconds
                laughTime += deltaTime; // Increment laugh time
                if (laughTime >= laughDuration) {
                    endGame(true);
                    return;
                }
            }

            progressBar.style.width = `${(laughTime / laughDuration) * 100}%`;

            lastTime = currentTime;
            gameInterval = requestAnimationFrame(update);
        }

        gameInterval = requestAnimationFrame(update);
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