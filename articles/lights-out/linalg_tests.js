// Suppose we were to solve every nxn linear system over
// F_p. There are pn^2 such matrices, and pn vectors,
// giving p^2 n^3 computations.
//
// p |n=1 n=2  n=3  n=4
// --------------------
// 2 |  4  32  108  256
// 3 |  9  72  243  576
// 5 | 25 200  675 1600
// 7 | 49 392 1323 3136
//
// Let's do p=5, n=2 for 200 computations. (Keep in mind that
// the complexity of Gauss-Jordan elimination is n^3).
//
// Count the elements of GL_n(Fp), the n x n matrices over
// Fp which have nonzero determinant.
// This should be the product from i = {0, ..., n-1} of
// (p^n - p^i). (First we choose any nonzero vector. Then
// any vector not in the linear span of the first vector.
// And so on.)
// SL_n(Fp), the n x n matrices with determinant 1, should
// be the size of GL_n(Fp) divided by p-1, since it forms
// the kernel of the determinant homomorphism.

function GL_size(p, n) {
    var prod = 1;
    for (var i = 0; i < n; i++)
        prod *= Math.pow(p, n) - Math.pow(p, i);
    return prod;
}
function SL_size(p, n) {
    return GL_size(p, n) / (p - 1);
}

var p = 3;
var n = 2;
var gls = 0;
var sls = 0;
for_each_mat(p, n, function(matrix) {
    matrix.reduce();
    if (matrix.det !== 0) gls++;
    if (matrix.det == 1) sls++;
    for_each_vec(p, n, function(vector) {
        var soln = solve_Axb(matrix, vector);
        // Works for matrices with full rank.
        if (!matrix.mul(soln).eq(vector) && matrix.pivots.length == n) {
            console.log("Error");
            console.log("A");
            console.log(matrix.str());
            console.log("x");
            console.log(soln.str());
            console.log("A");
            console.log(vector.str());
            throw nope;
        }
    });
});
if (gls != GL_size(p, n))
    console.log("Counted", gls, "GL matrices, wanted", GL_size(p, n));
if (sls != SL_size(p, n))
    console.log("Counted", sls, "SL matrices, wanted", SL_size(p, n));

function for_each_mat(p, n, func) {
    var rows = zero_mat(n, n);
    var field = prime_field(p);

    var rec = function(i, j) {
        if (i == n) {
            i = 0;
            j++;
        }
        if (j == n) {
            func(field.mat(rows));
            return;
        }
        for (var elem = 0; elem < p; elem++) {
            rows[i][j] = elem;
            rec(i+1, j);
        }
    };

    rec(0, 0);
}

function for_each_vec(p, n, func) {
    // Zero vector
    var vector = range(n).map(function() {return 0;});
    var field = prime_field(p);

    var rec = function(i) {
        if (i == n) {
            func(field.vec(vector));
            return;
        }
        for (var elem = 0; elem < p; elem++) {
            vector[i] = elem;
            rec(i+1);
        }
    };

    rec(0);
}

var fool_notebook_vec = prime_field(3).vec(
    [2,0,0,1,2]
);
var fool_notebook_mat = prime_field(3).mat([
    [1,1,0,0,0,0],
    [1,0,1,0,1,0],
    [0,1,1,1,0,0],
    [0,0,0,1,1,1],
    [0,0,0,0,0,1]
]);
