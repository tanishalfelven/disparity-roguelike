var CAM = {
	create: function() {
		CAM.c = {
			x: (player.c.x*50) - 500, 
			y: (player.c.y*50) - 375
		};
	},
	translate: function(coords) {
		return {
			x: coords.x*50 - CAM.c.x, 
			y: coords.y*50 - CAM.c.y
		};
	},
	update: function() {
		if (player.c.x*50 - CAM.c.x > 700)
			CAM.c.x += 50;
		else if (player.c.x*50 - CAM.c.x < 200)
			CAM.c.x -= 50;
		if (player.c.y*50 - CAM.c.y > 400)
			CAM.c.y += 50;
		else if (player.c.y*50 - CAM.c.y < 200)
			CAM.c.y -= 50;
	}
};

var UI = {
	render: function() {
		// Draw Health Bar
		ctx = REN.ctx;

		// XP bar
		// background
		ctx.fillStyle = 'gray';
		ctx.fillRect(0, 700, 1000, 50);
		// purple xp
		ctx.fillStyle = 'purple';
		ctx.fillRect(5, 705, (player.XP / player.MXP) * 990, 40);
		// slats at 10%
		ctx.fillStyle = 'gray';
		for (var i = 1; i <= 8; i++) {
			ctx.fillRect((i/8) * 1000, 700, 5, 50);
		}

		// Skill bar
		ctx.fillStyle = 'gray';
		ctx.fillRect(250, 645, 500, 50);
		// Render skills statically for now, but eventually we'll want to do something smarter
		REN.static_render({x:2,y:2}, {x:250, y:645});
		REN.renderNum(1, {x:251,y:646}, 4);
		REN.static_render({x:2,y:3}, {x:300, y:645});
		REN.renderNum(2, {x:301,y:646}, 4);
		REN.static_render({x:0,y:3}, {x:350, y:645});
		REN.renderNum(3, {x:351,y:646}, 4);
		REN.static_render({x:6, y:3},{x:400, y:645});
		REN.renderNum(4, {x:401,y:646}, 4);
		REN.renderNum(5, {x:451,y:646}, 4);
		REN.renderNum(6, {x:501,y:646}, 4);
		REN.renderNum(7, {x:551,y:646}, 4);
		REN.renderNum(8, {x:601,y:646}, 4);
		REN.renderNum(9, {x:651,y:646}, 4);
		REN.renderNum(0, {x:701,y:646}, 4);


		// HP bar and MP bar
		ctx.fillStyle = 'gray';
		ctx.fillRect(5, 650, 240, 40);
		ctx.fillRect(755, 650, 240, 40);
		ctx.fillStyle = 'red';
		ctx.fillRect(240 - ((player.HP/player.MHP)*230), 655, (player.HP/player.MHP)*230, 30);
		ctx.fillStyle = 'blue';
		ctx.fillRect(760, 655, (player.MP/player.MMP)*230, 30);

	}
};

var REN = {
	create: function() {
		REN.canvas = document.getElementById("canvas");
		REN.canvas.width = 1000;
		REN.canvas.height = 750;
		REN.ctx = REN.canvas.getContext("2d");
		REN.ctx.imageSmoothingEnabled = false;

		REN.img = new Image();
		REN.img.src = 'spritesheet.png';
	},
	/**
	 * Renders an image based on coordinates
	 * @param  Coordinate sc Source coordinate
	 * @param  Coordinate tc Target coordinate
	 * @return None
	 */
	render: function(sc, tc) {
		tc = CAM.translate(tc);
		REN.ctx.drawImage(REN.img, sc.x*16, sc.y*16, 16, 16, tc.x, tc.y, 50, 50);
	},
	/**
	 * Ignore translating points
	 */
	static_render: function(sc, tc) {
		REN.ctx.drawImage(REN.img, sc.x*16, sc.y*16, 16, 16, tc.x, tc.y, 50, 50);
	},
	renderNum: function(num, tc, scale) {
		var n = NUM['_'+num];
		REN.ctx.drawImage(REN.img, n.x, n.y, n.w, n.h, tc.x, tc.y, 3*scale, 5*scale);
	},
	clear: function() {
		REN.ctx.fillStyle = 'black';
		REN.ctx.fillRect(0, 0, 1000, 750);
	}
};

