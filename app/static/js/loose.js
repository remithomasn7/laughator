/*
setTimeout(() => {
    window.location.href = '/';
}, 5000); // Attendre 5 secondes avant de revenir à l'écran de démarrage
*/
document.getElementById('start-button').addEventListener('click', function() {
    window.location.href = '/';
});