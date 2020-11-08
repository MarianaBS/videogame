/* RequestAnimationFrame (Timeout) */
/*'use strict';
var canvas = null,
    ctx = null,
    lastUpdate = 0,
    FPS = 0,
    frames = 0,
    acumDelta = 0,
    x = 50,
    y = 50;

window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 17);
        };
}());

function paint(ctx) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0f0';
    ctx.fillRect(x, y, 10, 10);

    ctx.fillStyle = '#fff';
    ctx.fillText('FPS: ' + FPS, 10, 10);
}

function act() {
    x += 6;
    if (x > canvas.width) {
        x = 0;
    }
}

function run() {
    setTimeout(function () {
        window.requestAnimationFrame(run);
    }, 50);

    var now = Date.now(),
        deltaTime = (now - lastUpdate) / 1000;
    if (deltaTime > 1) {
        deltaTime = 0;
    }
    lastUpdate = now;

    frames += 1;
    acumDelta += deltaTime;
    if (acumDelta > 1) {
        FPS = frames;
        frames = 0;
        acumDelta -= 1;
    }

    act();
    paint(ctx);
}

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    run();
}

window.addEventListener('load', init, false);*/

/* RequestAnimationFrame (Async) */
/*'use strict';
var canvas = null,
    ctx = null,
    lastUpdate = 0,
    FPS = 0,
    frames = 0,
    acumDelta = 0,
    interval = 50,
    CPS = 0,
    cicles = 0,
    x = 50,
    y = 50;

window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 17);
        };
}());

function paint(ctx) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0f0';
    ctx.fillRect(x, y, 10, 10);

    ctx.fillStyle = '#fff';
    ctx.fillText('FPS: ' + FPS, 10, 10);
    ctx.fillText('CPS: ' + CPS, 10, 20);
}

function act() {
    x += 6;
    if (x > canvas.width) {
        x = 0;
    }
}

function repaint() {
    window.requestAnimationFrame(repaint);
    frames++;
    paint(ctx);
}

function run() {
    setTimeout(run, interval);

    var now = Date.now(),
        deltaTime = (now - lastUpdate) / 1000;
    if (deltaTime > 1) {
        deltaTime = 0;
    }
    lastUpdate = now;

    cicles += 1;
    acumDelta += deltaTime;
    if (acumDelta > 1) {
        FPS = frames;
        CPS = cicles;
        frames = 0;
        cicles = 0;
        acumDelta -= 1;
    }

    act();
}

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    run();
    repaint();
}

window.addEventListener('load', init, false);*/

/* RequestAnimationFrame (deltaTime) */
'use strict';
var canvas = null,
    ctx = null,
    lastUpdate = 0,
    FPS = 0,
    frames = 0,
    acumDelta = 0,
    x = 50,
    y = 50;

window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 17);
        };
}());

function paint(ctx) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0f0';
    ctx.fillRect(x, y, 10, 10);

    ctx.fillStyle = '#fff';
    ctx.fillText('FPS: ' + FPS, 10, 10);
}

function act(deltaTime) {
    x += 120 * deltaTime;
    if (x > canvas.width) {
        x = 0;
    }
}

function run() {
    window.requestAnimationFrame(run);

    var now = Date.now(),
        deltaTime = (now - lastUpdate) / 1000;
    if (deltaTime > 1) {
        deltaTime = 0;
    }
    lastUpdate = now;

    frames += 1;
    acumDelta += deltaTime;
    if (acumDelta > 1) {
        FPS = frames;
        frames = 0;
        acumDelta -= 1;
    }

    act(deltaTime);
    paint(ctx);
}

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    run();
}

window.addEventListener('load', init, false);