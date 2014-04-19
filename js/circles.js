/*
 * OPTIONS
 * Required
 * title - Title of the level
 * momentum - Total momentum of each circle
 * ballNum - Number of circles
 * expandSpeed - Expansion speed of the user's circle
 * 
 * One of the following sets
 * avgSize, sizeVar - Average radius of a circle, variance of the circle radius
 * r - Radius of each node, can be a function
 * 
 * Optional
 * angle - Starting angle of each node, can be a function
 * randAngleInt - Interval in milliseconds when each circle gets a new, random angle
 */

var levels = {1: {title: 'Easy Peasy', avgSize: 15, sizeVar: 5, momentum: 100, ballNum: 10, expandSpeed: 1},
		2: {title: 'Lemon Squeezy', avgSize: 15, sizeVar: 5, momentum: 100, ballNum: 15, expandSpeed: 1},
		3: {title: 'Rapid Expansion', avgSize: 30, sizeVar: 5, momentum: 800, ballNum: 10, expandSpeed: 1},
		4: {title: 'Slow Mo', avgSize: 25, sizeVar: 5, momentum: 100, ballNum: 10, expandSpeed: .25},
		5: {title: 'Speed of Light', avgSize: 15, sizeVar: 5, momentum: 600, ballNum: 10, expandSpeed: 3},
		6: {title: 'Atoms', avgSize: 5, sizeVar: 0, momentum: 25, ballNum: 30, expandSpeed: 1},
		7: {title: 'Big Ben', avgSize: 200, sizeVar: 0, momentum: 50000, ballNum: 1, expandSpeed: 1},
		8: {title: 'Zoom Zoom', avgSize: 10, sizeVar: 5, momentum: 200, ballNum: 10, expandSpeed: 1},
		9: {title: 'Conservation of Momentum', r: function(o) { return 30 + 10 * Math.cos(2 * Math.PI * (new Date() / 1000 + o) / 2); }, momentum: 300, ballNum: 10, expandSpeed: 1},
		10: {title: 'Tadpoles', r: function(o) { return 20 + 10 * Math.cos(2 * Math.PI * (new Date() / 1000 + o)); }, momentum: 100, ballNum: 20, expandSpeed: 1},
		11: {title: 'Crossing Traffic', avgSize: 20, sizeVar: 5, angle: function(o) { return o > .5 ? Math.PI : 0; }, momentum: 300, ballNum: 20, expandSpeed: 1},
		12: {title: 'Stop and Start', avgSize: 20, sizeVar: 5, randAngleInt: 1000, momentum: 300, ballNum: 20, expandSpeed: 1},
		13: {title: 'What Is Happening', r: function(o) { return 20 + 10 * Math.cos(2 * Math.PI * (new Date() / 1000 + o)); }, randAngleInt: 1000, momentum: 300, ballNum: 20, expandSpeed: 1}}

$(document).ready(function() {
	gameW = $('#game').width(), gameH = $('#game').width();
	if (!window.localStorage['bestCircleScores']) {
		window.localStorage['bestCircleScores'] = JSON.stringify({1: 0})
		init(1)
	} else {
		$('#best').html(JSON.parse(window.localStorage['bestCircleScores'])[1])
		var a = Object.keys(JSON.parse(window.localStorage['bestCircleScores']))
		init(a[a.length - 1])
	}
	!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
})

