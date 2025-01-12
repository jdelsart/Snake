// Récupération des éléments HTML
const canvas = document.getElementById('gameCanvas');  // Zone de jeu
const ctx = canvas.getContext('2d');  // Contexte 2D pour dessiner
const startButton = document.getElementById('startButton');  // Bouton de démarrage
const scoreElement = document.getElementById('scoreValue');  // Élément score

// Configuration du jeu
const gridSize = 20;  // Taille d'une case
const tileCount = canvas.width / gridSize;  // Nombre de cases par ligne/colonne

// Variables du jeu
let snake = [];  // Tableau contenant les segments du serpent
let food = {};  // Position de la nourriture
let direction = 'right';  // Direction initiale
let score = 0;  // Score
let gameLoop = null;  // Boucle principale du jeu
let gameSpeed = 100;  // Vitesse du jeu en millisecondes

// Initialisation du jeu
function initGame() {
    snake = [{ x: 5, y: 5 }];  // Position initiale du serpent
    generateFood();  // Génère la première nourriture
    score = 0;  // Réinitialise le score
    scoreElement.textContent = score;
    direction = 'right';
    
    if (gameLoop) clearInterval(gameLoop);  // Arrête l'ancienne boucle
    gameLoop = setInterval(gameUpdate, gameSpeed);  // Démarre nouvelle boucle
}

// Génère une position aléatoire pour la nourriture
function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    // Vérifie que la nourriture n'apparaît pas sur le serpent
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();  // Régénère si sur le serpent
            break;
        }
    }
}

// Mise à jour du jeu
function gameUpdate() {
    moveSnake();  // Déplace le serpent
    if (checkCollision()) {  // Vérifie les collisions
        gameOver();
        return;
    }
    checkFood();  // Vérifie si nourriture mangée
    draw();  // Dessine tout
}

// Déplacement du serpent
function moveSnake() {
    const head = { x: snake[0].x, y: snake[0].y };  // Copie la tête
    
    // Déplace la tête selon la direction
    switch(direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    
    snake.unshift(head);  // Ajoute nouvelle tête
    if (!checkFood()) {
        snake.pop();  // Enlève queue si pas mangé
    }
}

// Vérifie les collisions
function checkCollision() {
    const head = snake[0];
    
    // Collision avec les murs
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }
    
    // Collision avec le serpent lui-même
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

// Vérifie si la nourriture est mangée
function checkFood() {
    const head = snake[0];
    if (head.x === food.x && head.y === food.y) {
        score += 10;  // Augmente le score
        scoreElement.textContent = score;
        generateFood();  // Nouvelle nourriture
        return true;
    }
    return false;
}

// Dessine le jeu
function draw() {
    // Efface le canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dessine le serpent
    ctx.fillStyle = '#4CAF50';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
    
    // Dessine la nourriture
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

// Affiche game over
function gameOver() {
    clearInterval(gameLoop);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';  // Fond semi-transparent
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width/2, canvas.height/2);
}

// Écoute les touches du clavier
document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';  // Empêche de faire demi-tour
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});

// Démarre le jeu quand on clique sur le bouton
startButton.addEventListener('click', initGame);