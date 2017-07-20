// A layout knows how to tesselate some shapes, given a "size".
// It should return an object with the following attributes:
// 
// width, height: Dimensions for the svg.
// grid: A 2D array of [[{i:, j:, state:}]].
// draw: A function taking (svg, data) and populating the SVG with
//       elements.
// neighs: A function taking an {i, j} and giving indices considered
//         to be neighbours of {i, j}. These may "fall off" the grid.
//         It is important these are always returned in the same order,
//         as they are joined to the mask.
// valid_idx: A function taking an {i, j} and return true or false, based
//            on whether it is a valid index into the grid.
function layout_square(size, length) {
    var scale = d3.scale.linear()
        .domain([0, size])
        .range([0, size * length]);

    return {
        width: scale(size), height: scale(size),
        grid: range(size).map(function(i) {
            return range(size).map(function(j) {
                return {i:i, j:j, state:0};
            });
        }),
        draw: function(svg, data) {
            return svg.selectAll('rect')
                .data(data)
                .enter().append('rect')
                .attr('width', length)
                .attr('height', length)
                .attr('x', function(d) {return scale(d.j);})
                .attr('y', function(d) {return scale(d.i);});
        },
        neighs: function(d) {
            var x = d.i, y = d.j;
            return [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]
                .map(function(d) {return {i:d[0]+x, j:d[1]+y};});
        },
        valid_idx: function(d) {
            return 0 <= Math.min(d.i, d.j) && Math.max(d.i, d.j) < size;
        },
    };
}
function layout_triangle(nrows, length) {
    var perp = length * Math.sqrt(3) / 2;
    var scalex = d3.scale.linear()
        .domain([0, nrows])
        .range([0, length * nrows]);
    var scaley = d3.scale.linear()
        .domain([0, nrows])
        .range([0, perp * nrows]);

    return {
        width: scalex(nrows), height: scaley(nrows),
        grid: range(nrows).map(function(i) {
            return range(2*i + 1).map(function(j) {
                return {i:i, j:j, state:0};
            });
        }),
        draw: function(svg, data) {
            return svg.selectAll('polygon')
                .data(data)
                .enter().append('polygon')
                .attr('points', function(d) {
                    var rowleft = (nrows - d.i - 1) / 2;
                    var left = scalex(rowleft + d.j/2),
                        right = scalex(rowleft + d.j/2 + 1),
                        top = (d.j % 2 === 0) ? scaley(d.i) : scaley(d.i + 1),
                        bot = (d.j % 2 === 0) ? scaley(d.i + 1) : scaley(d.i);
                    return [[left, bot], [right, bot], [(left+right)/2, top]]
                        .map(function(d) {return d[0] + "," + d[1];})
                        .join(" ");
                });
        },
        neighs: function(d) {
            var i = d.i, j = d.j;
            var deltas = [[0, 0], [0, -1],[0, 1],
                (d.j % 2 === 0) ? [1, 1] : [-1, -1]];
            return deltas.map(function(d) {return {i:d[0]+i, j:d[1]+j};});
        },
        valid_idx: function(d) {
            return 0 <= Math.min(d.i, d.j) && d.i < nrows && d.j < 2*d.i + 1;
        }
    };
}

