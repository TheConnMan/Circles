/*
 * OPTIONS
 * Required
 * title - Title of the level
 * momentum - Total momentum of each circle, can be function
 * ballNum - Number of circles
 * expandSpeed - Expansion speed of the user's circle, can be function
 * 
 * One of the following sets
 * avgSize, sizeVar - Average radius of a circle, variance of the circle radius
 * r - Radius of each node, can be a function
 * 
 * Optional
 * angle - Starting angle of each node, can be a function
 * randAngleInt - Interval in milliseconds when each circle gets a new, random angle
 * contributor - Contributor of the level
 */

var defaultPhysics = {
	dx: function(d, r) { return r; },
	dy: function(d, r) { return r; },
	x: function(d, w, h) { return d.x; },
	y: function(d, w, h) { return d.y; },
	rx: function(d, w, h) { return (Math.PI - d.r) % (2 * Math.PI); },
	ry: function(d, w, h) { return 2 * Math.PI - d.r; },
	xx: function(d, m, r) { return m / (r * r) * Math.cos(d.r); },
	yy: function(d, m, r) { return m / (r * r) * Math.sin(d.r); }
}, ghostPhysics = {
	dx: function(d, r) { return 0; },
	dy: function(d, r) { return 0; },
	x: function(d, w, h) { return (d.x + w) % w; },
	y: function(d, w, h) { return (d.y + h) % h; },
	rx: function(d, w, h) { return d.r; },
	ry: function(d, w, h) { return d.r; },
	xx: function(d, m, r) { return m / (r * r) * Math.cos(d.r); },
	yy: function(d, m, r) { return m / (r * r) * Math.sin(d.r); }
};
var levels = {
		1: {title: 'Easy Peasy', avgSize: 15, sizeVar: 5, momentum: 100, ballNum: 10, expandSpeed: 1},
		2: {title: 'Lemon Squeezy', avgSize: 15, sizeVar: 5, momentum: 100, ballNum: 15, expandSpeed: 1},
		3: {title: 'Rapid Expansion', avgSize: 30, sizeVar: 5, momentum: 800, ballNum: 10, expandSpeed: 1},
		4: {title: 'Slow Mo', avgSize: 25, sizeVar: 5, momentum: 100, ballNum: 10, expandSpeed: .25},
		5: {title: 'Light Speed', avgSize: 15, sizeVar: 5, momentum: 600, ballNum: 10, expandSpeed: 3},
		6: {title: 'Atoms', avgSize: 5, sizeVar: 0, momentum: 25, ballNum: 25, expandSpeed: 1.5},
		7: {title: 'Big Ben', avgSize: 200, sizeVar: 0, momentum: 50000, ballNum: 1, expandSpeed: 1},
		8: {title: 'Zoom Zoom', avgSize: 10, sizeVar: 5, momentum: 200, ballNum: 10, expandSpeed: 2},
		9: {title: 'Conservation of Momentum', r: function(o) { return 30 + 10 * Math.cos(2 * Math.PI * (new Date() / 1000 + o) / 2); }, momentum: 300, ballNum: 10, expandSpeed: 1},
		10: {title: 'Tadpoles', r: function(o) { return 20 + 10 * Math.cos(2 * Math.PI * (new Date() / 1000 + o)); }, momentum: 100, ballNum: 20, expandSpeed: 1},
		11: {title: 'Crossing Traffic', avgSize: 20, sizeVar: 5, angle: function(o) { return o > .5 ? Math.PI : 0; }, momentum: 400, ballNum: 15, expandSpeed: 1},
		12: {title: 'Stop and Start', avgSize: 20, sizeVar: 5, randAngleInt: 1000, momentum: 300, ballNum: 20, expandSpeed: 1},
		13: {title: 'What Is Happening', r: function(o) { return 20 + 10 * Math.cos(2 * Math.PI * (new Date() / 1000 + o)); }, randAngleInt: 1000, momentum: 300, ballNum: 20, expandSpeed: 1},
		14: {title: 'Revenge of Slow Mo', avgSize: 20, sizeVar: 5, momentum: 100, ballNum: 15, expandSpeed: .25},
		15: {title: 'Double Ben', avgSize: 150, sizeVar: 0, momentum: 30000, ballNum: 2, expandSpeed: .75},
		16: {title: 'Bumble Bees', avgSize: 7.5, sizeVar: 0, randAngleInt: 250, momentum: 40, ballNum: 20, expandSpeed: 1},
		17: {title: 'Crossing the Intersection', avgSize: 20, sizeVar: 5, angle: function(o) { return Math.floor(4 * o) * Math.PI / 2; }, momentum: 400, ballNum: 15, expandSpeed: 1},
		18: {title: 'Gotta Be Quick', r: function(o) { return 20 + 15 * Math.cos(2 * Math.PI * (new Date() / 1000 + o)); }, momentum: 400, ballNum: 5, expandSpeed: 1},
		19: {title: 'Newton\'s Folly', avgSize: 20, sizeVar: 5, momentum: function(o) { return 400 + 300 * Math.cos(2 * Math.PI * (new Date() / 1000 + o)); }, ballNum: 15, expandSpeed: 1},
		20: {title: 'Step Review', r: function(o) { return 10 + 15 * (Math.floor(new Date() / 1000) % 5); }, momentum: 300, ballNum: 15, expandSpeed: 1},
		21: {title: 'I Feel Like I\'m Taking Crazy Pills', r: function(o) { return 10 + 15 * (Math.floor(new Date() / 1000 + o * 5) % 5); }, momentum: 300, ballNum: 15, expandSpeed: 1},
		22: {title: 'Nope', avgSize: 10, sizeVar: 7.5, momentum: 300, ballNum: 2, expandSpeed: .25, contributor: 'Matt' },
		23: {title: 'Woah There', avgSize: 20, sizeVar: 5, momentum: 350, ballNum: 15, expandSpeed: function(d) { return 1 + Math.cos(2 * Math.PI * (new Date() / 1000 + d.o)); }},
		24: {title: 'So Close', avgSize: 20, sizeVar: 5, momentum: 200, ballNum: 10, expandSpeed: function(d) { return d.radius > 100 ? .5 : .0075 * (105 - d.radius); }},
		25: {title: 'Ghosts', avgSize: 15, sizeVar: 5, momentum: 200, ballNum: 15, expandSpeed: 1, physics: ghostPhysics},
		26: {title: 'Matrix', avgSize: 15, sizeVar: 5, momentum: 250, ballNum: 15, angle: Math.PI / 2, expandSpeed: 1, physics: ghostPhysics},
		27: {title: 'Inchworms', avgSize: 15, sizeVar: 5, momentum: function(o) { return 150 + 200 * Math.cos(2 * Math.PI * (new Date() / 1000 + o)); }, ballNum: 20, angle:3 *  Math.PI / 2, expandSpeed: 1},
		28: {title: 'Inchworm Ghosts', avgSize: 15, sizeVar: 5, momentum: function(o) { return 150 + 200 * Math.cos(2 * Math.PI * (new Date() / 1000 + o)); }, ballNum: 20, angle:3 *  Math.PI / 2, expandSpeed: 1, physics: ghostPhysics},
		29: {title: 'Non-Conformist Inchworm Ghosts', avgSize: 15, sizeVar: 5, randAngleInt: 1000, momentum: function(o) { return 150 + 200 * Math.cos(2 * Math.PI * (new Date() / 1000 + o)); }, ballNum: 20, angle:3 *  Math.PI / 2, expandSpeed: 1, physics: ghostPhysics},
		30: { title: "Impossible by Homie G", momentum: 5, ballNum: 50, expandSpeed: 3, randAngleInt: 5000, avgSize: 25, sizeVar: 0 },
		31: { title: "Try Your Best by Jack W", momentum: 625, ballNum: 15, expandSpeed: 1, randAngleInt: 0, avgSize: 25, sizeVar: 0 },
		32: { title: "Heck by Myla L", momentum: 320, ballNum: 40, expandSpeed: 0.5, randAngleInt: 2000, avgSize: 40, sizeVar: 10 }
};
var custom = {}, current, successColor = 'lightblue', moveInterval, defaultInterval;