var map = {
	addRoom: function(_x, _y, width, height) {
		for (var x = _x; x < _x+width; x++) {
			for (var y = _y; y < _y+height; y++) {
				map.rooms.push({x:x, y:y});
			}
		}
		map.addWall(_x, _y-1, width, 1);
	},
	addWall: function(_x, _y, width, height) {
		for (var x = _x; x < _x+width; x++) {
			for (var y = _y; y < _y+height; y++) {
				if (!map.isRoom(x, y))
					map.walls.push({x:x, y:y});
			}
		}
	},
	addDecor: function(x, y, decor) {
		map.decor.push({x:x, y:y, decor:decor, frame:0, delta:0});
	},
	isRoom: function(x, y) {
		for (var i = 0; i < map.rooms.length; i++) {
			if (map.rooms[i].x === x && map.rooms[i].y === y) {
				return true;
			}
		}
		return false;
	},
	render: function() {
		for (var i = 0; i < map.rooms.length; i++) {
			REN.render({x:1, y:1}, map.rooms[i]);
		}
		for (var i = 0; i < map.walls.length; i++) {
			REN.render({x:0, y:1}, map.walls[i]);
		}
		for (var i = 0; i < map.decor.length; i++) {
			REN.render(animations[map.decor[i].decor][map.decor[i].frame], map.decor[i]);

			map.decor[i].delta += GAME.delta;
			if (map.decor[i].delta > .1) {
				map.decor[i].delta = 0;
				if (map.decor[i].frame+1 < animations[map.decor[i].decor].length) {
					map.decor[i].frame++;
				} else {
					map.decor[i].frame = 0;
				}
			}
		}
	},
	create: function() {
		map.rooms = [];
		map.walls = [];
		map.decor = [];

		// Create room code
		map.addRoom(0, 0, 7, 7);
		map.addRoom(3, 6, 1, 10);
		map.addDecor(0, -1, 'torch');
		map.addDecor(6, -1, 'torch');
		map.addRoom(7, 3, 20, 1);
		map.addRoom(27, 3, 5, 5);
		map.addRoom(3, 16, 14, 1);
		map.addRoom(17, 3, 1, 14);

		// Add minotaur
		setInterval(function() {
			MONS.register({
				x: Math.round(Math.random() * 7),
				y: Math.round(Math.random() * 7),
				HP:12,MHP:12,
				move_speed: .5, 
				move_delta: 0,
				update: Math.round(Math.random()) ? MONS.ai.guard_vertical : MONS.ai.guard_horizontal,
				render: MONS.drawing.minotaur, 
				dir: 1
			});
		}, 5000);
	},
};

var NUM = {
	_1: {
		x: 0, y: 0,
		w: 3, h: 5,
	},
	_2: {
		x: 3, y: 0,
		w: 3, h: 5,
	},
	_3: {
		x: 6, y: 0,
		w: 3, h: 5,
	},
	_4: {
		x: 9, y: 0,
		w: 3, h: 5,
	},
	_5: {
		x: 12, y: 0,
		w: 3, h: 5,
	},
	_6: {
		x: 0, y: 5,
		w: 3, h: 5,
	},
	_7: {
		x: 3, y: 5,
		w: 3, h: 5,
	},
	_8: {
		x: 6, y: 5,
		w: 3, h: 5,
	},
	_9: {
		x: 9, y: 5,
		w: 3, h: 5,
	},
	_0: {
		x: 12, y: 5,
		w: 3, h: 5,
	}
};

var key = {
	LEFT: 97,
	DOWN: 115,
	UP: 119,
	RIGHT: 100,
	_1: 49,
	_2: 50,
	_3: 51,
	_4: 52,
	_5: 53,
	_6: 54,
	_7: 55,
	_8: 56,
	_9: 57,
	_0: 48
};

