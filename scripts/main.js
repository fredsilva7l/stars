(function (window) {
  window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

  const FRAME_RATE = 60;
  const PARTICLE_NUM = 2000;
  const RADIUS = Math.PI * 2;
  const CANVASWIDTH = 1200;
  const CANVASHEIGHT = 300;
  const CANVASID = "canvas";

  let texts = [
    "Os seus olhos, fazem as estrelas",
    "Parecerem que não estão brilhando",
    "O seu sorríso...",
    "Me alegra sem você precisar fazer nada",
    "Você é tão linda",
    "E eu quero dizer isso todos os dias",

    "Sim, eu sei que quando a elogio",
    "Você não costuma acreditar",
    "E é tão triste você não poder ver",
    "Tudo aquilo que eu vejo em você",
    "Mas sempre que me perguntar",
    "Eu estou bonita?",
    "Eu direi",

    "Quando eu vejo seu rosto",
    "Não há nada que eu queira mudar",
    "Porque você é incrivel",
    "Do jeito que você é",
    "E quando você sorri",
    "O mundo para e fico olhando por um tempo",
    "Porque mulher, você é incrível",
    "Do jeito que você é",

    "E os seus lábios",
    "Eu poderia beijá-los o dia todo",
    "E a sua risada",
    "Eu odeio, mas eu acho tão sexy",
    "Você é tão linda",
    "E eu quero dizer isso todos os dias",

    "Espero que você saiba",
    "Que eu jamais te pediria para mudar",
    "Se é perfeição que você busca",
    "Então continue sendo você mesma",
    "E se me perguntar se está bonita",
    "Você sabe que eu vou dizer",

    "Quando eu vejo seu rosto",
    "Não há nada que eu queira mudar",
    "Porque você é incrivel",
    "Do jeito que você é",
    "E quando você sorri",
    "O mundo para e fico olhando por um tempo",
    "Porque mulher, você é incrível",
    "Do jeito que você é",
  ];

  let canvas,
    ctx,
    particles = [],
    quiver = true,
    text = texts[0],
    textIndex = 0,
    textSize = 55;

  function draw() {
    ctx.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT);
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.textBaseline = "middle";
    ctx.fontWeight = "bold";
    ctx.font =
      textSize +
      "px 'SimHei', 'Avenir', 'Helvetica Neue', 'Arial', 'sans-serif'";
    ctx.fillText(
      text,
      (CANVASWIDTH - ctx.measureText(text).width) * 0.5,
      CANVASHEIGHT * 0.5
    );

    let imgData = ctx.getImageData(0, 0, CANVASWIDTH, CANVASHEIGHT);

    ctx.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT);

    for (let i = 0, l = particles.length; i < l; i++) {
      let p = particles[i];
      p.inText = false;
    }
    particleText(imgData);

    window.requestAnimationFrame(draw);
  }

  function particleText(imgData) {
    var pxls = [];
    for (var w = CANVASWIDTH; w > 0; w -= 3) {
      for (var h = 0; h < CANVASHEIGHT; h += 3) {
        var index = (w + h * CANVASWIDTH) * 4;
        if (imgData.data[index] > 1) {
          pxls.push([w, h]);
        }
      }
    }

    var count = pxls.length;
    var j = parseInt((particles.length - pxls.length) / 2, 10);
    j = j < 0 ? 0 : j;

    for (var i = 0; i < pxls.length && j < particles.length; i++, j++) {
      try {
        var p = particles[j],
          X,
          Y;

        if (quiver) {
          X = pxls[i - 1][0] - (p.px + Math.random() * 10);
          Y = pxls[i - 1][1] - (p.py + Math.random() * 10);
        } else {
          X = pxls[i - 1][0] - p.px;
          Y = pxls[i - 1][1] - p.py;
        }
        var T = Math.sqrt(X * X + Y * Y);
        var A = Math.atan2(Y, X);
        var C = Math.cos(A);
        var S = Math.sin(A);
        p.x = p.px + C * T * p.delta;
        p.y = p.py + S * T * p.delta;
        p.px = p.x;
        p.py = p.y;
        p.inText = true;
        p.fadeIn();
        p.draw(ctx);
      } catch (e) {}
    }
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      if (!p.inText) {
        p.fadeOut();

        var X = p.mx - p.px;
        var Y = p.my - p.py;
        var T = Math.sqrt(X * X + Y * Y);
        var A = Math.atan2(Y, X);
        var C = Math.cos(A);
        var S = Math.sin(A);

        p.x = p.px + (C * T * p.delta) / 2;
        p.y = p.py + (S * T * p.delta) / 2;
        p.px = p.x;
        p.py = p.y;

        p.draw(ctx);
      }
    }
  }

  function setDimensions() {
    canvas.width = CANVASWIDTH;
    canvas.height = CANVASHEIGHT;
    canvas.style.position = "absolute";
    canvas.style.left = "0%";
    canvas.style.top = "0%";
    canvas.style.bottom = "0%";
    canvas.style.right = "0%";
    canvas.style.marginTop = window.innerHeight * 0.15 + "px";
  }

  function event() {
    setInterval(function () {
      textIndex++;
      if (textIndex >= texts.length) {
        textIndex = 0;
      }
      text = texts[textIndex];
      console.log(textIndex);
    }, 4000);
  }

  function init() {
    canvas = document.getElementById(CANVASID);
    if (canvas === null || !canvas.getContext) {
      return;
    }
    ctx = canvas.getContext("2d");
    setDimensions();
    event();

    for (var i = 0; i < PARTICLE_NUM; i++) {
      particles[i] = new Particle(canvas);
    }

    draw();
  }

  class Particle {
    constructor(canvas) {
      let spread = canvas.height;
      let size = Math.random() * 2;
      this.delta = 0.05;
      this.x = 0;
      this.y = 0;
      this.px = Math.random() * canvas.width;
      this.py = canvas.height * 0.5 + (Math.random() - 0.5) * spread;
      this.mx = this.px;
      this.my = this.py;
      this.size = size;
      this.inText = false;
      this.opacity = 0;
      this.fadeInRate = 0.005;
      this.fadeOutRate = 0.03;
      this.opacityTresh = 0.98;
      this.fadingOut = true;
      this.fadingIn = true;
    }
    fadeIn() {
      this.fadingIn = this.opacity > this.opacityTresh ? false : true;
      if (this.fadingIn) {
        this.opacity += this.fadeInRate;
      } else {
        this.opacity = 1;
      }
    }
    fadeOut() {
      this.fadingOut = this.opacity < 0 ? false : true;
      if (this.fadingOut) {
        this.opacity -= this.fadeOutRate;
        if (this.opacity < 0) {
          this.opacity = 0;
        }
      } else {
        this.opacity = 0;
      }
    }
    draw(ctx) {
      ctx.fillStyle = "rgba(226,225,142, " + this.opacity + ")";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, RADIUS, true);
      ctx.closePath();
      ctx.fill();
    }
  }

  var isChrome =
    /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  if (!isChrome) {
    $("#iframeAudio").remove();
  }

  let initCalled = false;

  function playMusic() {
    const audio = document.querySelector("audio");
    audio.play();
    if (!initCalled) {
      setTimeout(() => {
        init();
        initCalled = true;
      }, 15000); // 15000 milissegundos = 15 segundos
    }
  }
  document.querySelector(".tela").addEventListener("click", playMusic);
})(window);