$(document).ready(function() {
	$('#customButtons').hide();
	gameW = $('#game').width(), gameH = $('#game').width();
	if (window.localStorage['circleCustom']) {
		custom = JSON.parse(window.localStorage['circleCustom'])
	}
	var sto = window.localStorage['bestCircleScores']
	if (!sto || typeof(JSON.parse(sto)) != 'object' || !JSON.parse(sto)[1]) {
		window.localStorage['bestCircleScores'] = JSON.stringify({1: 0})
		init(1)
		$('#levelEnd').reveal({
		     animation: 'fadeAndPop',
		     animationspeed: 300,
		     closeonbackgroundclick: true,
		     dismissmodalclass: 'close'
		});
	} else {
		renumberCustom()
		var a = getFinishedLevels();
		if (a.length != Object.keys(levels).length && parseInt(a[a.length - 1]) <= a.length) {
			init(parseInt(a[a.length - 1]) + 1);
		} else {
			init(a[a.length - 1]);
		}
		if (a.length >= 10) {
			$('#custom').show();
		}
	}
	$("#pop")[0].load();
	$("#tada")[0].load();
	$("#tada")[0].volume = .1;
	!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
})

function init(level) {
	d3.select("#game").selectAll('svg').remove();

	var svg = d3.select("#game").append("svg:svg")
				.attr("width", gameW).attr("height", gameH).attr("id", "svg");
	
	svg.append('rect').attr('width', gameW - 200).attr('height', gameH - 200)
		.style('stroke-width', .5).style('fill', 'white').attr('stroke', 'gray').attr('transform', 'translate(100,100)')

	svg.on('contextmenu', function() {
		d3.event.preventDefault();
	})
	
	var params = levels[level]
	if (!params) {
		params = custom[level]
		$('#customButtons').show()
		$('#delete').unbind('click');
		$('#delete').click(function() {
			clearInterval(defaultInterval);
			if (moveInterval) {
				clearInterval(moveInterval);
			}
			delete custom[level];
			['bestCircleScores', 'circleCustom'].forEach(function(d) {
				var sto = JSON.parse(window.localStorage[d]);
				delete sto[level];
				window.localStorage[d] = JSON.stringify(sto);
			})
			renumberCustom();
			$('#customButtons').hide();
			var a = getFinishedLevels();
			if (a.length != Object.keys(levels).length) {
				init(parseInt(a[a.length - 1]) + 1);
			} else {
				init(a[a.length - 1]);
			}
		})
	}

	$('#title').html('Level ' + level + ' - ' + params.title)
	$('#lastScore').html('0');
	if (params.contributor) {
		$('#contributor').html('Contributed by ' + params.contributor);
	} else {
		$('#contributor').html('');
	}
	var best = JSON.parse(window.localStorage['bestCircleScores'])
	if (!best[level]) {
		best[level] = 0
		window.localStorage['bestCircleScores'] = JSON.stringify(best)
	}
	initLevels(Object.keys(levels).concat(Object.keys(custom)), Object.keys(JSON.parse(window.localStorage['bestCircleScores'])), level)
	$('#best').html(best[level])
	
	if (Object.keys(custom).indexOf(level.toString()) != -1) {
		current = params;
	} else {
		current = null;
	}
	
	var color = d3.scale.category10();
	var nodes = d3.range(params.ballNum).map(function() {
		var r;
		var rad;
		var o = Math.random()
		if (params.r) {
			r = params.r(o)
			rad = params.r
		} else {
			r = params.avgSize + Math.floor(2 * params.sizeVar * Math.random()) - params.sizeVar;
			rad = r
		}
		return {radius: rad,
			x: Math.random() * (gameW - 2 * r) + r,
			y: Math.random() * (gameH - 2 * r) + r,
			m: params.momentum,
			r: (params.angle ? ($.isFunction(params.angle) ? params.angle(o) : params.angle) : Math.random() * 2 * Math.PI),
			int: (params.randAngleInt ? params.randAngleInt : 0),
			lastChange: (params.randAngleInt ? new Date().getTime() : 0),
			dx: 0, dy: 0, o: o, physics: params.physics};
	})
	var moveNode;
	var moveCircle;
	var moveBool = false
	
	circles = svg.selectAll(".circle")
		.data(nodes).enter()
		.append("svg:circle")
		.attr("class", "circle")
		.attr("r", function(d) { return ($.isFunction(d.radius) ? d.radius(d.o) : d.radius); })
		.attr("transform", function(d) { return 'translate(' + d.x + ', ' + d.y + ')'; })
		.style("fill", function(d, i) { return color(i % 5); })
		
	svg.on('mousedown', function() {
		if (!moveBool) {
			var co = d3.mouse(this)
			moveNode = [{radius: 1, x: co[0], y: co[1], o: Math.random()}]
			moveCircle = svg.selectAll(".move").data(moveNode).enter()
				.append("svg:circle")
				.attr("class", "move")
				.attr("r", function(d) { return d.radius; })
				.attr("transform", function(d) { return 'translate(' + d.x + ', ' + d.y + ')rotate(270)'; })
			moveInterval = setInterval(expand, 1)
			moveBool = true
		}
	})
	
	defaultInterval = setInterval(redraw, 1)
			
	function redraw() {
		nodes.forEach(function(d) {
			var r = ($.isFunction(d.radius) ? d.radius(d.o) : d.radius);
			var m = ($.isFunction(d.m) ? d.m(d.o) : d.m);
			var physics = d.physics ? d.physics : defaultPhysics;
			if (d.y >= gameH - physics.dy(d, r) || d.y <= physics.dy(d, r)) {
				d.y = physics.y(d, gameW, gameH);
				d.r = physics.ry(d, gameW, gameH);
			}
			if (d.x >= gameW - physics.dx(d, r) || d.x <= physics.dx(d, r)) {
				d.x = physics.x(d, gameW, gameH);
				d.r = physics.rx(d, gameW, gameH);
			}
			d.x += physics.xx(d, m, r);
			d.y += physics.yy(d, m, r);
			if (d.int && new Date().getTime() > d.lastChange + d.int) {
				d.r = 2 * Math.random() * Math.PI;
				d.lastChange = new Date().getTime();
			}
		})
		svg.selectAll(".circle").attr("r", function(d) { return ($.isFunction(d.radius) ? d.radius(d.o) : d.radius); })
		circles.attr("transform", function(d) { return 'translate(' + d.x + ', ' + d.y + ')'; })
	}
	
	function expand() {
		moveNode.forEach(function(d) {
			var speed = $.isFunction(params.expandSpeed) ? params.expandSpeed(d) : params.expandSpeed;
			d.radius += speed / 5;
			var collide = false
			nodes.forEach(function(n) {
				if (($.isFunction(n.radius) ? n.radius(n.o) : n.radius) + d.radius >= Math.sqrt(Math.pow(d.x - n.x, 2) + Math.pow(d.y - n.y, 2))) {
					collide = true
				}
			})
			if (d.x + d.radius >= gameW || d.x - d.radius <= 0 || d.y + d.radius >= gameH || d.y - d.radius <= 0) {
				collide = true
			}
			if (collide) {
				clearInterval(defaultInterval);
				clearInterval(moveInterval);
				levelEnd(Math.floor(d.radius), level);
			}
		})
		
		d3.select('.move').attr('stroke-dasharray', function(d) { var w = 2 * Math.PI * d.radius * d.radius / 100; return w + ',' + (2 * Math.PI * 100 - w); })
			.attr('stroke', successColor)
			.attr('stroke-width', function(d) { return (d.radius >= 100 ? 0 : 3); })
			.attr('fill', function(d) { return (d.radius >= 100 ? successColor : 'black'); })
		moveCircle.attr("r", function(d) { return d.radius; })
	}
}

