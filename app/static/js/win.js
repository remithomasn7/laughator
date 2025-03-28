const audio = new Audio('/static/sounds/laugh_song.mp3'); // Chemin vers le fichier audio

audio.play().then(() => {
    audio.onended = () => {
        window.location.href = '/'; // Redirige immédiatement vers la page d'accueil
    };
});