var INP = {
	create: function() {
		INP.dir = -1;

		window.addEventListener('keypress', function(e) {
			switch (e.which) {
				case key.LEFT:
				case key.DOWN:
				case key.UP:
				case key.RIGHT:
					INP.dir = e.which;
					break;
				case key._1:
					player.castSpell(1);
					break;
				case key._2:
					player.castSpell(2);
					break;
				case key._3:
					player.castSpell(3);
					break;
				case key._4:
					player.castSpell(4);
					break;
			}
		});
	},
	getDirection: function() {
		// We need to reset the INP.dir so
		// when it is next referenced we don't
		// have a false positive.
		var dir = INP.dir;
		INP.dir = -1;
		return dir;
	}
};

var animations = {
	'fireball': [
		{x: 3, y:0},
		{x: 4, y:0},
		{x: 5, y:0}
	],
	'torch': [
		{x:2, y:1},
		{x:3, y:1},
		{x:4, y:1}
	],
	'reality-tear': [
		{x:3, y:2},
		{x:4, y:2},
		{x:5, y:2}
	],
	'spark-green': [
		{x:3, y:3},
		{x:4, y:3},
		{x:5, y:3}
	],
	'dog': [
		{x:6, y:0}
	]
};

// Bad method name
function hitObject(x, y, damage) {
	var hit = false;
	// Hit player
	var mons = MONS.collides(x, y, damage);
	if (x === player.c.x && y === player.c.y) {
		dealDamage(damage, player);
		hit = true;
	}
	// Hit monster
	else if (mons) {
		dealDamage(damage, mons);
		hit = true;
	}
	return hit;
};

function dealDamage(damage, creature) {
	creature.HP -= damage;
	if (creature.HP < 1 && creature != player) {
		player.XP += 5;
	}
	var c = creature.c || creature;
	ENT.register({
		render: function(self) {
			REN.renderNum(damage, CAM.translate({x:self.x, y:self.y}), 3);
		},
		x: c.x,
		y: c.y,
		dir: key.UP,
		deathDelta: 0,
		deathTime: .5,
		doesDamage: false,
		speed: 1
	});
};

var MONS = {
	create: function() {
		MONS._ = [];
	},
	collides: function(x, y, damage) {
		for (var i = 0; i < MONS._.length; i++) {
			var m = MONS._[i];
			if (m.x === x && m.y === y) {
				return m
			}
		}
		return false;
	},
	register: function(monster) {
		MONS._.push(monster);
	},
	update: function() {
		for (var i = 0; i < MONS._.length; i++) {
			var m = MONS._[i];
			if (m.HP < 1) {
				MONS._.splice(i, 1);
				continue;
			}
			m.update(m);
		}
	},
	render: function() {
		for (var i = 0; i < MONS._.length; i++) {
			var m = MONS._[i];
			m.render(m);
			MONS.renderHP(m);
		}
	},
	renderHP: function(self) {
		var p = CAM.translate({x:self.x, y:self.y});
		var ctx = REN.ctx;
		ctx.fillStyle = 'gray';
		ctx.fillRect(p.x, p.y + 40, 50, 5);
		var per = self.HP / self.MHP;
		if (per > .7) ctx.fillStyle = 'green';
		else if (per > .5) ctx.fillStyle = 'yellow';
		else if (per > .3) ctx.fillStyle = 'orange';
		else if (per > 0) ctx.fillStyle = 'red';
		ctx.fillRect(p.x, p.y + 40, 50*per, 5);
	},
	// ai methods represent the update methods for different ai's
	ai: {
		guard_horizontal: function(self) {
			self.move_delta += GAME.delta;
			if (self.move_delta >= self.move_speed) {
				self.move_delta = 0;
				if (map.isRoom(self.x + self.dir, self.y)) {
					self.x += self.dir;
					if (self.x === player.c.x && self.y === player.c.y)
						dealDamage(Math.round(Math.random() * 7), player);
				} else {
					self.dir *= -1;
					self.update(self);
				}
			}
		},
		guard_vertical: function(self) {
			self.move_delta += GAME.delta;
			if (self.move_delta >= self.move_speed) {
				self.move_delta = 0;
				if (!self.dir)
					self.dir = 1;
				if (map.isRoom(self.x, self.y + self.dir)) {
					self.y += self.dir;
					if (self.x === player.c.x && self.y === player.c.y)
						dealDamage(Math.round(Math.random() * 7), player);
				} else {
					self.dir *= -1;
					self.update(self);
				}
			}
		}
	},
	// drawing methods represent the render methods for different monsters
	drawing: {
		minotaur: function(self) {
			if (self.dir === -1) {
				REN.render({x: 0, y: 2}, {x: self.x, y: self.y});
			} else {
				REN.render({x: 1, y: 2}, {x: self.x, y: self.y});
			}
		}
	}
};