function layout_hexagon(nrings, length) {
    var height = length * (2*nrings - 1);
    var width = height * 2 / Math.sqrt(3);
    var scale = d3.scale.linear()
        .domain([-nrings, nrings])
        .range([0, height]);
    var centre = function(d) {
        if (d.i === 0)
            return {x:0, y:0};
        var t = Math.PI / 3,
           cx = d.i * Math.sin((d.j/d.i | 0)*t) + (d.j%d.i)*Math.sin(t*(2+d.j/d.i|0)),
           cy = -d.i*Math.cos((d.j/d.i | 0)*t) - (d.j%d.i)*Math.cos(t*(2+d.j/d.i|0));
        return {x:cx, y:cy};
    };

    return {
        width: width, height: height,
        grid: range(nrings).map(function(i) {
            return range((i == 0) ? 1 : 6*i).map(function(j) {
                return {i:i, j:j, state:0};
            });
        }),
        draw: function(svg, data) {
            return svg.selectAll('polygon')
                .data(data)
                .enter().append('polygon')
                .attr('points', function(d) {
                    var c = centre(d);
                    return hexagon_about(c.x, c.y);
                });
        },
        neighs: function(d) {
            var i = d.i, j = d.j;
            var adjs;
            if (i == 0) {
                adjs = range(6).map(function(j) {return {i:1, j:j};});
            } else {
                var deltas = [[0, -1], [0, 1]];
                var s = Math.floor(j/i); // Sector
                if (j % i == 0)
                    deltas = deltas.concat([[-1, -s], [1, s], [1, s-1], [1, s+1]]);
                else
                    deltas = deltas.concat([[-1, -s], [-1, -s-1], [1, s+1], [1, s]]);
                adjs = deltas.map(function(d) {
                    var x = d[0] + i;
                    var y = (x === 0) ? 0 : (d[1]+j + 6*x) % (6*x);
                    return {i:x, j:y};
                });
            }

            // Sort adjs by the angle they make with the centre.
            var c = centre(d);
            var key = function(d) {
                var o = centre(d);
                return Math.atan2(o.y - c.y + 0.1, o.x - c.x);
            };
            adjs.sort(function(a, b) {return key(a) - key(b);});
            adjs.push({i:d.i, j:d.j});
            return adjs;
        },
        valid_idx: function(d) {
            if (d.i === 0 && d.j === 0)
                return true;
            return 0 <= Math.min(d.i, d.j) && d.i < nrings && d.j < 6*d.i;
        }
    };

    function hexagon_about(cx, cy) {
        return range(6).map(function(i) {
            var r = 1/Math.sqrt(3),
                t = i * Math.PI / 3,
                x = cx + r * Math.cos(t),
                y = cy + r * Math.sin(t);
            return scale(x) + "," + scale(y);
        }).join(" ");
    }
}

function create_board(selector, layout_fn, size, length) {
    var margin = 5;
    var colour = function(d) {return ['white', 'green', '#eee'][d.state];};
    var layout = layout_fn(size, length);

    // Remove any previously existing board.
    d3.select(selector).selectAll('svg').remove();
    var svg = d3.select(selector)
        .append('svg')
            .attr('width', layout.width + 2*margin)
            .attr('height', layout.height + 2*margin)
        .append('g')
            .attr('transform', 'translate(' + margin + ', ' + margin + ')');

    // Create and index a flat version of the grid.
    layout.flat = layout.grid.reduce(function(sofar, row) {
        return sofar.concat(row);
    });
    layout.flat.forEach(function(d, i) {d.idx = i;});

    // Create the SVG elements.
    layout.elems = layout.draw(svg, layout.flat);

    layout.recolour = function() {
        layout.elems
            .data(layout.flat)
            .attr('fill', colour);
    };

    layout.default_onclick = function(d) {
        layout.neighs(d)
            .filter(layout.valid_idx)
            .forEach(function(d) {layout.grid[d.i][d.j].state ^= 1;});
        layout.recolour();
    };
    layout.elems.on('click', layout.default_onclick);

    return layout;
}
    


// A shape has a layout, and also knows a few more things about
// how its mask should be laid out, what side length to use, etc.
var shapes = [
    {
        name: 'Square',
        layout_fn: layout_square,
        size: 5,
        length: 50,
        mask_size: 3,
        mask_length: 40,
        mask_centre: {i:1, j:1},
    },
    {
        name: 'Triangle',
        layout_fn: layout_triangle,
        size: 5,
        length: 50,
        mask_size: 2,
        mask_length: 40,
        mask_centre: {i:1, j:1},
    },
    {
        name: 'Hexagon',
        layout_fn: layout_hexagon,
        size: 3,
        length: 50,
        mask_size: 2,
        mask_length: 40,
        mask_centre: {i:0, j:0},
    },
];

d3.select('#shape').selectAll('input')
    .data(shapes).enter().append('input')
    .attr('type', 'radio')
    .attr('name', 'shape')
    .property('checked', function(d, i) {return i === 0;})
    .on('click', function(d) {game(d);})
    .each(function(d) {this.insertAdjacentHTML('afterend', ' ' + d.name);});
