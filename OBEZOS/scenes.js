Quintus.GameScenes = function(Q){
	Q.scene("start", function(stage){
		setTimeout(function(){Q.audio.play("laugh.mp3");}, 1000);
		stage.insert(new Q.OBEZOS({
			x: Q.width / 2,
			y: (Q.height / 2) - 200
		}));

		stage.insert(new Q.Hiscore());

		stage.insert(new Q.UI.Text({
			label: "When the OBEZOS drones deliver 10 packages, you'll be out of work!",
			x: Q.width / 2,
			y: (Q.height / 2)
		}));
		
		stage.insert(new Q.UI.Text({
			label: "Delivered packages catch on fire! Packages you shoot down contain goodies!",
			x: Q.width / 2,
			y: (Q.height / 2) + 33
		}));
		
		stage.insert(new Q.UI.Button({
			label: 'Play!',
			x: Q.width / 2,
			y: (Q.height / 2) + 80
		}, function() {
			this.destroy();
			Q.state.reset({ drone_delivered: 0, health: 100, score: 0, name: 'AAA'});
			
			Q.stageScene('level1');


		}));
	});

	// ## Level1 scene
	// Create a new scene called level 1
	Q.scene("level1",function(stage) {
		
		Q.audio.play('music.mp3',{ loop: true });
		
		// Add in a repeater for a little parallax action
		// stage.insert(new Q.Repeater({ asset: "background-wall.png", speedX: 0.5, speedY: 0.5 }));

		// Add in a tile layer, and make it the collision layer
		stage.collisionLayer(new Q.TileLayer({
			dataAsset: 'level.json',
			sheet: 'tiles' }));

		player = stage.insert(new Q.Player());

		stage.insert(new Q.OBEZOS());
		
		Q.stageScene("HUD",1);
		
		Q.state.on("change.health", this, function(){
			if (Q.state.get("health") <= 0){
				Q.stageScene("endGame", {label: "You died!"});
			}
		});

		Q.state.on("change.drone_delivered", this, function(){
			if ( Q.state.get("drone_delivered") >= 10 ){
				Q.stageScene("endGame", {label: "Bend at the knee to the OBEZOS."});
			}
		});
	});


	Q.UI.Text.extend("Ammo", {
		init: function(p){
			this._super({
				label: "Ammo: 31",
				x: Q.width - 100,
				y: Q.height-200,
				size: 20
			});
			player.on("fire", this, "changeAmmo");
		},
		changeAmmo: function(ammo) {
			this.p.label = "Ammo: " + ammo;
		}
	});
	Q.UI.Text.extend("Score", {
		init: function(p){
			this._super({
				label: "Score: 0",
				x: 100,
				y: 10,
				size: 20
			});
			Q.state.on("change.score",this,"score");
		},
		score: function(score) {
			this.p.label = "Score: " + score;
		}
	});
	Q.UI.Text.extend("Health", {
		init: function(p){
			this._super({
				label: "Health: 100",
				x: 100,
				y: Q.height - 200,
				size: 20
			});
			Q.state.on("change.health",this,"health");
		},
		health: function(health) {
			this.p.label = "Health: " + health;
		}
	});
	
	Q.UI.Text.extend("Delivered", {
		init: function(p){
			this._super({
				label: "OBEZOS delivered: 0" ,
				x: Q.width - 200,
				y: 10,
				size: 20
			});
			Q.state.on("change.drone_delivered",this,"score");
		},
		score: function(score) {
			this.p.label = "OBEZOS DELIVERED: " + score;
		}
	});

	Q.scene("HUD", function(stage){
		var container = stage.insert(new Q.UI.Container({
			x: 0,
			y: 20,
			fill: "rgba(0,0,0,0.5)"
		}));
		container.insert(new Q.Delivered());
		container.insert(new Q.Ammo());
		container.insert(new Q.Health());
		container.insert(new Q.Score());
		// container.fit(20);
	});

	Q.UI.Text.extend("EnterName", {
		init: function(p){
			this._super({
				label: "Enter your name... Hit FIRE to save. " ,
				x: Q.width / 2,
				y: (Q.height / 2),
				size: 20
			});
		}
	});

	Q.UI.Text.extend("LetterUnderline", {
		index: 0,
		init: function(p){
			this._super({
				label: "_  " ,
				x: Q.width / 2,
				y: (Q.height / 2) + 30,
				size: 40,
				family: "monospace"
			});
			Q.input.on("right", this, "nextLetter");
			Q.input.on("left", this, "prevLetter");
		},
		setUnderline: function(){
			if (this.index === 0){
				this.p.label = "_  ";
			} else if (this.index === 1){
				this.p.label = " _ ";
			} else if (this.index == 2){
				this.p.label = "  _";
			}
		},
		nextLetter: function(){
			if (this.index < 2) this.index++;
			this.setUnderline();
		},
		prevLetter: function(){
			if (this.index > 0) this.index--;
			this.setUnderline();
		}		
	});

	Q.UI.Text.extend("Letters", {
		index: 0,		
		name: function(){ return Q.state.get("name"); },
		currentLetter: function(){ return this.name()[this.index]; },
		
		replaceLetter: function(index, character) {
			return this.name().substr(0, index) + character + this.name().substr(index+character.length);
		},
		
		init: function(p){
			this._super({
				label: Q.state.get("name"),
				x: Q.width / 2,
				y: (Q.height / 2) + 30,
				size: 40,
				family: "monospace"
			});

			Q.input.on("goUp", this, "upLetter");
			Q.input.on("down", this, "downLetter");
			Q.input.on("right", this, "nextLetter");
			Q.input.on("left", this, "prevLetter");
		},

		upLetter: function(){
			var letter = String.fromCharCode(this.currentLetter().charCodeAt() + 1);
			var newName = this.replaceLetter(this.index, letter);
			Q.state.set("name", newName);
			this.p.label = newName;
		},

		downLetter: function(){
			var letter = String.fromCharCode(this.currentLetter().charCodeAt() - 1);
			var newName = this.replaceLetter(this.index, letter);
			Q.state.set("name", newName);
			this.p.label = newName;
		},

		nextLetter: function(){
			if (this.index < 2) this.index++;
		},

		prevLetter: function(){
			if (this.index > 0) this.index--;
		}

	});

Q.UI.Text.extend('Hiscore', {
	counter: 0,
	scores: [],
	addScore: function(score){
		var scores = Q.state.get("hiScores") || [];
		scores.push(score);
		Q.state.set("hiScores", scores);
		Q.state.trigger("change.hiScores");
	},
	getScoreText: function(){
		var label = "";
		var scores = Q.state.get("hiScores");
		scores.forEach(function(score){
			label = label + "\n" + score.name + " " + -1 * score.score;
		});
		return label;
	},
	init: function(){
		this._super({
			label: "Loading scores...",
			x: 150,
			y:  200,
			size: 30,
			align: 'right'
		});
		
		var self = this;
		Q.state.on("change.hiScores", function(){
			self.p.label = self.getScoreText();
		});
		Q.scoreBoard.orderByChild("score").limitToFirst(10).on("child_added", function(snapshot) {
			self.addScore(snapshot.val());
		});
	}
});

Q.scene('endGame', function(stage){
		// Q.audio.stop();
		// Q.audio.play("laugh.mp3");
		var container = stage.insert(new Q.UI.Container({
			x: 0,
			y: 0,
			fill: "rgba(0,0,0,0.5)"
		}));
		container.insert(new Q.EnterName());
		container.insert(new Q.Letters());
		container.insert(new Q.LetterUnderline());
		// container.insert(new Q.Hiscore());
		Q.input.on("fire", this, function(){
			Q.scoreBoard.push({name: Q.state.get("name"), score: -1 * Q.state.get("score")});
			loadGame();
			// Q.clearStages();
			// Q.state.reset({ drone_delivered: 0, health: 100, score: 0, name: Q.state.get("name")});
			// Q.stageScene('level1');
		})
	});	
};