var ENT = {
	create: function() {
		ENT._ = [];
	},
	register: function(entity) {
		ENT._.push(entity);
	},
	update: function() {
		for (var i = 0; i < ENT._.length; i++) {
			var e = ENT._[i];
			switch(e.dir) {
				case key.LEFT:
					e.x -= e.speed * GAME.delta;
					break;
				case key.RIGHT:
					e.x += e.speed * GAME.delta;
					break;
				case key.UP:
					e.y -= e.speed * GAME.delta;
					break;
				case key.DOWN:
					e.y += e.speed * GAME.delta;
					break;
			}
			if (e.doesDamage)
				if (((e.dir === key.LEFT || e.dir === key.UP) && (!map.isRoom(Math.floor(e.x), Math.floor(e.y)) || hitObject(Math.floor(e.x), Math.floor(e.y), e.damage)))
					|| (( e.dir === key.DOWN || e.dir === key.RIGHT) && (!map.isRoom(Math.ceil(e.x), Math.ceil(e.y)) || hitObject(Math.ceil(e.x), Math.ceil(e.y), e.damage)))) {
					ENT._.splice(i, 1);
					continue;
				}
			e.delta += GAME.delta;
			if (e.delta > .1) {
				e.delta = 0;
				e.frame += 1;
				if (e.frame >= animations[e.animation].length) {
					e.frame = 0;
				}
			}
			if (!e.doesDamage && typeof(e.deathDelta) === 'number' && typeof(e.deathTime) === 'number') {
				e.deathDelta += GAME.delta;
				if (e.deathDelta > e.deathTime) {
					ENT._.splice(i, 1);
					continue;
				}
			}
		}
	},
	render: function() {
		for (var i = 0; i < ENT._.length; i++) {
			var e = ENT._[i];
			if (e.render)
				e.render(e);
			else
				REN.render(animations[e.animation][e.frame], {x:e.x,y:e.y});
		}
	}
};

