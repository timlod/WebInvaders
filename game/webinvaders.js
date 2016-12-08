$(function(){
    /*=========== Global Variables ===========*/
    WIDTH = 600; //window.innerWidth;
    HEIGHT = 800; //window.innerHeight;

    /*============ Game Graphics ============*/
    function graphics(){
        this.enemy = [];
        for (i=0; i<15; i++){
            this.enemy[i] = new Image();
            this.enemy[i].src = "svg/enemy" + i + ".svg";
        }

        this.player = new Image();
        this.player.src = "svg/player.svg";
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
    }

    var input = new Input();

    $(this).keydown(function(event){
        if (event.keyCode == 37) input.left = true;
        if (event.keyCode == 39) input.right = true;
    });

    $(this).keyup(function(event){
        if (event.keyCode == 37) input.left = false;
        if (event.keyCode == 39) input.right = false;
    });

    /*============= Game Objects ============*/
    function Player(){
        this.x = WIDTH / 2;
        this.y = HEIGHT - 50;
        this.speed = 5;
        this.size = 50;
        this.img = img.player

        this.move_left = function() { this.x -= this.speed; }
        this.move_right = function() { this.x += this.speed; }

        this.draw = function(){
            ctx.drawImage(this.img, this.x-this.size/2, this.y-this.size/2, this.size, this.size);
        }
    }

    function Enemy(i, x, y, s){
        this.x = x;
        this.y = y;
        this.speed = s;
        this.size = 30;
        this.img = img.enemy[i];

        this.move_left = function() { this.x -= this.speed; }
        this.move_right = function() { this.x += this.speed; }
        this.move_up = function() { this.y -= this.speed; }
        this.move_down = function() { this.y += this.speed; }

        this.draw = function(){
            ctx.drawImage(this.img, this.x-this.size/2, this.y-this.size/2, this.size, this.size);
        }
    }

    function EnemyArray(i, x, y, h, v, n, m, s) {
        this.enemy = [];
        this.x = x;
        this.y = y;
        this.h = h;
        this.v = v;
        

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
                this.enemy[index] = new Enemy(i, x + h/(n-1) * ni, y + v/(m-1) * mi, this.speed);
                index++;
            }
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

    /*============= Functiions ============*/
    function rint(n){
        return Math.floor(Math.random()*n)
    }

    function random_enemy_array(){
        x = rint(6) + 2; h = (rint(25) + 25) * x;
        y = rint(4) + 2; v = (rint(25) + 25) * y;
        s = Math.random()*3 + 0.5;
        return new EnemyArray(rint(15), 50, 50, h, v, x, y, s);
    }

    function draw_score(){
        ctx.fillStyle = "#888888"
        ctx.font = "100px calibri";
        ctx.textAlign = "center";
        ctx.fillText(score, WIDTH/2, HEIGHT/2);
    }


    /*================ Game ================*/
    var ctx = context();        // Canvas 2D Context
    var img = new graphics();   // Vector Graphics

    var player, enemy_array, score;

    function start(){
        player = new Player();
        enemy_array = random_enemy_array();
        score = 0;
    }

    function update(){
        if (input.left) player.move_left();
        if (input.right) player.move_right();

        score++;

        enemy_array.move();
    }

    function draw(){
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        draw_score();
        
        player.draw();
        enemy_array.draw();
    }


    /*================ Start Program ===============*/
    function loop() {
        update();
        draw();
        requestAnimationFrame(loop);
    }

    function init(){ 
        start();
        loop();
    }

    img.player.onload = init();
    
});