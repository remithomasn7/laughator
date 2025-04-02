document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        window.location.href = '/game';
    }
});

document.getElementById('start-button').addEventListener('click', function() {
    window.location.href = '/game';
});