function levelEnd(s, level) {
	var best = JSON.parse(window.localStorage['bestCircleScores'])
	if (pass(s)) {
		$("#tada")[0].play();
		var html;
		html = '<h1>You Completed Level ' + level + '</h1>';
		html += '<p>Your score was ' + s + '.</p>';
		if (best[level] < s && best[level] != 0) {
			html += '<p>New high score!</p>';
		}
		if (level == Object.keys(levels).length) {
			html += '<h1>Congratulations! You beat all the levels!</h1><p>You must have been here a while...</p>';
			html += '<p>Try building some of your own levels or shoot me an email telling me your favorite level at <a href="mailto:brian@theconnman.com">brian@theconnman.com</a>!</p>';
		}
		if (levels[parseInt(level) + 1] || custom[parseInt(level) + 1]) {
			html += '<button class="close" onclick="init(' + (parseInt(level) + 1) + ')">Next Level</button>';
		} else {
			html += '<button class="close" onclick="init(' + level + ')">Retry Level</button>';
		}
		if (level == 9) {
			html += "<p>Congratulations, you've beaten 10 of the levels! Now you can build your own!</p>";
			$('#custom').show();
			html += '<button class="close" onclick="window.location.href=\'#custom\'">Build My Own</button>';
		}
		$('#modalContent').html(html);
		$('#levelEnd').reveal({
		     animation: 'fadeAndPop',
		     animationspeed: 300,
		     closeonbackgroundclick: false,
		     dismissmodalclass: 'close'
		});
	} else { 
		$("#pop")[0].play();
		init(level);
		$('#lastScore').html(s);
	}
	if (best[level] < s) {
		best[level] = s
		window.localStorage['bestCircleScores'] = JSON.stringify(best)
		$('#best').html(s)
	}
}

