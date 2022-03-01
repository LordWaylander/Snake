var zoneJeu,
    ctx,
    snake = new Object(),
    pomme = new Object(),
    vies = new Object(),
    largeur = hauteur = 10,
    depX = depY = 0, // saut mvt snake axe X et Y
    historiqueTouche, // historique pour déplacement
    interval = 150, // interval de répétition pour setTinterval
    score = 0,
    intervalID = null,
    collision = false;
    
    pomme.pommeRadius = 5,
    snake.snakeContent = [], // contient les éléements du snake
    snake.tailleSnake = 5, // taille snake départ
    snake.tailleMaxSnake = 100; // taille max snake
    snake.vies = 2;
    vies.compteur = 0;
    vies.affichageVie = false;

document.addEventListener('DOMContentLoaded', () => {
    
    zoneJeu = document.getElementById('zoneJeu');
    document.addEventListener("keydown", move);
    ctx = zoneJeu.getContext('2d');

    // position du serpent centrée au départ
    snake.y = Math.trunc(zoneJeu.height/2);
    snake.x = Math.trunc(zoneJeu.width/2);
    pomme.x = Math.trunc(Math.random()*zoneJeu.width/largeur)*largeur;
    pomme.y = Math.trunc(Math.random()*zoneJeu.height/hauteur)*hauteur;

    //game();
    intervalID = setInterval(game, interval);
});

function game() {
    ctx.clearRect(0, 0, zoneJeu.width, zoneJeu.height);

    // se déplace de depX (cf function move)*largeur (10) -> 10 px et non 1px
    snake.x+=depX*largeur; 
    snake.y+=depY*hauteur;

    snake.snakeContent.push({x:snake.x, y:snake.y});
    while(snake.snakeContent.length>snake.tailleSnake){
        snake.snakeContent.shift();
    }
   
    ctx.fillStyle = 'rgb(0, 255, 255)'; 
    for(var i=0;i<snake.snakeContent.length;i++) {
        if(i==snake.snakeContent.length-1){
            ctx.fillStyle="#9b59b6";
        }
        ctx.fillRect(snake.snakeContent[i].x,snake.snakeContent[i].y, largeur-3, hauteur-3);
    }

    // Affichage pomme
    ctx.beginPath();
    ctx.font = '16px Arial';
    ctx.fillStyle = '#2ecc71';
    ctx.fillText('√', pomme.x, pomme.y+3);
    ctx.arc(pomme.x+pomme.pommeRadius, pomme.y+pomme.pommeRadius, pomme.pommeRadius, 0, Math.PI * 2);
    ctx.fillStyle="#e74c3c";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(pomme.x+pomme.pommeRadius+1,pomme.y+pomme.pommeRadius,pomme.pommeRadius/2, 0, Math.PI * 2);
    ctx.fillStyle="#ed7365";
    ctx.fill();
    ctx.closePath();

    ctx.font = '16px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText('Score: ' + score, 5, 20);
    ctx.font = '16px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText('Vies: ' + snake.vies, zoneJeu.width - 60, 20);

    manger();
    collison();
    life();
    
}

function manger(){
// le serpent mange
if(snake.x==pomme.x && snake.y==pomme.y){
    document.getElementById('manger').play();
    score+=2*(snake.tailleSnake-3);
    // augmentation taille serpent si <= a taille max allouée
    if(snake.tailleSnake <= snake.tailleMaxSnake){
        snake.tailleSnake++;
    }
    if (score >= 100) {
        document.getElementById('lifeTaken').play();
        snake.vies++;
        score=0;
    }
    interval-=5;
    clearTimeout(intervalID);
    intervalID = setInterval(game, interval);

    pomme.x=Math.trunc(Math.random()*zoneJeu.width/largeur)*largeur;
    pomme.y=Math.trunc(Math.random()*zoneJeu.height/hauteur)*hauteur;
    
}
}

function collison() {
    if(snake.snakeContent.length>5){
        for(var i=0;i<snake.snakeContent.length-1;i++) {
        // la position lenngth - 1 est celle de la tête elle n'a pas besoin d'être inclut dans le test avec elle même!
            if(snake.snakeContent[i].x==snake.snakeContent[snake.snakeContent.length-1].x && snake.snakeContent[i].y==snake.snakeContent[snake.snakeContent.length-1].y){
                collision = true;
            }
        }
    }
    // colision décord ou snake
    if(snake.x<0 || snake.x>zoneJeu.width || snake.y<0 || snake.y > zoneJeu.height || collision == true){ 
        document.getElementById('lifePerdue').play();
        snake.vies--;
        collision=false;
        interval = 150;
        while(snake.snakeContent.length>snake.tailleSnake){
            snake.snakeContent.shift();
        }
    
        snake.y = Math.trunc(zoneJeu.height/2);
        snake.x = Math.trunc(zoneJeu.width/2);
        pomme.x = Math.trunc(Math.random()*zoneJeu.width/largeur)*largeur;
        pomme.y = Math.trunc(Math.random()*zoneJeu.height/hauteur)*hauteur;

        if(snake.vies == 0){
            document.getElementById('gameOver').play();
            // Affichage la fin de la partie
            ctx.font = '40px Arial';
            ctx.fillStyle = '#fff';
            ctx.fillText('GAME OVER', zoneJeu.width / 2 - 130, zoneJeu.height / 2);
            clearTimeout(intervalID);
        }
    }
}

function life() {
    // vies
    if(vies.compteur++ >= 115){
        vies.compteur = 0;
        if(Math.random()*100 >= 75){ //1 chance sur 4
            vies.x=Math.trunc(Math.random()*zoneJeu.width/largeur)*largeur;
            vies.y=Math.trunc(Math.random()*zoneJeu.height/hauteur)*hauteur;
            vies.affichageVie = true;
       } 
    }

    if(vies.affichageVie == true){ 
        ctx.font = '20px Arial';
        ctx.fillStyle = '#fff';
        ctx.fillRect(vies.x, vies.y, largeur, hauteur);
        ctx.fillText('❤', vies.x-3, vies.y+16);
    }

    if(snake.x==vies.x && snake.y==vies.y){
        document.getElementById('lifeTaken').play();
        snake.vies++;
        vies.x = -9999;
        vies.y = -9999;
        vies.affichageVie = false;
    }
}

function move(key) {
    switch (key.keyCode) {
        case 37:
            //gauche
            if(historiqueTouche==39){break;}
            depX=-1;
            depY=0;
            historiqueTouche=key.keyCode;
            break;
        case 38:
            //haut
            if(historiqueTouche==40){break;}
            depX=0;
            depY=-1;
            historiqueTouche=key.keyCode;
            break;
        case 39:
            //droite
            if(historiqueTouche==37){break;}
            depX=1;
            depY=0;
            historiqueTouche=key.keyCode;
            break;
        case 40:
            //bas
            if(historiqueTouche==38){break;}
            depX=0;
            depY=1;
            historiqueTouche=key.keyCode;
            break;
        case 32:
            //espace -> pause
           if(historiqueTouche==32 && snake.vies > 0){
                intervalID = setInterval(game, interval);
            }else{
                clearTimeout(intervalID);
                ctx.font = '40px Arial';
                ctx.fillStyle = '#fff';
                ctx.fillText('JEU EN PAUSE', zoneJeu.width / 2 - 130, zoneJeu.height / 2);
                historiqueTouche=key.keyCode;
            }
            break;
    }
}