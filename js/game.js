(function () {
	"use strict";

	var game = {
		canvas: false,
		canvasContext: false,
		hero: {
			imgReady: false,
			img: false,
			speed: 256,
			monstersCaught: 0,
			x: 0,
			y: 0
		},
		monster: {
			imgReady: false,
			img: false,
			x: 0,
			y: 0
		},
		images: {
			bg: {
				imgReady: false,
				img: false
			}
		},
		requestAnimationFrame: false,
		pauseGame: false,
		lastRefresh: false,
		initialize: function() {
			// Create the canvas
			this.canvas = document.createElement("canvas");
			this.canvasContext = this.canvas.getContext("2d");
			this.canvas.width = 512;
			this.canvas.height = 480;
			document.body.appendChild(this.canvas);

			// Background image
			this.images.bg.img = new Image();
			this.images.bg.img.onload = function() {
				game.images.bg.imgReady = true;
			};
			this.images.bg.img.src = "images/background.png";

			// Hero image
			this.hero.img = new Image();
			this.hero.img.onload = function () {
				game.hero.imgReady = true;
			};
			this.hero.img.src = "images/hero.png";

			// Monster image
			this.monster.img = new Image();
			this.monster.img.onload = function () {
				game.monster.imgReady = true;
			};
			this.monster.img.src = "images/monster.png";

			// Cross-browser support for requestAnimationFrame
			var w = window;
			this.requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
		},
		// The main game loop
		main: function() {
			if( !game.canvas ) {
				if( !game.lastRefresh ) {
					game.lastRefresh = Date.now();
				}
				game.initialize();
				game.reset();
			}

			var now = Date.now();
			var delta = now - game.lastRefresh;

			game.update(delta / 1000);
			game.render();

			game.lastRefresh = now;

			// Request to do this again ASAP
			if( game.requestAnimationFrame ) {
				if( !game.pauseGame ) {
					game.requestAnimationFrame.call(window, game.main);
				}
			}
		},
		// Draw everything
		render: function() {
			if (this.images.bg.imgReady) {
				this.canvasContext.drawImage(this.images.bg.img, 0, 0);
			}

			if (this.hero.imgReady) {
				this.canvasContext.drawImage(this.hero.img, this.hero.x, this.hero.y);
			}

			if (this.monster.imgReady) {
				this.canvasContext.drawImage(this.monster.img, this.monster.x, this.monster.y);
			}

			// Score
			this.canvasContext.fillStyle = "rgb(250, 250, 250)";
			this.canvasContext.font = "24px Helvetica";
			this.canvasContext.textAlign = "left";
			this.canvasContext.textBaseline = "top";
			this.canvasContext.fillText("Goblins caught: " + this.hero.monstersCaught, 32, 32);

			if( game.pauseGame ) {
				console.log("PAUSED");
				game.canvasContext.fillStyle = "#000000";
				game.canvasContext.fillText("PAUSED", (game.canvas.width / 2) - 32, game.canvas.height / 2);
				// return false;
			}
		},
		// Update game objects
		update: function( modifier ) {
			if( this.hero.x <= this.canvas.offsetLeft ) {
				this.hero.x += 1;
				return false;
			}
			if( this.hero.x >= (this.canvas.width - this.canvas.offsetLeft - this.hero.img.width) ) {
				this.hero.x -= 1;
				return false;
			}
			if( this.hero.y <= this.canvas.offsetTop ) {
				this.hero.y += 1;
				return false;
			}
			if( this.hero.y >= (this.canvas.height - this.canvas.offsetTop - this.hero.img.height) ) {
				this.hero.y -= 1;
				return false;
			}

			if (38 in keysDown) { // Player holding up
				this.hero.y -= this.hero.speed * modifier;
			}
			if (40 in keysDown) { // Player holding down
				this.hero.y += this.hero.speed * modifier;
			}
			if (37 in keysDown) { // Player holding left
				this.hero.x -= this.hero.speed * modifier;
			}
			if (39 in keysDown) { // Player holding right
				this.hero.x += this.hero.speed * modifier;
			}

			// Are they touching?
			if (
				this.hero.x <= (this.monster.x + 32) &&
				this.monster.x <= (this.hero.x + 32) &&
				this.hero.y <= (this.monster.y + 32) &&
				this.monster.y <= (this.hero.y + 32)
			) {
				++this.hero.monstersCaught;
				this.reset();
			}
		},
		// Reset the game when the player catches a monster
		reset: function() {
			if (this.canvas) {
				this.hero.x = this.canvas.width / 2;
				this.hero.y = this.canvas.height / 2;

				// Throw the monster somewhere on the screen randomly
				this.monster.x = 32 + (Math.random() * (this.canvas.width - 64));
				this.monster.y = 32 + (Math.random() * (this.canvas.height - 64));
			}
		}
	};

	// Handle keyboard controls
	var keysDown = {};

	addEventListener("keydown", function (e) {
		if( e.keyCode == 27 ) {
			game.pauseGame = !game.pauseGame;
			if( !game.pauseGame ) {
				// unpause
				game.main();
			}
		}

		if( !game.pauseGame ) {
			keysDown[e.keyCode] = true;
		}
	}, false);

	addEventListener("keyup", function (e) {
		delete keysDown[e.keyCode];
	}, false);

	// Let's play this game!
	game.main();
})();
