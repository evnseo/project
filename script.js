var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var ballRadius = 10;

//paddle
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;

var rightPressed = false;
var leftPressed = false;

var x = canvas.width/2;
var y = canvas.height-30;
var dx = 3;
var dy = 3;

//brick
var brickRowCount = 6;
var brickColumnCount = 11;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

//skor dan nyawa
var score = 0;
var lives = 3;

var bricks = [];
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
         bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}
function drawball(){ //drawball(): Menggambar bola di posisi (x, y) dengan jari-jari ballRadius.
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "rgb(7, 15, 43)";
    ctx.fill();
    ctx.closePath();
}
function drawPaddle() { //drawPaddle(): Menggambar paddle di posisi (paddleX, canvas.height - paddleHeight) dengan lebar paddleWidth dan tinggi paddleHeight.
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "rgb(7, 15, 43)";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() { //drawBricks(): Menggambar bata-bata berdasarkan statusnya.
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
             if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "rgb(83, 92, 145)";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw() { //draw(): Fungsi utama yang memanggil fungsi-fungsi gambar, menggerakkan bola, mendeteksi tabrakan, menghitung skor, dan menggambar nyawa serta pesan di layar
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawball();
    drawPaddle();
    drawScore();
    alto();
    drawLives();
    collisionDetection();
    x += dx;
    y += dy;
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    } else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    requestAnimationFrame(draw);
}

function keyDownHandler(e) { //keyDownHandler(e) dan keyUpHandler(e): Menangani peristiwa ketika tombol panah kiri atau kanan ditekan atau dilepas.
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}
function collisionDetection() { //collisionDetection(): Mendeteksi tabrakan antara bola dan bata.
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score % 5 === 0) { // mepercepat bola setelah 5 bricks
                        dx += 0.5;
                        dy += 0.5;
                    }
                    if(score == brickRowCount*brickColumnCount) {
                        alert("SELAMAT ANDA MENANG!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}
function drawScore() { //drawScore(): Menggambar skor di layar.
    ctx.font = "15px Arial";
    ctx.fillStyle = "rgb(83, 92, 145)";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() { //drawLives(): Menggambar jumlah nyawa di layar.
    ctx.font = "15px Arial";
    ctx.fillStyle = "rgb(83, 92, 145)";
    ctx.fillText("Darah: "+lives, canvas.width-65, 20);
}

function alto() { //alto(): Menggambar judul permainan di layar.
    ctx.font = "15px Arial";
    ctx.fillStyle = "rgb(7, 15, 43)";
    ctx.fillText("Game Pemrograman Web Week 5", 160, 17);
}
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) { //mouseMoveHandler(e): Menangani pergerakan mouse untuk menggerakkan paddle.
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

draw();