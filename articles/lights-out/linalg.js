// A Matrix is an immutable type. Matrices should always
// be manufactured through a field, for example
//      prime_field(7).mat([[1, 0], [0, 1]])
// Any numbers will be cast into the field appropriately.
//
// Matrices support the following operations:
//  mat.n
//      Number of rows.
//  mat.m
//      Number of columns.
//  mat.field
//      Field in which the elements live.
//  mat.str()
//      Get the matrix as a string.
//  mat.add(mat2)
//  mat.sub(mat2)
//  mat.mul(mat2)
//      Add, subtract, or multiply two matrices.
//  mat.scale(scalar)
//      Multiply the matrix by a scalar.
//  mat.cat(mat2)
//      Form a new matrix by putting [mat, mat2] side-by-side.
//  mat.list()
//      Get a list of the matrix element in row-major order.
//      Very handy for vectors.
//
//  The following operations are more expensive, and will
//  trigger a Gaussian Elimination algorithm on their first
//  query.
//
//  mat.det()
//      Determinant of matrix (matrix must be square).
//  mat.rowech()
//      The row-echelon reduction of the matrix.




// Gets (or creates) a singleton object for the field of
// integers modulo some prime p. All field objects have
// the following operations:
//
// p: int
//      The prime number.
// cast: int -> int
//      The unique ring homomorphism Z -> Z_p.
// inv: int -> int
//      Return the modular inverse of a number.
// add, sub, mul, div: (int, int) -> int
//      Performs +, -, *, / within the field.
// mat: [[int]] -> Matrix
//      Converts a list like [[1, 2], [3, 4]] into a Matrix.
// vec: [int] -> Matrix
//      Converts a list of numbers into a column vector.
function prime_field(p) {
    // Search for a cached result first.
    var cache = prime_field.cache || {};
    if (p in cache)
        return cache[p];

    // Sanity check the number
    if (!is_prime(p))
        throw "Cannot create a prime field from composite.";
    
    // The double mod is required since (-5)%3 = -2.
    var cast = function(x) {return ((x % p) + p) % p;};

    // Build a table of inverses. inv_table[0] = 0.
    var inv_table = range(p).map(function(x) {
        // Since the multiplicative group has order p-1,
        // the inverse of any element x is x^(p-2)
        return pow_mod(x, p-2, p);
    });

    // Sanity check this...
    var inv = function(x) {
        x = cast(x);
        if (x === 0)
            throw "Cannot invert zero!";
        return inv_table[x];
    };
    var neg = function(x) {return cast(-x);};

    var add = function(x, y) {return cast(x + y);};
    var sub = function(x, y) {return cast(x - y);};
    var mul = function(x, y) {return cast(x * y);};
    var div = function(x, y) {return cast(x * inv(y));};
    var mat = function(rows) {return new Matrix(rows, this);};
    var vec = function(nums) {
        return new Matrix(nums.map(function(x) {return [x];}), this);
    };

    var field = {
        p: p, cast: cast, inv: inv,
        add: add, sub: sub, mul: mul, div:div,
        neg: neg, mat: mat, vec: vec
    };
    cache[p] = field;
    return field;
}

function is_prime(n) {
    if (n < 2)
        return false;
    for (var i = 2; i*i <= n; i++)
        if (n % i === 0)
            return false;
    return true;
}