function initLevels(all, open, cur) {
	d3.select("#levels").html('')
	
	var w = 370, perRow = 14, rw = w / perRow, pad = 2, h = rw * (1 + Math.floor(all.length / perRow));
	var svg = d3.select("#levels").append("svg:svg")
		.attr("width", w).attr("height", h).attr("id", "levelSvg");
	
	var nodes = d3.range(all.length).map(function(d) {
		return { level: all[d], open: (open.indexOf(all[d]) != -1), h: rw - 2 * pad, w: rw - 2 * pad, x: (d * rw) % w + pad, y: Math.floor(d / perRow) * rw + pad };
	})

	var root = svg.selectAll(".level")
		.data(nodes).enter()
		.append("g")
		.attr("width", function(d) { return d.w; })
		.attr("height", function(d) { return d.h; })
	var rect = root
		.append("svg:rect")
		.attr("class", "level")
		.attr("x", function(d) { return d.x; })
		.attr("y", function(d) { return d.y; })
		.attr("width", function(d) { return d.w; })
		.attr("height", function(d) { return d.h; })
		.style("fill", function(d) { return (d.level == cur ? 'blue' : (d.open ? 'lightblue' : 'gray')); })
	root.append('text')
		.attr('class', 'levelText')
		.attr("transform", function(d) { return 'translate(' + (d.x + d.w / 2) + ',' + (d.y + d.h / 2 + 6) + ')'; })
		.text(function(d) { return d.level; });
	
	root.on('click', function(d) {
		if (d.open) {
			if (defaultInterval) {
				clearInterval(defaultInterval);
			}
			if (moveInterval) {
				clearInterval(moveInterval);
			}
			init(d.level);
		}
	})
}