game(shapes[0]);

function game(shape) {
    // Set up the mask first, since changes to the mask
    // reset the game.
    var mask = create_board('#gameconfig', shape.layout_fn, shape.mask_size, shape.mask_length);
    var size = shape.size;
    var board;
    var moves;
    var last_state;
    var timeout;

    mask.flat.forEach(function(d) {d.state = 2;});
    var maskcat = mask.neighs(shape.mask_centre).map(function(d) {
        mask.grid[d.i][d.j].state = 1;
        return mask.grid[d.i][d.j];
    });
    mask.elems.data(maskcat, function(d) {return d.idx;}).exit().remove();
    mask.recolour();
    mask.elems.on('click', mask_onclick);

    d3.select('#generate').on('click', generate);
    d3.select('#solve').on('click', animate_soln);
    d3.select('#restart').on('click', function() {restore_state(last_state);});
    d3.select('#smaller').on('click', function() {
        if (size == 2)
            return;
        size--;
        reset_game();
    });
    d3.select('#bigger').on('click', function() {
        size++;
        reset_game();
    });

    reset_game();

    function reset_game() {
        board = create_board('#gameboard', shape.layout_fn, size, shape.length);
        board.elems.on('click', board_onclick);
        moves = moves_mat();
        d3.select('#dim_solve').text(moves.rank());
        d3.select('#dim_whole').text(moves.m);
        d3.select('#dimdiff').text(moves.rank() - moves.m);
        generate();
    }

    function restore_state(state) {
        window.clearTimeout(timeout);
        board.flat.forEach(function(d, i) {
            d.state = state[i];
        });
        board.recolour();
    }

    function generate() {
        window.clearTimeout(timeout);
        var basis = moves.img_basis();
        var state = range(board.flat.length).map(function(d) {return 0;});
        if (moves.rank() !== 0) {
            var vec = basis.field.vec(range(basis.m).map(function() {
                return Math.random() < 0.5;
            }));
            state = basis.mul(vec).list();
        }
        last_state = state;
        restore_state(last_state);
    }

    function board_onclick(d) {
        window.clearTimeout(timeout);
        console.log(d);
        var changed = affected(d);
        changed.forEach(function(d) {
            d.state ^= 1;
        });
        board.elems
            .data(changed, function(d) {return d.idx;})
            .attr('stroke-width', 3)
            .transition()
            .duration(300)
            .attr('stroke-width', 1);
        board.recolour();
    }

    function mask_onclick(d) {
        if (d.state == 2)
            return;
        mask.grid[d.i][d.j].state ^= 1;
        mask.recolour();
        reset_game();
    }

    // Return cells affected by {d.i, d.j}
    function affected(d) {
        var neighs = board.neighs(d);
        var mask_bools = mask.neighs(shape.mask_centre)
            .map(function(d) {return mask.grid[d.i][d.j].state;});
        return neighs
            .filter(function(d, i) {return mask_bools[i];})
            .filter(board.valid_idx)
            .map(function(d) {return board.grid[d.i][d.j];});
    }

    // Get the moves matrix for this configuration.
    function moves_mat() {
        var field = prime_field(2);
        var zeros = board.flat.map(function() {return 0;});
        var vectors = board.flat.map(function(d) {
            vector = zeros.slice(0);
            affected(d).forEach(function(d) {vector[d.idx] = 1;});
            return field.vec(vector);
        });
        return assemble_vecs(vectors);
    }

    function animate_soln() {
        var state = prime_field(2).vec(board.flat.map(function(d) {
            return d.state;
        }));
        // Negatives are positives in F2.
        console.log(moves.rowech().str());
        var soln = solve_Axb(moves, state);
        console.log(soln.str());
        // Columns with pivots were chosen as the basis.
        var soln_elems = [];
        soln.list().forEach(function(d, i) {
            if (d)
                soln_elems.push(board.flat[moves.pivots[i]]);
        });
        var i = 0;
        var callback = function() {
            board_onclick(soln_elems[i++]);
            if (i < soln_elems.length)
                timeout = setTimeout(callback, 300);
        };
        callback();
    }
}