// Internal matrix type: should not be created
// directly. Use field.matrix instead.
function Matrix(rows, field) {
    var n = rows.length;
    var m = rows[0].length;
    rows.forEach(function(row) {
        if (row.length != m)
            throw "Not all rows in matrix the same length";
    });
    this.field = field;
    this.n = n;
    this.m = m;
    this.rows = rows.map(function(row) {
        return row.map(field.cast);
    });
}
Matrix.prototype.str = function() {
    return this.rows.map(function(row) {
        return "[" + row.join(" ") + "]";
    }).join("\n");
};
Matrix.prototype.latex = function() {
    return "\\begin{bmatrix}" +
        this.rows
            .map(function(row) {return row.join("&&");})
            .join("\\\\") +
        "\\end{bmatrix}";
};
Matrix.prototype.cat = function(other) {
    if (this.n != other.n)
        throw "Catting matrices must be same height";
    var rows = this.rows.map(function(row, i) {
        return row.concat(other.rows[i]);
    });
    return this.field.mat(rows);
};
Matrix.prototype.add = function(other) {
    if (this.n != other.n || this.m != other.m)
        throw "Matrix dimensions must match";
    var field = this.field;
    var rows = this.rows.map(function(row, i) {
        return row.map(function(elem, j) {
            return field.add(elem, other.rows[i][j]);
        });
    });
    return field.mat(rows);
};
Matrix.prototype.sub = function(other) {
    if (this.n != other.n || this.m != other.m)
        throw "Matrix dimensions must match";
    var field = this.field;
    var rows = this.rows.map(function(row, i) {
        return row.map(function(elem, j) {
            return field.sub(elem, other.rows[i][j]);
        });
    });
    return field.mat(rows);
};
Matrix.prototype.scale = function(scalar) {
    var field = this.field;
    var rows = this.rows.map(function(row) {
        return row.map(function(elem) {
            return field.mul(elem, scalar);
        });
    });
    return field.mat(rows);
};
Matrix.prototype.list = function() {
    return this.rows.reduce(function(sofar, row) {
        return sofar.concat(row);
    });
};
Matrix.prototype.eq = function(other) {
    if (this.n != other.n) return false;
    if (this.m != other.m) return false;
    for (var i = 0; i < this.n; i++)
        for (var j = 0; j < this.m; j++)
            if (this.rows[i][j] != other.rows[i][j])
                return false;
    return true;
};
Matrix.prototype.clone_rows = function() {
    return this.rows.map(function(r) {return r.slice(0);});
};
Matrix.prototype.mul = function(other) {
    if (this.field.p !== other.field.p)
        throw "Matrices over separate fields";
    if (this.m != other.n)
        throw "Inner matrix dimensions do not match";
    var that = this;
    var f = this.field;
    var rows = range(that.n).map(function(_, i) {
        return range(other.m).map(function(_, j) {
            return range(that.m).reduce(function(s, _, k) {
                var a = that.rows[i][k];
                var b = other.rows[k][j];
                return f.add(s, f.mul(a, b));
            }, 0);
        });
    });
    return f.mat(rows);
};
// Does a bunch of computations and attaches the results to
// the original matrix.
Matrix.prototype.reduce = function() {
    if (typeof this.pivots !== typeof undefined)
        return;
    // Clone the matrix rows, put the clone into row-echelon form,
    // and record the steps we took to do that.
    var clone = this.clone_rows();
    var steps = [];
    var field = this.field;
    // Util function to apply one step at a time to clone. Also record the steps.
    var apply = function(step) {
        steps.push(step);
        RR.apply(field, clone, [step]);
    };
    
    // Keep a list of the columns that the pivots end up in, and not.
    var pivots = [];
    var nonpivots = [];
    
    for (var colidx = 0; colidx < this.m; colidx++) {
        // Only search below any pivots that are already in position.
        var nonzero = -1;
        for (var rowidx = pivots.length; rowidx < this.n; rowidx++) {
            if (clone[rowidx][colidx] !== 0) {
                nonzero = rowidx;
                break;
            }
        }
        // If we found all zeros, move on.
        if (nonzero < 0) {
            nonpivots.push(colidx);
            continue;
        }
        // Switch rows so that the pivot is in the next good spot.
        var pivotidx = pivots.length;
        if (pivotidx != nonzero)
            apply(RR.swap(nonzero, pivotidx));

        // Normalise the pivot to 1 by multiplying the row by its inverse.
        var pivotval = clone[pivotidx][colidx];
        if (pivotval != 1)
            apply(RR.scale(pivotidx, field.inv(pivotval)));
        
        // Now kill off any other nonzero entries in this column.
        for (rowidx = 0; rowidx < this.n; rowidx++) {
            // Don't kill the pivot itself!
            if (rowidx == pivotidx)
                continue;

            var val = clone[rowidx][colidx];
            if (val === 0)
                continue;

            apply(RR.affine(rowidx, pivotidx, field.neg(val)));
        }

        // Record the pivot.
        pivots.push(colidx);
    }

    this._rowech = field.mat(clone);
    this.steps = steps;
    this.pivots = pivots;
    this.nonpivots = nonpivots;
    // Determinant only relevant for a square matrix.
    if (this.n == this.m)
        this._det = (pivots.length == this.n) ? RR.detmod(field, steps) : 0;
};
Matrix.prototype.rowech = function() {
    this.reduce();
    return this._rowech;
};
Matrix.prototype.det = function() {
    if (this.n != this.m)
        throw "Determinant only exists for square matrices.";
    this.reduce();
    return this._det;
};
Matrix.prototype.rank = function() {
    this.reduce();
    return this.pivots.length;
};

Matrix.prototype.applyRR = function(steps) {
    var rows = this.clone_rows();
    RR.apply(this.field, rows, steps);
    return new Matrix(rows, this.field);
};

