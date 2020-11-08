/*jslint bitwise:true, es5: true */
(function (window, undefined) {
    'use strict';
    var KEY_ENTER = 13,
        KEY_LEFT = 37,
        KEY_UP = 38,
        KEY_RIGHT = 39,
        KEY_DOWN = 40,
        canvas = null,
        ctx = null,
        lastPress = null,
        pause = true,
        dir = 0,
        body = [],
        food = null,
        score = 0,
        gameover = true,
        currentScene = 0,
        scenes = [],
        mainScene = null,
        gameScene = null,
        iBody = new Image(),
        iFood = new Image(),
        aEat = new Audio(),
        aDie = new Audio(),
        buffer = null,
        bufferCtx = null
        /*bufferScale = 1,
        bufferOffsetX = 0,
        bufferOffsetY = 0;*/

    window.requestAnimationFrame = (function () {
        return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
        window.setTimeout(callback, 17);
        };
        }());
    document.addEventListener('keydown', function (evt) {
        if (evt.which >= 37 && evt.which <= 40) {
            evt.preventDefault();
         }
        lastPress = evt.which;
    }, false);

    function random(max) {
        return ~~(Math.random() * max);
    }

    function resize(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var w = window.innerWidth / buffer.width;
        var h = window.innerHeight / buffer.height;
        bufferScale = Math.min(h, w);
        bufferOffsetX = (canvas.width - (buffer.width * bufferScale)) / 2;
        bufferOffsetY = (canvas.height - (buffer.height * bufferScale)) / 2;
    }
    function canPlayOgg() {
        var aud = new Audio();
        if (aud.canPlayType('audio/ogg').replace(/no/, '')) {
            return true;
        } else {
            return false;
        }
    }
    function reset() {
        score = 0;
        dir = 1;
        food.x = random(buffer.width / 10 - 1) * 10;
        food.y = random(buffer.height / 10 - 1) * 10;
        gameover = false;
        body.length = 0;
        body.push(new Rectangle(40, 40, 10, 10));
        body.push(new Rectangle(0, 0, 10, 10));
        body.push(new Rectangle(0, 0, 10, 10));
    }
    function Rectangle(x, y, width, height) {
        this.x = (x === undefined) ? 0 : x;
        this.y = (y === undefined) ? 0 : y;
        this.width = (width === undefined) ? 0 : width;
        this.height = (height === undefined) ? this.width : height;
    }
    Rectangle.prototype = {
        constructor: Rectangle,

        intersects: function (rect) {
        if (rect === undefined) {
            window.console.warn('Missing parameters on function intersects');
        } else {
            return (this.x < rect.x + rect.width &&
            this.x + this.width > rect.x &&
            this.y < rect.y + rect.height &&
            this.y + this.height > rect.y);
            }
        },
        fill: function (ctx) {
        if (ctx === undefined) {
            window.console.warn('Missing parameters on function fill');
        } else {
            ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        },
        drawImage: function (ctx, img) {
        if (img === undefined) {
            window.console.warn('Missing parameters on function drawImage');
        } else {
            if (img.width) {
                ctx.drawImage(img, this.x, this.y);
            } else {
                ctx.strokeRect(this.x, this.y, this.width, this.height);
            }
        }
        }
    };
    function Scene() {
        this.id = scenes.length;
        scenes.push(this);
        }
    Scene.prototype = {
        constructor: Scene,
        load: function () {},
        paint: function (ctx) {},
        act: function () {}
    };
    function loadScene(scene) {
        currentScene = scene.id;
        scenes[currentScene].load();
    }
    function paint(ctx) {
        var i=0,
            l=0;

        // Clean canvas
        ctx.fillStyle = '#000';
        //ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, buffer.width, buffer.height);
        // Draw player
        //ctx.fillStyle = '#0f0';
        ctx.strokeStyle = '#0f0';
        for (i = 0, l = body.length; i < l; i += 1) {
            //body[i].fill(ctx);
            body[i].drawImage(ctx,iBody);
        }
        
        // Draw food
        //ctx.fillStyle = '#f00';
        //food.fill(ctx);
        //ctx.drawImage(iFood, food.x, food.y);
        ctx.strokeStyle = '#f00';
        food.drawImage(ctx, iFood);
        
        // Debug last key pressed
        //ctx.fillText('Last Press: ' + lastPress, 0, 20);
        
        // Draw score
        ctx.fillStyle = '#fff';
        ctx.fillText('Score: ' + score, 0, 10);

       // ctx.fillText('FPS: ' + FPS, 0, 20);
        
        // Draw walls
        /*ctx.fillStyle = '#999';
        for (i = 0, l = wall.length; i < l; i += 1) {
            wall[i].fill(ctx);
        }*/
        // Draw pause
        if (pause) {
            ctx.textAlign = 'center';
            if (gameover) {
                ctx.fillText('GAME OVER', 150, 75);
            } else {
                ctx.fillText('PAUSE', 150, 75);
            }
            ctx.textAlign = 'left';
        }
    }
    /*function act() {
        var i=0,
            l=0;

        if (!pause) {
            // GameOver Reset
            if (gameover) {
                reset();
            }
            // Move Body
            for (i = body.length - 1; i > 0; i -= 1) {
                body[i].x = body[i - 1].x;
                body[i].y = body[i - 1].y;
            }   
            // Change Direction
            if (lastPress === KEY_UP && dir !== 2) {
                dir = 0;
            }
            if (lastPress === KEY_RIGHT && dir !== 3) {
                dir = 1;
            }
            if (lastPress === KEY_DOWN && dir !== 0) {
                dir = 2;
            }
            if (lastPress === KEY_LEFT && dir !== 1) {
                dir = 3;
            }
            // Move Head
            if (dir === 0) {
                body[0].y -= 10;
                }
            if (dir === 1) {
                body[0].x += 10;
            }
            if (dir === 2) {
                body[0].y += 10;
            }
            if (dir === 3) {
                body[0].x -= 10;
            }
            // Out Screen
            if (body[0].x > canvas.width - body[0].width) {
                body[0].x = 0;
            }
            if (body[0].y > canvas.height - body[0].height) {
                body[0].y = 0;
            }
            if (body[0].x < 0) {
                body[0].x = canvas.width - body[0].width;
            }
            if (body[0].y < 0) {
                body[0].y = canvas.height - body[0].height;
            }
             // Body Intersects
             for (i = 2, l = body.length; i < l; i += 1) {
                if (body[0].intersects(body[i])) {
                gameover = true;
                pause = true;
                aDie.play();
                }
            }
            // Food Intersects
            if (body[0].intersects(food)) {
                body.push(new Rectangle(food.x, food.y, 10, 10));
                score += 1;
                food.x = random(buffer.width / 10 - 1) * 10;
                food.y = random(buffer.height / 10 - 1) * 10;
                aEat.play();
            }
            // Wall Intersects
            /*for (i = 0, l = wall.length; i < l; i += 1) {
                if (food.intersects(wall[i])) {
                    food.x = random(canvas.width / 10 - 1) * 10;
                    food.y = random(canvas.height / 10 - 1) * 10;
                }
                if (body[0].intersects(wall[i])) {
                    pause = true;
                    gameover=true;
                    aDie.play();
                }
            }*/
       // }
        // Pause/Unpause
        /*if (lastPress === KEY_ENTER) {
            pause = !pause;
            lastPress = null;
        }
    }*/

    function repaint() {
        window.requestAnimationFrame(repaint);
        //paint(ctx); 
        //paint(bufferCtx);
        if (scenes.length) {
            scenes[currentScene].paint(ctx);
        }  

        /*ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.oImageSmoothingEnabled = false;  
        ctx.drawImage(buffer, bufferOffsetX, bufferOffsetY, buffer.width * bufferScale, buffer.height* bufferScale);*/
        //ctx.drawImage(buffer, 0, 0, canvas.width, canvas.height);
    }
     function run() {
        setTimeout(run, 50);
        //act();
        if (scenes.length) {
            scenes[currentScene].act();
        }
    }
   
    function init() {
        // Get canvas and context
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        canvas.width = 600;
        canvas.height = 300;
        // Load buffer
        /*buffer = document.createElement('canvas');
        bufferCtx = buffer.getContext('2d');
        buffer.width = 300;
        buffer.height = 150;*/
        // Load assets
        iBody.src = 'assets/body.png';
        iFood.src = 'assets/fruit.png';
        if (canPlayOgg()) {
            aEat.src="assets/chomp.oga";
            aDie.src = "assets/dies.oga";
        } else {
            aEat.src="assets/chomp.m4a";
            aDie.src = "assets/dies.m4a";
        }
        food = new Rectangle(80, 80, 10, 10);
        // Start game
        //resize();
        run();
        repaint();
    }
    // Main Scene
    mainScene = new Scene();
    mainScene.paint = function (ctx) {
        // Clean canvas
        ctx.fillStyle = '#030';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw title
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText('SNAKE', 150, 60);
        ctx.fillText('Press Enter', 150, 90);
     };
    mainScene.act = function () {
         // Load next scene
        if (lastPress === KEY_ENTER) {
            loadScene(gameScene);
            lastPress = null;
        }
    };
     // Game Scene
    gameScene = new Scene();
    gameScene.load = function () {
        score = 0;
        dir = 1;
        body.length = 0;
        body.push(new Rectangle(40, 40, 10, 10));
        body.push(new Rectangle(0, 0, 10, 10));
        body.push(new Rectangle(0, 0, 10, 10));
        food.x = random(canvas.width / 10 - 1) * 10;
        food.y = random(canvas.height / 10 - 1) * 10;
        gameover = false;
    };
    gameScene.paint = function (ctx) {
        var i = 0,
        l = 0;
        // Clean canvas
        ctx.fillStyle = '#030';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw player
        ctx.strokeStyle = '#0f0';
        for (i = 0, l = body.length; i < l; i += 1) {
        body[i].drawImage(ctx, iBody);
        }
        // Draw walls
        //ctx.fillStyle = '#999';
        //for (i = 0, l = wall.length; i < l; i += 1) {
        // wall[i].fill(ctx);
        //}
        // Draw food
        ctx.strokeStyle = '#f00';
        food.drawImage(ctx, iFood);
        // Draw score
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'left';
        ctx.fillText('Score: ' + score, 0, 10);
        // Debug last key pressed
        //ctx.fillText('Last Press: '+lastPress,0,20);
        // Draw pause
        if (pause) {
            ctx.textAlign = 'center';
            if (gameover) {
                ctx.fillText('GAME OVER', 150, 75);
            } else {
                ctx.fillText('PAUSE', 150, 75);
            }
        }
    };
    gameScene.act = function () {
        var i = 0,
        l = 0;
        if (!pause) {
        // GameOver Reset
            if (gameover) {
                loadScene(mainScene);
            }
        // Move Body
            for (i = body.length - 1; i > 0; i -= 1) {
                body[i].x = body[i - 1].x;
                body[i].y = body[i - 1].y;
            }
            // Change Direction
            if (lastPress === KEY_UP && dir !== 2) {
                dir = 0;
            }
            if (lastPress === KEY_RIGHT && dir !== 3) {
                dir = 1;
            }
            if (lastPress === KEY_DOWN && dir !== 0) {
                dir = 2;
            }
            if (lastPress === KEY_LEFT && dir !== 1) {
                dir = 3;
            }
        // Move Head
            if (dir === 0) {
                body[0].y -= 10;
            }
            if (dir === 1) {
                body[0].x += 10;
            }
            if (dir === 2) {
                body[0].y += 10;
            }
            if (dir === 3) {
                body[0].x -= 10;
            }
        // Out Screen
            if (body[0].x > canvas.width - body[0].width) {
                body[0].x = 0;
            }
            if (body[0].y > canvas.height - body[0].height) {
                body[0].y = 0;
            }
            if (body[0].x < 0) {
                body[0].x = canvas.width - body[0].width;
            }
            if (body[0].y < 0) {
                body[0].y = canvas.height - body[0].height;
            }
            // Food Intersects
            if (body[0].intersects(food)) {
                body.push(new Rectangle(0, 0, 10, 10));
                score += 1;
                food.x = random(canvas.width / 10 - 1) * 10;
                food.y = random(canvas.height / 10 - 1) * 10;
                aEat.play();
            }
            // Wall Intersects
            //for (i = 0, l = wall.length; i < l; i += 1) {
            // if (food.intersects(wall[i])) {
            // food.x = random(canvas.width / 10 - 1) * 10;
            // food.y = random(canvas.height / 10 - 1) * 10;
            // }
            //
            // if (body[0].intersects(wall[i])) {
            // gameover = true;
            // pause = true;
            // }
            //}
            // Body Intersects
            for (i = 2, l = body.length; i < l; i += 1) {
                if (body[0].intersects(body[i])) {
                    gameover = true;
                    pause = true;
                    aDie.play();
                }
            }
        }
    // Pause/Unpause
        if (lastPress === KEY_ENTER) {
            pause = !pause;
            lastPress = null;
        }
    };

    window.addEventListener('load', init, false);
    //window.addEventListener('resize', resize, false);
}(window));