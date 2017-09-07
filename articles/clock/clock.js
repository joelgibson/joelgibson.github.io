var width = 500,
    height = 500,
    margin = 15;

var div = d3.select('#game');
var svg = div.append('svg')
    .attr('width', width)
    .attr('height', height);
var vis = svg.append('g')
    .attr('transform', 'translate(' + margin + ', ' + margin + ')');


var hardness = 6;
newgame();

div.append('button').text('Restart').on('click', function() {
    game_data.nums.forEach(function(d) {d.visited = false;});
    game_data.hands = [];
    update(game_data);
});
div.append('button').text('New puzzle').on('click', newgame);
div.append('button').text('Easier').on('click', function() {
    if (hardness == 3) return;
    hardness--;
    newgame();
});
div.append('button').text('Harder').on('click', function() {
    if (hardness == 14) return;
    hardness++;
    newgame();
});


function newgame() {
    clear();
    game_data = gamedata(genpuzzle(hardness));
    update(game_data);
}


function clear() {
    vis.selectAll('g').remove();
    vis.selectAll('line').remove();
}

function gamedata(numbers) {
    return {
        // Handly constants.
        n: numbers.length,
        angle: 360 / numbers.length,

        // Each number around the clock.
        nums: numbers.map(function(num, i) {
            return {num: num, pos: i, visited: false};
        }),

        // Last number which was activated.
        last: {},

        // Hands are the numbers which the hands are pointing to
        hands: [],
    };
}

function clicked(d, g) {
    if (d.visited) return;
    if (g.hands.length !== 0 && g.hands.indexOf(d.pos) < 0) return;

    g.last = d;
    d.visited = true;
    g.hands = [(d.pos - d.num + g.n) % g.n, (d.pos + d.num) % g.n];
    update(g);
}

function update(g) {
    var radius = height / 3,
        xmid = width/2,
        ymid = height/2;

    var circles = vis.selectAll('g').data(g.nums);

    var circlegs = circles.enter()
      .append('g')
        .attr('transform', function(d) {
            var trans = 'translate(' + xmid + ', ' + (ymid - radius) + ')';
            var rot = rotate(d.pos * g.angle);
            return rot + trans;
        })
        .on('click', function(d) {clicked(d, g);});
    circlegs.append('circle')
        .attr('r', 35);
    circlegs.append('text')
        .text(function(d) {return ''+d.num;});

    circles
        .attr('class', function(d) {return (d.visited) ? 'visited' : '';});

    var hands = vis.selectAll('line').data(g.hands);
    hands.enter().append('line');
    hands.exit().remove();
    hands
        .attr('x1', xmid).attr('y1', ymid)
        .attr('x2', xmid).attr('y2', ymid - 2*radius/3)
      .transition()
        .duration(1200)
        .attrTween('transform', function(d, i) {
            var start = g.last.pos * g.angle;
            var end = start + g.last.num * g.angle * ((i === 0) ? -1 : 1);
            return d3.interpolateString(rotate(start), rotate(end));
        });

    function rotate(angle) {
        return 'rotate(' + angle + ', ' + xmid + ', ' + ymid + ')';
    }
}

function genpuzzle(n) {
    var puzzle = [];
    for (;;) {
        for (var i = 0; i < n; i++)
            puzzle[i] = Math.floor(1 + Math.random()*Math.floor(n/2));
        if (has_soln(puzzle))
            break;
    }
    return puzzle;
}


function has_soln(nums, hands) {
    if (typeof hands === "undefined")
        hands = nums.map(function(d, i) {return i;});
    if (nums.reduce(function(a, b) {return a && (b == -1);}, true))
        return true;
    for (var i in hands) {
        var hand = hands[i];
        if (nums[hand] == -1) continue;
        var tmp = nums[hand];
        nums[hand] = -1;
        var soln = has_soln(nums, [(hand+tmp) % nums.length, (hand-tmp+nums.length) % nums.length]);
        nums[hand] = tmp;
        if (soln) return true;
    }
    return false;
}