var player = {
	create: function() {
		player.img = {x: 1, y: 0};
		player.c = {x: 3, y: 4};
		player.XP = 0;
		player.MXP = 10;
		player.HP = 20;
		player.MHP = 20;
		player.MP = 20;
		player.MMP = 20;
		player.lvl = 1;
		player.dir = key.RIGHT;
		player.MPregen = 1;
		player.MPdelta = 0;
		player.MPwait = 1;
	},
	castSpell: function(index) {
		if (index === 1 && player.MP >= 3) {
			player.MP -= 3;
			// Fireball
			ENT.register({
				x: player.c.x,
				y: player.c.y,
				doesDamage: true,
				damage: Math.round(Math.random() * (player.lvl)) + 1,
				animation: 'fireball',
				frame: 0,
				speed: 5,
				dir: player.dir,
				delta: 0
			});
		} else if (index === 2 && player.MP >= 5) {
			player.MP -= 5;
			//Teleport thinger
			ENT.register({
				x:player.c.x,
				y:player.c.y,
				doesDamage:false,
				animation: 'reality-tear',
				frame: 0,
				speed: 0,
				dir: 0,
				delta: 0,
				deathDelta: 0,
				deathTime: .3,
			});
			// Find farthest point the player is facing, and teleport them there
			var newX = player.c.x
			  , newY = player.c.y;
			while(map.isRoom(newX, newY)) {
				if (player.dir === key.LEFT)
					newX--;
				else if (player.dir === key.RIGHT)
					newX++;
				else if (player.dir === key.UP)
					newY--;
				else if (player.dir === key.DOWN)
					newY++;
			}
			if (player.dir === key.LEFT)newX++;
			else if (player.dir === key.RIGHT)newX--;
			else if (player.dir === key.UP)newY++;
			else if (player.dir === key.DOWN)newY--;
			player.c.x = newX;
			player.c.y = newY;
		} else if (index === 3 && player.MP > 1 && player.HP < player.MHP) {
			player.MP--;
			player.HP++;
			ENT.register({
				x:player.c.x,
				y:player.c.y,
				doesDamage:false,
				animation: 'spark-green',
				frame: 0,
				speed: 0,
				dir: 0,
				delta: 0,
				deathDelta: 0,
				deathTime: .5
			});
		} else if (index === 4 && player.MP > 4) {
			player.MP -= 4;
			ENT.register({
				x: player.c.x,
				y: player.c.y,
				doesDamage: true,
				damage: Math.round(Math.random() * (player.lvl)) + 8,
				animation: 'dog',
				frame: 0,
				speed: 5,
				dir: player.dir,
				delta: 0
			});
		}
	},
	update: function() {
		var dir = INP.getDirection();
		if (dir !== -1) {
			player.dir  = dir;
			switch(dir) {
				case key.LEFT:
					player.img.x = 2;
					if (map.isRoom(player.c.x-1, player.c.y))
						player.c.x -= 1;
					break;
				case key.RIGHT:
					player.img.x = 1;
					if (map.isRoom(player.c.x+1, player.c.y))
						player.c.x += 1;
					break;
				case key.DOWN:
					if (map.isRoom(player.c.x, player.c.y+1))
						player.c.y += 1;
					break;
				case key.UP:
					if (map.isRoom(player.c.x, player.c.y-1))
						player.c.y -= 1;
					break;
			}
		}
		player.updateMP();
		if (player.HP < 1) {
			player.HP = player.MHP;
			player.MP = player.MMP;
		}
		if (player.XP >= player.MXP) {
			player.MMP *= 1.5;
			player.MHP *= 1.5;
			player.XP = 0;
			player.MXP *= 2;
		}
	},
	updateMP: function() {
		player.MPdelta += GAME.delta;
		if (player.MPdelta >= player.MPwait) {
			player.MPdelta = 0;
			if (player.MP < player.MMP)
				player.MP += player.MPregen;
		}
	},
	render: function() {
		REN.render(player.img, player.c);
	}
};

var GAME = {
	update: function() {
		GAME.setDelta();
		player.update();
		CAM.update();
		ENT.update();
		MONS.update();
	},
	render: function() {
		REN.clear();

		map.render();
		MONS.render();
		player.render();
		ENT.render();

		UI.render();
	},
	loop: function() {
		GAME.update();
		GAME.render();
		GAME.id = requestAnimationFrame(GAME.loop);
	},
	start: function() {
		// init code goes here
		REN.create();
		INP.create();
		player.create();
		MONS.create();
		CAM.create();
		map.create();
		ENT.create();
		GAME.id = requestAnimationFrame(GAME.loop);
		// Start Delta
		GAME.then = Date.now();
	},
	setDelta: function() {
		GAME.now = Date.now();
		GAME.delta = (GAME.now - GAME.then) / 1000;
		GAME.then = GAME.now;
	},
	end: function() {
		if (GAME.id)
			cancelAnimationFrame(GAME.id);
	}
};

window.onload = function() {
	GAME.start();
};