function getFinishedLevels() {
	var scores = JSON.parse(window.localStorage['bestCircleScores']);
	var levelKeys = Object.keys(levels);
	var finished = []
	levelKeys.forEach(function(d) {
		if (pass(scores[d])) {
			finished.push(d)
		}
	})
	return finished;
}

function pass(r) {
	return r >= 100
}

function build() {
	var num = Object.keys(levels).length + Object.keys(custom).length + 1;
	var t = $('#buildTitle').val(), n = parseInt($('#buildNum').val()),
		size = parseInt($('#buildSize').val()), v = $('#buildVariance').val() * size,
		speed = parseFloat($('#buildSpeed').val()), e = parseFloat($('#buildExpansion').val()),
		interval = parseInt($('#buildInterval').val()), period = parseInt($('#buildPeriod').val()),
		angle = parseInt($('#buildAngle').val());
	if (t && n) {
		var obj = {title: t, momentum: size * size * speed / 5, ballNum: n, expandSpeed: e, randAngleInt: interval};
		if (period) {
			obj.r = function(o) { return size + v * Math.cos(2 * Math.PI * (new Date() / period + o)); };
		} else {
			obj.avgSize = size;
			obj.sizeVar = v;
		}
		if (angle) {
			obj.angle = function(o) { return Math.floor(angle * o) * 2 * Math.PI / angle; };
		}
		custom[num] = obj;
		window.localStorage['circleCustom'] = JSON.stringify(custom);
		init(num)
	} else {
		var html = '<h1>Error</h1>';
		html += '<p>Your title or number of circles was invalid.</p>';
		html += '<button class="close">My b</button>';
		$('#modalContent').html(html);
		$('#levelEnd').reveal({
		     animation: 'fadeAndPop',
		     animationspeed: 300,
		     closeonbackgroundclick: true,
		     dismissmodalclass: 'close'
		});
	}
}

