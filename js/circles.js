$(document).ready(function() {
	init($('#game').width(), $('#game').width(), 1)
	if (!window.localStorage['bestCircleScores']) {
		window.localStorage['bestCircleScores'] = 0
	} else {
		$('#best').html(window.localStorage['bestCircleScores'])
	}
	!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
})

function reset() {
 	init($('#game').width(), $('#game').width(), 1)
}


function init(w, h, level) {
	
	d3.select("#game").html('')

	var svg = d3.select("#game").append("svg:svg").attr("width",
			w).attr("height", h).attr("id", "svg");

	var speed = (18 + level * 2) / 10
	var size = Math.floor(9 + level)
	$('#speed').html(speed)
	$('#circles').html(size)
	$('#level').html(level)
	
	var moveDif = 50
	var color = d3.scale.category10();
	var nodes = d3.range(size).map(function() { return {radius: 10, x: Math.random() * w * .8 + w * .1, y: Math.random() * h * .8 + h * .1, v: speed, r: Math.random() * 2 * Math.PI, c: moveDif, dx: 0, dy: 0}; })
	var moveNode;
	var moveCircle;
	var moveInterval;
	var buffer = 10
	
	circles = svg.selectAll(".circle")
		.data(nodes).enter()
		.append("svg:circle")
		.attr("class", "circle")
		.attr("r", function(d) { return d.radius; })
		.attr("transform", function(d) { return 'translate(' + d.x + ', ' + d.y + ')'; })
		.style("fill", function(d, i) { return color(i % 5); })
		
	svg.on('mousedown', function() {
		var co = d3.mouse(this)
		moveNode = [{radius: 10, x: co[0], y: co[1]}]
		moveCircle = svg.selectAll(".move").data(moveNode).enter()
			.append("svg:circle")
			.attr("class", "move")
			.attr("r", function(d) { return d.radius; })
			.attr("transform", function(d) { return 'translate(' + d.x + ', ' + d.y + ')'; })
		moveInterval = setInterval(expand, 10)
	})
	
	var defaultInterval = setInterval(redraw, 10)
			
	function redraw() {
		nodes.forEach(function(d) {
			if ((d.y >= h - d.r - buffer || d.y <= d.r + buffer) && (d.c - d.dy) >= moveDif) {
				d.r = 2 * Math.PI - d.r;
				d.dy = d.c
			}
			if ((d.x >= w - d.r - buffer || d.x <= d.r + buffer) && (d.c - d.dx) >= moveDif) {
				d.r = (Math.PI - d.r) % (2 * Math.PI)
				d.dx = d.c
			}
			d.x += d.v * Math.cos(d.r);
			d.y += d.v * Math.sin(d.r);
			d.c++
		})
		circles.attr("transform", function(d) { return 'translate(' + d.x + ', ' + d.y + ')'; })
	}
	
	function expand() {
		moveNode.forEach(function(d) {
			d.radius += 1
			var collide = false
			nodes.forEach(function(n) {
				if (n.radius + d.radius >= Math.sqrt(Math.pow(d.x - n.x, 2) + Math.pow(d.y - n.y, 2))) {
					collide = true
				}
			})
			if (d.x + d.radius >= w || d.x - d.radius <= 0 || d.y + d.radius >= h || d.y - d.radius <= 0) {
				collide = true
			}
			if (collide) {
				clearInterval(defaultInterval)
				clearInterval(moveInterval)
				levelEnd(d.radius, level)
			}
		})
		moveCircle.attr("r", function(d) { return d.radius; })
	}
}

function levelEnd(r, level) {
	var html;
	if (pass(r)) {
		var s = parseInt($('#score').html()) + r
		$('#score').html(s)
		if (parseInt(window.localStorage['bestCircleScores']) < s) {
			window.localStorage['bestCircleScores'] = s
			$('#best').html(s)
		}
		html = '<h1>You Completed Level ' + level + '</h1>';
		html += '<p>Your score was ' + r + '.</p>';
		html += '<button class="close" onclick="nextLevel(' + level + ', ' + r + ')">Next Level</button>';
	} else {
		html = '<h1>You Failed Level ' + level + '</h1>';
		html += '<p>Your score was ' + r + '.</p>';
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

function nextLevel(level, r) {
	init($('#game').width(), $('#game').width(), level + 1)
}

function retryLevel(level) {
	init($('#game').width(), $('#game').width(), level)
}

function pass(r) {
	if (r >= 100) {
		return true;
	} else {
		return false;
	}
}