var canvas, ctx, ALTURA, LARGURA,qBall;
var _balls = [];
var mousedownID = -1;

//quando o mouse for pressionado, verifica se pegou uma bola, caso pegue chama mundoSemVolta
function mousedown(event) {
    if (mousedownID == -1) {
        for (var i = 0; i < _balls.length; i++) {
            if (Math.sqrt(Math.pow((_balls[i].x - event.clientX), 2) + Math.pow((_balls[i].y - (event.clientY)), 2)) <= _balls[i].tamanho) {
                var aux = _balls.splice(i, 1);
                _balls.unshift(aux[0]);
            }
        }
        mousedownID = setInterval(mundoSemVolta(event), 10);
    }
}

//saida para quando o mouse para de ser apertado
function mouseup(event) {
    if (mousedownID != -1) {
        clearInterval(mousedownID);
        mousedownID = -1;
    }
}

//metodo responsavel pela atualização das coordenadas da bola e aglutinaçao entre bolas
function mundoSemVolta(event) {
    if (mousedownID != -1) {
        _balls[0].x = event.clientX;
        _balls[0].y = (event.clientY);
        //parte da aglutinacao
        for (var i = 1; i < _balls.length; i++) {
            if (Math.sqrt(Math.pow((_balls[0].x - _balls[i].x), 2) + Math.pow((_balls[0].y - _balls[i].y), 2)) <= _balls[0].tamanho + _balls[i].tamanho) {
                _balls[0].tamanho = Math.max(_balls.splice(i, 1)[0].tamanho, _balls[0].tamanho) +20;
                _balls[0].cor = balls.cores[Math.floor(21 * Math.random())]

            }
        }
    }
}

//listeners
document.addEventListener("mousedown", mousedown);
document.addEventListener("mouseup", mouseup);
document.addEventListener("mouseout", mouseup);
document.addEventListener("mousemove", mundoSemVolta);
document.body.addEventListener("mousedown", click);

//cria o objeto bola e suas funçoes (insere/desenha/mColisao)
var balls = {
    cores: ["#ffbc1c", "#ff1c1c", "#ff85e1", "#52a7ff", "#78ff5d", "#ff00ff", "#bebebe", "#7fffd4", "#ff00ff", "#00f5ff", "#1e90fe", "#7cfc00",
        "#ffff00", "#00008b", "#53868b", "#8b008b", "#caff70", "#912cee", "#1c1c1c", "#ff8c69", "#4eee94"],
    insere: function (posX, posY) {
        _balls.push({
            x: posX,
            y: posY,
            tamanho: 5 + Math.floor(80 * Math.random()),
            cor: this.cores[Math.floor(21 * Math.random())]
        })
    },

    desenha: function () {
        for (var i = 0; i < _balls.length; i++) {
            var obs =_balls[i];
            ctx.fillStyle = obs.cor;
            ctx.beginPath();
            ctx.arc(obs.x, obs.y, obs.tamanho, 0, 2 * Math.PI);
            ctx.fill();
        }
    },
    //verifica a colisao das coordenadas do mouse cm alguma bola
    mColisao: function (posX, posY) {
        for (var i = 0, tam = _balls.length; i < tam; i++) {
            var obs =_balls[i];
            //joao = hipotenusa
            var joao = Math.sqrt(Math.pow((obs.x - posX), 2) + Math.pow((obs.y - posY), 2));
            if (joao <= obs.tamanho) {
                return obs;
            }
        }
        return null;
    }
};

//cria o canvas e chamada o roda
function main() {
    ALTURA = window.innerHeight;
    LARGURA = window.innerWidth;

    canvas = document.createElement("canvas");
    canvas.width = LARGURA;
    canvas.height = ALTURA;
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);

    roda()
}

//verifica se as coordenadas do mouse e se essas coordenadas não tocam em nenhuma bola, insere na tela
function click() {
    posX = event.clientX;
    posY = (event.clientY);
    if (balls.mColisao(posX, posY) == null) {
        balls.insere(posX, posY);
    }

}

//cria loop da tela
function roda() {
    ctx.clearRect(0, 0, LARGURA, ALTURA);
    balls.desenha();

    window.requestAnimationFrame(roda);
}
main()