function init(level) {
	
	d3.select("#game").html('')

	var svg = d3.select("#game").append("svg:svg")
				.attr("width", gameW).attr("height", gameH).attr("id", "svg");

	var params = levels[level]

	$('#title').html(params.title)
	var best = JSON.parse(window.localStorage['bestCircleScores'])
	if (!best[level]) {
		best[level] = 0
		window.localStorage['bestCircleScores'] = JSON.stringify(best)
	}
	initLevels(Object.keys(levels), Object.keys(JSON.parse(window.localStorage['bestCircleScores'])), level)
	$('#best').html(best[level])
	
	var moveDif = 50
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
			c: moveDif, dx: 0, dy: 0, o: o};
	})
	var moveNode;
	var moveCircle;
	var moveInterval;
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
			moveNode = [{radius: 1, x: co[0], y: co[1]}]
			moveCircle = svg.selectAll(".move").data(moveNode).enter()
				.append("svg:circle")
				.attr("class", "move")
				.attr("r", function(d) { return d.radius; })
				.attr("transform", function(d) { return 'translate(' + d.x + ', ' + d.y + ')'; })
			moveInterval = setInterval(expand, 1)
			moveBool = true
		}
	})
	
	var defaultInterval = setInterval(redraw, 1)
			
	function redraw() {
		nodes.forEach(function(d) {
			var r = ($.isFunction(d.radius) ? d.radius(d.o) : d.radius)
			if ((d.y >= gameH - r || d.y <= r) && (d.c - d.dy) >= moveDif) {
				d.r = 2 * Math.PI - d.r;
				d.dy = d.c
			}
			if ((d.x >= gameW - r || d.x <= r) && (d.c - d.dx) >= moveDif) {
				d.r = (Math.PI - d.r) % (2 * Math.PI)
				d.dx = d.c
			}
			d.x += d.m / (r * r) * Math.cos(d.r);
			d.y += d.m / (r * r) * Math.sin(d.r);
			if (d.int && new Date().getTime() > d.lastChange + d.int) {
				d.r = 2 * Math.random() * Math.PI;
				d.lastChange = new Date().getTime()
			}
			d.c++
		})
		svg.selectAll(".circle").attr("r", function(d) { return ($.isFunction(d.radius) ? d.radius(d.o) : d.radius); })
		circles.attr("transform", function(d) { return 'translate(' + d.x + ', ' + d.y + ')'; })
	}
	
	function expand() {
		moveNode.forEach(function(d) {
			d.radius += params.expandSpeed / 5
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
				clearInterval(defaultInterval)
				clearInterval(moveInterval)
				levelEnd(Math.floor(d.radius), level)
			}
		})
		moveCircle.attr("r", function(d) { return d.radius; })
	}
}

function levelEnd(s, level) {
	var html;
	if (pass(s)) {
		var best = JSON.parse(window.localStorage['bestCircleScores'])
		html = '<h1>You Completed Level ' + level + '</h1>';
		html += '<p>Your score was ' + s + '.</p>';
		if (best[level] < s && best[level] != 0) {
			html += '<p>New high score!</p>';
		}
		if (levels[parseInt(level) + 1]) {
			html += '<button class="close" onclick="nextLevel(' + level + ', ' + s + ')">Next Level</button>';
		} else {
			html += "<p>Congratulations, you've beaten all the levels!</p>";
		}
		html += '<button class="close" onclick="retryLevel(' + level + ')">Retry Level</button>';
		if (best[level] < s) {
			best[level] = s
			window.localStorage['bestCircleScores'] = JSON.stringify(best)
			$('#best').html(s)
		}
	} else {
		html = '<h1>You Failed Level ' + level + '</h1>';
		html += '<p>Your score was ' + s + '.</p>';
		html += '<button class="close" onclick="retryLevel(' + level + ')">Retry Level</button>';
	}
	$('#modalContent').html(html);
	$('#levelEnd').reveal({
	     animation: 'fadeAndPop',
	     animationspeed: 300,
	     closeonbackgroundclick: false,
	     dismissmodalclass: 'close'
	});
}

function initLevels(all, open, cur) {

	d3.select("#levels").html('')
	
	var w = 300, h = $('#header').height(), perRow = 10, rw = w / perRow, pad = 2;
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
			init(d.level)
		}
	})
}

function nextLevel(level, r) {
	init(level + 1)
}

function retryLevel(level) {
	init(level)
}

function pass(r) {
	if (r >= 100) {
		return true;
	} else {
		return false;
	}
}