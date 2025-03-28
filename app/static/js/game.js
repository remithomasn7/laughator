const message = document.getElementById('message');
const progressBar = document.querySelector('#progress-bar div');

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

            if (percentage >= 10) {
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
        window.location.href = '/lose';
    }
}

startGame();
