SCORE = 0;
LIVES = 3;

$(function(){
    /*=========== Global Variables ===========*/
    WIDTH = 600; //window.innerWidth;
    HEIGHT = 800; //window.innerHeight;

    /*============ Game Graphics ============*/
    function graphics(){
        this.enemy = [];
        for (i=0; i<15; i++){
            this.enemy[i] = new Image();
            this.enemy[i].src = "img/svg/enemy" + i + ".svg";
        }

        this.color = ['#43978d', '#03bfd7', '#8dc63f', '#fdb913', '#ba9765', '#82ca9c', '#92278f', '#ed1c24', '#39b54a', '#fd0', '#0072bc', '#ec008c', '#f26522', '#bf245e', '#522e91'];

        this.player = new Image();
        this.player.src = "img/svg/player.svg";

        this.bullet = new Image();
        this.bullet.src = "img/svg/bullet.svg";
    }

    /*=========== Canvas Context ============*/
    function context(){
        var CANVAS = document.getElementById('game');
        CANVAS.width = WIDTH;
        CANVAS.height = HEIGHT;
        return CANVAS.getContext("2d");
    }

    /*============= INPUT ================ */
    
    function Input(){
        this.left = false;
        this.right = false;
        this.shoot = false;
    }

    var input = new Input();

    $(this).keydown(function(event){
        if (event.keyCode == 37) input.left = true;
        if (event.keyCode == 39) input.right = true;
        if (event.keyCode == 32) input.shoot = true;
    });

    $(this).keyup(function(event){
        if (event.keyCode == 37) input.left = false;
        if (event.keyCode == 39) input.right = false;
        if (event.keyCode == 32) input.shoot = false;
    });

    /*============= Explosions ==============*/
    particleArray = [];

    function Particle(x,y,s,vx,vy){
        damping = 0.99;
        gravity = 0.01;

        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;

        this.size = s;
        this.color = "rgb("+ rint(255) + "," + rint(170) + "," + rint(150) +")";

        particleArray[particleArray.length] = this;

        this.update = function() {
            this.vx *= damping;
            this.vy *= damping;
            this.vy += gravity * size;

            this.x += this.vx;
            this.y += this.vy;

            if (this.y > HEIGHT) particleArray.splice(particleArray.indexOf(this), 1);
        }

        this.draw = function() {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x-this.size/2, this.y-this.size/2, this.size, this.size);
        }
    }

    function explosion(x,y){
        n = 100;
        for (i=0; i<n; i++){
            s = Math.random() * 4 + 1;
            a = Math.random() * 2;
            d = Math.random() * 2 * Math.PI;
            new Particle(x,y,s, a * Math.cos(d), a * Math.sin(d) - 2);
        }
    }

    function playerExplosion(x,y){
        n = 1000;
        for (i=0; i<n; i++){
            s = Math.random() * 10 + 5;
            a = Math.random() * 5;
            d = Math.random() * 2 * Math.PI;
            new Particle(x,y,s, a * Math.cos(d), a * Math.sin(d) - a);
        }
    }

    /*============= Game Objects ============*/
    bulletArray = [];
    enemyBulletArray = [];

    function Bullet(x, y) {
        this.x = x;
        this.y = y;
        this.size = 5;
        this.speed = 10;
        this.img = img.bullet;

        bulletArray[bulletArray.length] = this;

        this.destroy = function() {
            bulletArray.splice(bulletArray.indexOf(this), 1);
        }

        this.move = function() {
            this.y -= this.speed;

            if (this.y < 0) this.destroy();
        }

        this.draw = function() {
            ctx.drawImage(this.img, this.x-this.size/2, this.y-this.size/2, this.size, this.size);
        }
    }

    function EnemyBullet(x, y) {
        this.x = x;
        this.y = y;
        this.size = 5;
        this.speed = 8;
        this.img = img.bullet;

        enemyBulletArray[enemyBulletArray.length] = this;

        this.destroy = function() {
            enemyBulletArray.splice(enemyBulletArray.indexOf(this), 1);
        }

        this.move = function() {
            this.y += this.speed;

            if (this.y > HEIGHT) this.destroy();
        }

        this.draw = function() {
            ctx.drawImage(this.img, this.x-this.size/2, this.y-this.size/2, this.size, this.size);
        }
    }

    function Player(){
        this.x = WIDTH / 2;
        this.y = HEIGHT - 50;
        this.speed = 5;
        this.size = 50;
        this.img = img.player

        this.move_left = function() { if (this.x - this.speed - this.size/2 > 0) this.x -= this.speed; }
        this.move_right = function() { if (this.x + this.speed + this.size/2 < WIDTH) this.x += this.speed; }

        this.shoot = function() {
            input.shoot = false;
            new Bullet(this.x, this.y-this.size/2);
            SCORE--;
        }

        this.intersect = function(x,y) {
            return (x > this.x - this.size/2 && y > this.y - this.size/2 && x < this.x + this.size/2 && y > this.y + this.size / 2);
        }

        this.draw = function(){
            ctx.drawImage(this.img, this.x-this.size/2, this.y-this.size/2, this.size, this.size*0.6);
        }
    }

    function Enemy(i, x, y, s, c){
        this.x = x;
        this.y = y;
        this.speed = s;
        this.size = 30;
        this.img = img.enemy[i];
        this.dead = false;
        this.chance = c;

        this.move_left = function() { this.x -= this.speed; }
        this.move_right = function() { this.x += this.speed; }
        this.move_up = function() { this.y -= this.speed; }
        this.move_down = function() { this.y += this.speed; }

        this.shoot = function(){
            if (!this.dead && Math.random() < this.chance){
                new EnemyBullet(this.x, this.y);
            }
        }

        this.intersect = function(x,y){
            if (this.dead) return false;
            if (x > this.x - this.size/2 && y > this.y - this.size/2 && x < this.x+this.size/2 && y < this.y+this.size/2) return true;
        }

        this.kill = function() {
            SCORE += 100;
            this.dead = true;
            explosion(this.x, this.y);
        }

        this.draw = function(){
            if (!this.dead) ctx.drawImage(this.img, this.x-this.size/2, this.y-this.size/2, this.size, this.size);
        }
    }

    function EnemyArray(i, x, y, h, v, n, m, s, c) {
        this.enemy = [];
        this.x = x;
        this.y = y;
        this.h = h;
        this.v = v;
        this.alive = n * m;
        this.chance = c;
        

        // Movement
        this.speed = s;
        this.lastDirection = 'right';
        this.direction = 'right';
        this.down_distance = v/m;
        this.down = 0;
        this.margin = h/n;
        
        index = 0;
        for (ni=0; ni<n; ni++){
            for (mi=0; mi<m; mi++){
                this.enemy[index] = new Enemy(i, x + h/(n-1) * ni, y + v/(m-1) * mi, this.speed, this.chance);
                index++;
            }
        }

        this.dead = function() {
            return this.alive <= 0;
        }

        this.collide = function(bullet) {
            for (enemy of this.enemy) {
                if (enemy.intersect(bullet.x, bullet.y)){
                    enemy.kill();
                    bullet.destroy();
                    this.alive--;
                }
            }
        }

        this.shoot = function(){
            for (enemy of this.enemy) enemy.shoot();
        }

        this.move = function() {
            /* Logic */
            if (this.direction == 'right' && (this.x + this.h) > (WIDTH - this.margin)){
                this.lastDirection = 'right';
                this.direction = 'down';
            }

            if (this.direction == 'left' && this.x < this.margin){
                this.lastDirection = 'left';
                this.direction = 'down';
            }

            if (this.direction == 'down'){
                if (this.down > this.down_distance){
                    if (this.lastDirection == 'right') this.direction = 'left';
                    if (this.lastDirection == 'left') this.direction = 'right';
                    this.lastDirection = 'down';
                    this.down = 0;
                }
                this.y += this.speed;
                this.down += this.speed;
            }

            /* Movement */
            if (this.direction == 'left'){
                this.x -= this.speed;
                for (enemy of this.enemy) enemy.move_left();
            }
            if (this.direction == 'right'){
                this.x += this.speed;
                for (enemy of this.enemy) enemy.move_right();
            }
            if (this.direction == 'up'){
                this.y -= this.speed;
                for (enemy of this.enemy) enemy.move_up();
            }
            if (this.direction == 'down'){
                this.y += this.speed;
                for (enemy of this.enemy) enemy.move_down();
                }
        }

        this.draw = function(){
            for (enemy of this.enemy){ enemy.draw();}
        }
    }

    /*============= Functions ============*/
    function rint(n){
        return Math.floor(Math.random()*n)
    }

    function random_enemy_array(){
        x = rint(6) + 2; h = (rint(25) + 25) * x;
        y = rint(4) + 2; v = (rint(25) + 25) * y;
        s = Math.random()*3 + 0.5;
        c = Math.random()/100;
        return new EnemyArray(rint(15), 50, 50, h, v, x, y, s, c);
    }

    function draw_lives(){
        size = 25;
        margin = 10;
        for (i=0; i<LIVES; i++){
            ctx.drawImage(img.player, margin + (size+margin)*i, margin, size, size*0.8);
        }
    }

    function draw_score(){
        ctx.fillStyle = "#888888"
        ctx.font = "200px Courier";
        ctx.textAlign = "center";
        ctx.fillText(SCORE, WIDTH/2, HEIGHT/2);
    }

    function draw_game_over(){
        ctx.fillStyle = "#fff"
        ctx.font = "100px Courier";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", WIDTH/2, HEIGHT/2-150);
        ctx.font = "200px Courier";
        ctx.textAlign = "center";
        ctx.fillText(SCORE, WIDTH/2, HEIGHT/2);
    }


    /*================ Game ================*/
    var ctx = context();        // Canvas 2D Context
    var img = new graphics();   // Vector Graphics

    var player, enemy_array;

    function start(){
        bulletArray = [];
        enemyBulletArray = [];

        player = new Player();
        enemy_array = random_enemy_array();
        SCORE = 0;
        LIVES = 3;
    }

    function update(){
        if (input.left) player.move_left();
        if (input.right) player.move_right();
        if (input.shoot) player.shoot();

        for (bullet of bulletArray){
            bullet.move();
            enemy_array.collide(bullet);
        }

        enemy_array.shoot();

        for (bullet of enemyBulletArray){
            bullet.move();
            if (player.intersect(bullet.x, bullet.y)){
                bullet.destroy();
                LIVES--;
                playerExplosion(player.x,player.y);
            }
        }

        

        if (enemy_array.dead()) enemy_array = random_enemy_array();

        enemy_array.move();
    }

    function draw(){
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        draw_lives();
        draw_score();

        for (bullet of bulletArray) bullet.draw();
        for (bullet of enemyBulletArray) bullet.draw();
        
        enemy_array.draw();
        player.draw();

        

        if (LIVES == 0) {
            draw_game_over();
            addScore(SCORE);
        }
    }


    /*================ Start Program ===============*/
    function loop() {
        if (LIVES > 0) {
            update();
            draw();
        }
        for (particle of particleArray) particle.update();
        for (particle of particleArray) particle.draw();
        requestAnimationFrame(loop);
    }

    function init(){ 
        start();
        loop();
    }

    img.player.onload = init();

    /*================ Write scores to DB ===============*/
    function addScore(score) {
        $.post('game.php?addHighscore=new', {score: score})
            .done(function (data) {
            });
    }
});