Matrix.prototype.img_basis = function() {
    this.reduce();

    // Row reduction does not affect the linear independence
    // of the columns, since row operations are invertible.
    var pivots = this.pivots;
    var rows = this.rows.map(function(row) {
        return pivots.map(function(i) {return row[i];});
    });
    return this.field.mat(rows);
};
Matrix.prototype.ker_basis = function() {
    this.reduce();

    // Columns without pivots are free. For each free variable,
    // set it to 1 and the others to 0, and solve the remaining
    // system for the rest of the vector. Since the rest of the
    // system is only the pivots, this is easy.
    var that = this;
    var basis = that.nonpivots.map(function(colidx) {
        var vec = range(that.m).map(function(i) {
            if (i == colidx)
                return 1;
            if (that.pivots.indexOf(i) >= 0) {
                var pivrow = that.pivots.indexOf(i);
                return that.field.neg(that.rows[pivrow][colidx]);
            }
            return 0;
        });
        return that.field.vec(vec);
    });
    return concat_mats(basis);
};
    


// Solves the linear system Ax = b for x.
function solve_Axb(A, b) {
    A.reduce();
    return b.applyRR(A.steps);
}

// Row reduction utils
var RR = {
    // Let [i] denote "Row i", and so on.
    // [i] <-> [j]
    swap: function(i, j) {return {name: "swap", i: i, j: j};},
    // [i] <- x * [i]
    scale: function(i, x) {return {name: "scale", i: i, x: x};},
    // [i] <- [i] + x * [j]
    affine: function(i, j, x) {return {name: "affine", i: i, j: j, x: x};},
    // How do these steps affect the determinant?
    detmod: function(field, steps) {
        var mod = 1;
        steps.forEach(function(step) {
            var mult = {
                "swap": field.neg(1),
                "scale": step.x,
                "affine": 1,
            }[step.name];
            mod = field.mul(mod, mult);
        });
        return mod;
    },
    // Applies zero or more steps to the given rows.
    apply: function(field, rows, steps) {
        steps.forEach(function(step) {
            if (step.name == "swap") {
                var tmp = rows[step.i];
                rows[step.i] = rows[step.j];
                rows[step.j] = tmp;
            }
            if (step.name == "scale") {
                rows[step.i] = rows[step.i].map(function(elem) {
                    return field.mul(elem, step.x);
                });
            }
            if (step.name == "affine") {
                rows[step.i] = rows[step.i].map(function(elem, k) {
                    return field.add(elem, field.mul(step.x, rows[step.j][k]));
                });
            }
        });
    }
};

// Return rows of an n x m zero matrix.
function zero_mat(n, m) {
    return range(n).map(function() {
        return range(m).map(function() {
            return 0;
        });
    });
}

// Concatenate matrices side-by-side
function concat_mats(mats) {
    if (mats.length === 0)
        throw "Need more than zero matrices to concat";
    var nrows = mats[0].n;
    var rows = range(nrows).map(function() {return [];});
    mats.forEach(function(mat) {
        if (mat.n != nrows)
            throw "All matrices must have same number of rows";
        rows = rows.map(function(row, i) {
            return row.concat(mat.rows[i]);
        });
    });
    return mats[0].field.mat(rows);
}

// Assemble vectors into a matrix.
function assemble_vecs(vecs) {
    var nrows = vecs[0].n;
    vecs.forEach(function(vec) {
        if (vec.n != nrows)
            throw "All vectors must be equal length";
    });
    var rows = range(nrows).map(function() {return range(vecs.length);});
    for (var j = 0; j < vecs.length; j++)
        for (var i = 0; i < nrows; i++)
            rows[i][j] = vecs[j].rows[i][0];
    return vecs[0].field.mat(rows);
}

// Tests whether the vector lies in the linear span of a basis.
function within_span(basis_mat, vec) {
    var aug_mat = concat_mats([basis_mat, vec]);
    return aug_mat.rank() == basis_mat.rank();
}


// Return a list of [0, n).
function range(n) {
    var arr = Array.apply(null, Array(n));
    return arr.map(function(_, i) {return i;});
}

// Return base ^ exp (mod m)
function pow_mod(base, exp, m) {
    var pow2 = base % m;
    var accum = 1;
    while (exp !== 0) {
        if (exp % 2 == 1)
            accum = (pow2 * accum) % m;
        pow2 = (pow2 * pow2) % m;
        exp = (exp / 2) | 0; // Round down
    }
    return accum;
}
