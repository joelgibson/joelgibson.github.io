var div = d3.select('#hull-animation');
var svgElem = document.querySelectorAll('#hull-animation svg')[0];
var svg = d3.select(svgElem);
var width = 700;
var height = 300;

// viewBox is "x y width height"
svg.attr('viewBox', '0 0 ' + width + ' ' + height);
var margin = 15;

var vis = svg.append('g')
    .attr('transform', 'translate(' + margin + ', ' + margin + ')');
var lineLayer = vis.append('g');
var circleLayer = vis.append('g');

// Initial points
randomise();

// Interval timer for the current animation.
var currentInterval;
function stop() {
  clearInterval(currentInterval);
}

// Animation: compute the hull history, then call update() with
// each one.
div.append('button').text('Animate').on('click', function() {
  stop();

  var hulls = convexHullHistory(points);
  var idx = 0;
  currentInterval = setInterval(function() {
    update(points, hulls[idx++]);
    if (idx == hulls.length) stop(); 
  }, 750);
});

// Randomisation: create a fixed number of random points.
div.append('button').text('Randomise').on('click', randomise);
function randomise() {
  stop();
  points = randPoints(15);
  update(points);
}

// On clicking the diagram, add a new point.
div.append('button').text('Clear').on('click', function() {
  stop();
  points = [];
  update(points);
});

// Want to be able to add new points
svg.on('click', function() {
  if (addPoint(d3.mouse(vis.node()), points)) {
    stop();
    update(points);
  }
});

// Updates the diagram to show the given points, and the partial hull.
// If no hull is given, will compute the convex hull of the points and
// use that as the hull.
function update(points, hull) {
  if (!hull) {
    var hulls = convexHullHistory(points);
    hull = hulls[hulls.length-1];
  }
  var circles = circleLayer.selectAll('circle')
    .data(points, function(d) {return d;});
  circles.enter()
    .append('circle')
      .attr('cx', function(d) {return d[0];})
      .attr('cy', function(d) {return d[1];})
      .attr('r', 1e-6)
    .transition()
      .attr('r', 2);
  circles.exit().remove();
  
  // Line segments in the hull.
  var segs = [];
  for (var i = 0; i < hull.length - 1; i++)
    segs.push([hull[i], hull[i+1]]);

  var lines = lineLayer.selectAll('line')
    .data(segs, function(d) {return d;});
  lines.enter()
    .append('line')
      .attr('x1', function(d) {return d[0][0];})
      .attr('y1', function(d) {return d[0][1];})
      .attr('x2', function(d) {return d[1][0];})
      .attr('y2', function(d) {return d[1][1];});

  lines.attr('class', function(d, i) {
        // Hull of one point never considered:
        // does not give rise to any segments.

        // Hull of two points always grey
        if (hull.length <= 2) return 'inhull';

        // Hull of >3 points: we only care about the last two segments.
        if (i < hull.length - 3) return 'inhull';

        // If the hull is finished, do nothing interesting. Otherwise,
        // colour the left or right turn.
        var closed = hull[0] == hull[hull.length - 1];
        var left = isLeftTurn(hull.slice(hull.length-3));
        return (closed && left) ? 'inhull' : (left) ? 'wanted' : 'unwanted';
      });
  lines.exit().remove();

  var hullcircles = circleLayer.selectAll('circle')
    .data(hull, function(d) {return d;});
  hullcircles.transition().attr('r', 5);
  hullcircles.exit().transition().attr('r', 2);
}

// Finds the convex hull of the point set. Returns a snapshot of the hull being
// built after every operation (so very inefficient). It's written strangely
// because of this.
//
// The alternative would be to make this algorithm re-entrant. Except then it
// would be really annoying to rewind, and just outputting snapshots works
// really well with D3's data binding.
function convexHullHistory(pts) {
  // Special case small hulls: no-one cares about them.
  if (pts.length <= 3) {
    if (pts.length !== 0) pts = pts.concat([pts[0]]);
    return [pts];
  }

  // Get a sorted copy of the points list. Then repeat most of it so that we
  // go left -> right -> left.
  pts = pts.slice(0).sort(function(a, b) {
    return (a[0] != b[0]) ? a[0] - b[0] : a[1] - b[1];
  });
  for (var i = pts.length - 2; i >= 0; i--) pts.push(pts[i]);

  // History of hulls, and current hull.
  var hulls = [[]],
      hull = [];

  i = 0;
  for (;;) {
    if (hull.length <= 2) {
      // Not enough points to find a turn, just take the next point.
      hull.push(pts[i++]);
    } else if (!isLeftTurn(hull.slice(hull.length - 3))) {
      // We have a right turn, remove the second last point.
      hull.splice(hull.length - 2, 1);
    } else if (i < pts.length) {
      hull.push(pts[i++]);
    } else {
      break;
    }

    // Record a copy of our hull.
    hulls.push(hull.slice(0)); 
  }
  hulls.push(hull);

  return hulls;
}

// Returns true if [p, q, r] make a left turn, by checking the
// sign of the cross product (q-p) cross (r-q).
//
// Note that since y goes down the page, this is a left-handed
// coordinate system.
function isLeftTurn(pts) {
  var p = pts[0], q = pts[1], r = pts[2];
  var ux = q[0] - p[0], uy = q[1] - p[1],
      vx = r[0] - q[0], vy = r[1] - q[1];
  return ux * vy - uy * vx <= 0;
}

// Adds a point, as long as it isn't too close to the other points.
function addPoint(pt, points) {
  var canAdd = points.every(function(p) {
    var dx = p[0] - pt[0],
        dy = p[1] - pt[1],
        dist = Math.pow(dx*dx + dy*dy, 0.5);
    return dist > width/50;
  });
  if (canAdd) {
    points.push(pt);
    return true;
  }
  return false;
}

// Makes n random points within the boundaries of the diagram.
function randPoints(n) {
  var points = [];
  while (points.length < n) {
    var point = [Math.random()*(width-margin), Math.random()*(height-margin)];
    addPoint(point, points);
  }
  return points;
}
