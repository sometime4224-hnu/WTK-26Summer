(function () {
  "use strict";

  const WIDTH = 720;
  const HEIGHT = 480;

  function svgUri(markup) {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
  }

  function loadImage(markup) {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.src = svgUri(markup);
    });
  }

  function roundedRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.arcTo(x + width, y, x + width, y + r, r);
    ctx.lineTo(x + width, y + height - r);
    ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
    ctx.lineTo(x + r, y + height);
    ctx.arcTo(x, y + height, x, y + height - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  function makeAssets() {
    const tile = `
      <svg xmlns="http://www.w3.org/2000/svg" width="220" height="112" viewBox="0 0 220 112">
        <path d="M110 4 214 56 110 108 6 56Z" fill="#efd993"/>
        <path d="M110 4 214 56 110 108 6 56Z" fill="none" stroke="#bf9f5e" stroke-width="3" opacity=".42"/>
        <path d="M110 18v76" stroke="#fff7d7" stroke-width="9" stroke-linecap="round" opacity=".45"/>
        <path d="M44 56h132" stroke="#d8b977" stroke-width="3" opacity=".36"/>
      </svg>`;

    const fieldTile = `
      <svg xmlns="http://www.w3.org/2000/svg" width="180" height="88" viewBox="0 0 180 88">
        <path d="M90 4 174 44 90 84 6 44Z" fill="#c7ddb0"/>
        <path d="M90 4 174 44 90 84 6 44Z" fill="none" stroke="#ffffff" stroke-width="3" opacity=".26"/>
        <path d="M32 44h116" stroke="#87b178" stroke-width="2" opacity=".18"/>
      </svg>`;

    const hero = `
      <svg xmlns="http://www.w3.org/2000/svg" width="160" height="190" viewBox="0 0 160 190">
        <ellipse cx="82" cy="174" rx="54" ry="13" fill="#17202a" opacity=".2"/>
        <path d="M62 128 38 164" stroke="#173a56" stroke-width="15" stroke-linecap="round"/>
        <path d="M98 128 122 164" stroke="#173a56" stroke-width="15" stroke-linecap="round"/>
        <path d="M49 86c12-26 51-30 67-2 7 12 11 34 11 54H36c1-19 4-39 13-52Z" fill="#2f75a8"/>
        <path d="M43 99 14 123" stroke="#f4c69c" stroke-width="13" stroke-linecap="round"/>
        <path d="M117 99 146 122" stroke="#f4c69c" stroke-width="13" stroke-linecap="round"/>
        <circle cx="80" cy="55" r="38" fill="#f3c292"/>
        <path d="M42 42c12-34 62-38 79-7-21 11-49 10-79 7Z" fill="#34231e"/>
        <rect x="58" y="55" width="8" height="9" rx="2" fill="#101821"/>
        <rect x="95" y="55" width="8" height="9" rx="2" fill="#101821"/>
        <path d="M68 79c8 7 18 7 26 0" fill="none" stroke="#b75f4d" stroke-width="4" stroke-linecap="round"/>
      </svg>`;

    const gateFrame = `
      <svg xmlns="http://www.w3.org/2000/svg" width="260" height="190" viewBox="0 0 260 190">
        <ellipse cx="130" cy="174" rx="108" ry="16" fill="#17202a" opacity=".18"/>
        <rect x="16" y="28" width="26" height="146" rx="8" fill="#8a623e"/>
        <rect x="218" y="28" width="26" height="146" rx="8" fill="#8a623e"/>
        <rect x="33" y="24" width="194" height="48" rx="10" fill="#df6d55"/>
        <path d="M49 72h162v103H49Z" fill="#f6e3a6" opacity=".45"/>
        <path d="M50 74h160" stroke="#bb573e" stroke-width="6" opacity=".45"/>
      </svg>`;

    const door = `
      <svg xmlns="http://www.w3.org/2000/svg" width="86" height="114" viewBox="0 0 86 114">
        <rect x="4" y="4" width="78" height="106" rx="10" fill="#fff8e8"/>
        <rect x="4" y="4" width="78" height="106" rx="10" fill="none" stroke="#d3bd81" stroke-width="4"/>
        <circle cx="66" cy="58" r="5" fill="#c79852"/>
      </svg>`;

    const glow = `
      <svg xmlns="http://www.w3.org/2000/svg" width="190" height="190" viewBox="0 0 190 190">
        <defs>
          <radialGradient id="g" cx="50%" cy="50%" r="50%">
            <stop offset="0" stop-color="#fff7bd" stop-opacity=".95"/>
            <stop offset=".58" stop-color="#f2c75e" stop-opacity=".26"/>
            <stop offset="1" stop-color="#f2c75e" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="95" cy="95" r="94" fill="url(#g)"/>
      </svg>`;

    return Promise.all([
      loadImage(tile),
      loadImage(fieldTile),
      loadImage(hero),
      loadImage(gateFrame),
      loadImage(door),
      loadImage(glow),
    ]).then(([roadTile, fieldTileImage, heroImage, gateFrameImage, doorImage, glowImage]) => ({
      roadTile,
      fieldTileImage,
      heroImage,
      gateFrameImage,
      doorImage,
      glowImage,
    }));
  }

  function resizeCanvas(canvas, ctx) {
    const ratio = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.round(WIDTH * ratio);
    canvas.height = Math.round(HEIGHT * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function centerX(y) {
    return WIDTH / 2 + (y - 260) * 0.15;
  }

  function drawBackground(ctx) {
    const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    sky.addColorStop(0, "#99cfd7");
    sky.addColorStop(0.42, "#d9e8c8");
    sky.addColorStop(1, "#7eaa72");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = "rgba(255,255,255,.34)";
    ctx.beginPath();
    ctx.ellipse(214, 80, 128, 34, 0, 0, Math.PI * 2);
    ctx.ellipse(530, 66, 170, 42, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(83, 133, 85, .45)";
    ctx.beginPath();
    ctx.moveTo(0, 250);
    ctx.bezierCurveTo(120, 172, 230, 238, 336, 170);
    ctx.bezierCurveTo(458, 94, 552, 196, 720, 138);
    ctx.lineTo(720, 480);
    ctx.lineTo(0, 480);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(60, 112, 121, .16)";
    ctx.fillRect(0, 245, WIDTH, 10);
  }

  function drawAssetCanvas(canvas, assets) {
    const ctx = canvas.getContext("2d");
    resizeCanvas(canvas, ctx);

    function draw(now) {
      const t = (now % 5600) / 5600;
      const approach = Math.min(1, t * 1.75);
      const open = Math.max(0, Math.min(1, (t - 0.48) / 0.24));
      const pass = Math.max(0, Math.min(1, (t - 0.72) / 0.18));
      const shimmer = 0.5 + Math.sin(now / 150) * 0.5;

      drawBackground(ctx);

      const fieldOffset = (now / 62) % 88;
      for (let y = -80 + fieldOffset; y < HEIGHT + 120; y += 88) {
        for (let x = -120; x < WIDTH + 120; x += 154) {
          ctx.globalAlpha = 0.42;
          ctx.drawImage(assets.fieldTileImage, centerX(y) + x - WIDTH / 2, y, 180, 88);
        }
      }
      ctx.globalAlpha = 1;

      const roadOffset = (now / 36) % 92;
      for (let y = -60 + roadOffset; y < HEIGHT + 120; y += 92) {
        const scale = 0.66 + y / 760;
        ctx.drawImage(assets.roadTile, centerX(y) - 110 * scale, y, 220 * scale, 112 * scale);
      }

      const gateY = 128 + approach * 112;
      const gateScale = 0.78 + approach * 0.18;
      const gateW = 260 * gateScale;
      const gateH = 190 * gateScale;
      const gateX = centerX(gateY);

      ctx.globalAlpha = 0.28 + open * 0.7;
      ctx.drawImage(assets.glowImage, gateX - 120, gateY - 88, 240, 240);
      ctx.globalAlpha = 1;

      ctx.drawImage(assets.gateFrameImage, gateX - gateW / 2, gateY - gateH / 2, gateW, gateH);

      const doorW = 72 * gateScale;
      const doorH = 94 * gateScale;
      const doorY = gateY - 10 * gateScale;
      ctx.drawImage(assets.doorImage, gateX - doorW - 5 - open * 56, doorY, doorW, doorH);
      ctx.save();
      ctx.translate(gateX + 5 + doorW + open * 56, doorY);
      ctx.scale(-1, 1);
      ctx.drawImage(assets.doorImage, 0, 0, doorW, doorH);
      ctx.restore();

      ctx.fillStyle = "#18212c";
      ctx.font = `900 ${28 * gateScale}px "Malgun Gothic", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("사과", gateX, gateY - 58 * gateScale);

      for (let i = 0; i < 16; i += 1) {
        const angle = i * 0.72 + now / 480;
        const radius = 58 + Math.sin(now / 210 + i) * 16;
        const alpha = open * (0.28 + shimmer * 0.42);
        ctx.fillStyle = `rgba(255, 244, 170, ${alpha})`;
        ctx.beginPath();
        ctx.arc(gateX + Math.cos(angle) * radius, gateY + Math.sin(angle) * radius - 18, 3 + (i % 3), 0, Math.PI * 2);
        ctx.fill();
      }

      const heroX = WIDTH / 2 - 46 + pass * 122;
      const heroY = 328 - pass * 96 + Math.sin(now / 110) * 5;
      const heroScale = 0.72 - pass * 0.14;
      ctx.drawImage(assets.heroImage, heroX, heroY, 160 * heroScale, 190 * heroScale);

      ctx.fillStyle = "rgba(255,255,255,.86)";
      roundedRect(ctx, 28, 24, 188, 58, 8);
      ctx.fill();
      ctx.fillStyle = "#2f6f9f";
      ctx.font = '900 18px "Malgun Gothic", sans-serif';
      ctx.textAlign = "left";
      ctx.fillText(open > 0.85 ? "문 열림" : "발음 확인", 48, 58);

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }

  function createPhaserDemo() {
    if (!window.Phaser) return;

    class DemoScene extends Phaser.Scene {
      constructor() {
        super("DemoScene");
      }

      create() {
        this.makeTextures();
        this.elapsed = 0;
        this.fieldTiles = [];
        this.roadTiles = [];
        this.sparkles = [];

        this.sky = this.add.graphics();
        this.hills = this.add.graphics();
        this.tileLayer = this.add.container(0, 0);
        this.roadLayer = this.add.container(0, 0);
        this.effectLayer = this.add.container(0, 0);
        this.gate = this.add.container(360, 212);
        this.hero = this.add.sprite(328, 366, "phaserHero").setOrigin(0.5, 0.8);

        this.buildTiles();
        this.buildGate();
        this.buildSparkles();

        this.prompt = this.add.container(36, 26);
        const promptBg = this.add.rectangle(0, 0, 174, 58, 0xffffff, 0.88).setOrigin(0, 0);
        promptBg.setStrokeStyle(1, 0x203040, 0.1);
        this.prompt.add(promptBg);
        this.prompt.add(this.add.text(20, 16, "파도", {
          fontFamily: "Malgun Gothic",
          fontSize: "26px",
          fontStyle: "900",
          color: "#18212c",
        }));
      }

      makeTextures() {
        let g = this.add.graphics();
        g.fillStyle(0xc8ddb1, 1);
        g.lineStyle(2, 0xffffff, 0.28);
        g.beginPath();
        g.moveTo(80, 4);
        g.lineTo(154, 40);
        g.lineTo(80, 76);
        g.lineTo(6, 40);
        g.closePath();
        g.fillPath();
        g.strokePath();
        g.generateTexture("phaserFieldTile", 160, 80);
        g.destroy();

        g = this.add.graphics();
        g.fillStyle(0xecd48e, 1);
        g.lineStyle(3, 0xaf8950, 0.32);
        g.beginPath();
        g.moveTo(108, 4);
        g.lineTo(210, 52);
        g.lineTo(108, 100);
        g.lineTo(6, 52);
        g.closePath();
        g.fillPath();
        g.strokePath();
        g.lineStyle(8, 0xfff3cc, 0.46);
        g.lineBetween(108, 20, 108, 84);
        g.generateTexture("phaserRoadTile", 216, 104);
        g.destroy();

        g = this.add.graphics();
        g.fillStyle(0x17202a, 0.18);
        g.fillEllipse(74, 164, 106, 22);
        g.lineStyle(13, 0x173a56, 1);
        g.lineBetween(56, 120, 30, 154);
        g.lineBetween(94, 120, 122, 154);
        g.fillStyle(0x2f75a8, 1);
        g.fillRoundedRect(42, 78, 68, 62, 18);
        g.lineStyle(10, 0xf4c69c, 1);
        g.lineBetween(46, 94, 14, 118);
        g.lineBetween(106, 94, 138, 118);
        g.fillStyle(0xf3c292, 1);
        g.fillCircle(76, 52, 34);
        g.fillStyle(0x34231e, 1);
        g.fillEllipse(76, 31, 72, 24);
        g.fillStyle(0x101821, 1);
        g.fillRect(57, 51, 7, 8);
        g.fillRect(88, 51, 7, 8);
        g.generateTexture("phaserHero", 150, 178);
        g.destroy();

        g = this.add.graphics();
        g.fillStyle(0x8a623e, 1);
        g.fillRoundedRect(10, 20, 24, 134, 8);
        g.fillRoundedRect(206, 20, 24, 134, 8);
        g.fillStyle(0xdf6d55, 1);
        g.fillRoundedRect(24, 14, 192, 44, 10);
        g.generateTexture("phaserGateFrame", 240, 168);
        g.destroy();

        g = this.add.graphics();
        g.fillStyle(0xfff8e8, 1);
        g.fillRoundedRect(4, 4, 74, 100, 10);
        g.lineStyle(3, 0xcdb577, 1);
        g.strokeRoundedRect(4, 4, 74, 100, 10);
        g.fillStyle(0xc89850, 1);
        g.fillCircle(60, 54, 5);
        g.generateTexture("phaserDoor", 84, 110);
        g.destroy();
      }

      buildTiles() {
        for (let row = -2; row < 9; row += 1) {
          for (let col = -3; col < 6; col += 1) {
            const tile = this.add.image(360 + col * 122 + row * 12, row * 70, "phaserFieldTile");
            tile.setAlpha(0.46);
            this.tileLayer.add(tile);
            this.fieldTiles.push({ tile, row, col });
          }
        }

        for (let row = -1; row < 7; row += 1) {
          const tile = this.add.image(360 + row * 14, row * 86, "phaserRoadTile");
          this.roadLayer.add(tile);
          this.roadTiles.push({ tile, row });
        }
      }

      buildGate() {
        this.gateShadow = this.add.ellipse(0, 84, 220, 28, 0x17202a, 0.18);
        this.gateFrame = this.add.image(0, 0, "phaserGateFrame");
        this.leftDoor = this.add.image(-42, 46, "phaserDoor");
        this.rightDoor = this.add.image(42, 46, "phaserDoor").setFlipX(true);
        this.gateText = this.add.text(0, -48, "파도", {
          fontFamily: "Malgun Gothic",
          fontSize: "30px",
          fontStyle: "900",
          color: "#18212c",
        }).setOrigin(0.5);
        this.gate.add([this.gateShadow, this.gateFrame, this.leftDoor, this.rightDoor, this.gateText]);
      }

      buildSparkles() {
        for (let i = 0; i < 18; i += 1) {
          const sparkle = this.add.circle(360, 220, 3 + (i % 3), 0xfff2a8, 0);
          this.effectLayer.add(sparkle);
          this.sparkles.push({ sparkle, angle: i * 0.72, radius: 54 + i * 2 });
        }
      }

      drawWorld() {
        this.sky.clear();
        this.sky.fillGradientStyle(0x99cfd7, 0x99cfd7, 0x7daa70, 0x7daa70, 1);
        this.sky.fillRect(0, 0, 720, 480);
        this.sky.fillStyle(0xffffff, 0.35);
        this.sky.fillEllipse(190, 72, 210, 54);
        this.sky.fillEllipse(545, 60, 260, 62);

        this.hills.clear();
        this.hills.fillStyle(0x5f995d, 0.42);
        this.hills.fillEllipse(190, 336, 470, 210);
        this.hills.fillEllipse(548, 300, 520, 230);
        this.hills.fillStyle(0x5f995d, 0.5);
        this.hills.fillRect(0, 262, 720, 218);
        this.hills.fillStyle(0x3c7079, 0.16);
        this.hills.fillRect(0, 246, 720, 10);
      }

      update(time, delta) {
        this.elapsed += delta;
        const t = (this.elapsed % 5200) / 5200;
        const approach = Math.min(1, t * 1.6);
        const open = Phaser.Math.Clamp((t - 0.48) / 0.22, 0, 1);
        const pass = Phaser.Math.Clamp((t - 0.72) / 0.18, 0, 1);

        this.drawWorld();

        this.fieldTiles.forEach(({ tile, row, col }) => {
          tile.y = ((row * 70 + this.elapsed * 0.038) % 610) - 80;
          tile.x = 360 + col * 122 + row * 12 + Math.sin(time / 1200 + row) * 3;
        });
        this.roadTiles.forEach(({ tile, row }) => {
          const y = ((row * 86 + this.elapsed * 0.06) % 640) - 80;
          tile.y = y;
          tile.x = 360 + y * 0.07;
          const scale = 0.72 + y / 720;
          tile.setScale(scale);
        });

        this.gate.x = 360 + approach * 14;
        this.gate.y = 166 + approach * 68;
        this.gate.setScale(0.9 + approach * 0.16);
        this.leftDoor.x = -42 - open * 54;
        this.rightDoor.x = 42 + open * 54;
        this.gateShadow.setAlpha(0.18 + open * 0.18);

        this.hero.x = 326 + pass * 124;
        this.hero.y = 376 - pass * 94 + Math.sin(time / 120) * 5;
        this.hero.rotation = Math.sin(time / 140) * 0.04;
        this.hero.setScale(0.78 - pass * 0.08);

        this.cameras.main.zoom = 1 + open * 0.035;
        this.cameras.main.scrollX = open * 8;
        this.cameras.main.scrollY = -open * 5;

        this.sparkles.forEach(({ sparkle, angle, radius }, index) => {
          const pulse = Math.sin(time / 180 + index) * 0.5 + 0.5;
          sparkle.x = this.gate.x + Math.cos(angle + time / 520) * radius;
          sparkle.y = this.gate.y + Math.sin(angle + time / 520) * radius - 12;
          sparkle.setAlpha(open * (0.25 + pulse * 0.65));
        });

        this.prompt.setAlpha(0.88 + open * 0.12);
      }
    }

    new Phaser.Game({
      type: Phaser.AUTO,
      parent: "phaserDemo",
      width: 720,
      height: 480,
      backgroundColor: "#9acbd2",
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: DemoScene,
    });
  }

  makeAssets().then((assets) => {
    const canvas = document.getElementById("assetCanvas");
    if (canvas) drawAssetCanvas(canvas, assets);
  });

  createPhaserDemo();
})();