function randomLevel() {
	var num = Object.keys(levels).length + Object.keys(custom).length + 1;
	var t = 'Random Level', size = Math.floor(Math.random() * 30) + 5, v = size * Math.random() * .5,
		speed = Math.random() * 14 + 1, e = Math.random() < .5 ? Math.random() * 2 + .25 : 1,
		interval = Math.random() < .1 ? Math.random() * 1000 + 500 : 0, period = Math.random() * 4700 + 300;;
	var obj = {title: t, momentum: size * size * speed / 5, ballNum: Math.floor(Math.random() * 15 + 5), expandSpeed: e, randAngleInt: interval};
	if (Math.random() < .1) {
		obj.r = function(o) { return size + v * Math.cos(2 * Math.PI * (new Date() / period + o)); };
	} else {
		obj.avgSize = size;
		obj.sizeVar = v;
	}
	if (Math.random() < .1) {
		var angle = Math.floor(Math.random() * 9) + 1;
		obj.angle = function(o) { return Math.floor(angle * o) * 2 * Math.PI / angle; };
	}
	custom[num] = obj;
	window.localStorage['circleCustom'] = JSON.stringify(custom);
	init(num)
}

function renumberCustom() {
	var levelKeys = Object.keys(levels)
	var levelMax = levelKeys[levelKeys.length - 1]
	var customKeys = Object.keys(custom)
	var temp = {}
	var best = JSON.parse(window.localStorage['bestCircleScores']);
	var bestTemp = JSON.parse(window.localStorage['bestCircleScores']);
	customKeys.forEach(function(d, i) {
		delete bestTemp[d]
		bestTemp[parseInt(levelMax) + i + 1] = best[d];
		temp[parseInt(levelMax) + i + 1] = custom[d];
	})
	custom = temp;
	window.localStorage['circleCustom'] = JSON.stringify(custom);
	window.localStorage['bestCircleScores'] = JSON.stringify(bestTemp);
}

function submit() {
	if (current) {
		var m = 'Brian - Check out this new level.%0A%0A%0A%0ALeave the text below, it describes your level.%0A' + JSON.stringify(current)
		sendGmail({to: 'brian@theconnman.com', subject: 'New Circles Level', message: m})
	}
}

function sendGmail(opts){
    var str = 'http://mail.google.com/mail/?view=cm&fs=1'+
	    '&to=' + opts.to +
	    '&su=' + opts.subject +
	    '&body=' + opts.message +
	    '&ui=1';
    window.open(str, '_blank');
}