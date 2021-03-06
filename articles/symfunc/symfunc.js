"use strict";
// Compare two lists of numbers in lex order.
function compareLists(a, b) {
    var i = 0;
    for (; i < a.length && i < b.length; i++) {
        if (a[i] < b[i])
            return -1;
        if (a[i] > b[i])
            return 1;
    }
    if (i == a.length && i < b.length)
        return -1;
    if (i < a.length && i == b.length)
        return 1;
    return 0;
}
function assertOrCrash(cond, msg) {
    if (!cond) {
        var message = "Assertion failed" + ((msg == undefined) ? "." : ": " + msg);
        throw new Error(message);
    }
}
/// <reference path="util.ts"/>
function isPartition(nums) {
    for (var i = 1; i < nums.length; i++)
        if (nums[i - 1] < nums[i])
            return false;
    if (nums.length > 0 && nums[nums.length - 1] <= 0)
        return false;
    return true;
}
// A vertex is highest-weight if it is a lattice word, meaning that every prefix of
// the word has partition weight. This means that reading from the left to the right,
// partitions can be built by adding a cell in the row specified by the letter, for
// example the word 11231 has successive partitions [1], [2], [2, 1], [2, 1, 1], and
// [3, 1, 1], and so is a lattice word.
//    This function takes an argument which should be the partition to start from, as
// if the function had already been run on a prefix of the word.
function latticeWordToMaybePartition(sofar, word) {
    var partition = sofar.slice(0);
    for (var i = 0; i < word.length; i++) {
        var num = word[i];
        if (num - 1 == partition.length)
            partition.push(1);
        else if (num == 1)
            partition[0] += 1;
        else if (num - 1 > partition.length)
            return null;
        else {
            if (partition[num - 2] > partition[num - 1])
                partition[num - 1] += 1;
            else
                return null;
        }
    }
    return partition;
}
// Convert a highest-weight crystal vertex to its corresponding partition.
function hwToPartition(v) {
    var result = latticeWordToMaybePartition([], v);
    if (result == null)
        assertOrCrash(false, "Given vertex " + v + " was not a partition");
    return result;
}
// Test whether a crystal element is highest-weight.
function isLatticeWord(v) {
    return latticeWordToMaybePartition([], v) != null;
}
// In order to take the tensor products AxB of two crystals A, B given by highest
// weights, we need to generate the crystal B. (All highest weight elements in A x B
// come from a highest-weight element of A, paired with some element of B satsifying
// extra conditions). For this we will implement the crystal f_i operator, from which
// we can build the crystal.
// f_i takes a crystal vertex, and returns the index that would be modified by moving
// along the arrow f_i, or -1 if the vertex would be killed.
// Inside the tensor power of the basic crystal, we may describe f_i as follows.
// Think of each occurence of i as a (, and each i+1 as a ). Other letters are ignored.
// f_i then acts by changing the leftmost unmatched ( into an i+1. We do this via a stack.
//   Scan the letters of the vertex from left to right, pushing the current index onto
// the stack when we see a (, and popping from the stack when we see a ). The leftmost
// unmatched (if any) will be found at the bottom of the stack.
// Finally, for efficiency, we don't actually keep a stack, but just two numbers: what
// would be at the bottom of the stack, and the height of the stack.
function crystal_f(i, v) {
    var bottom = 0;
    var size = 0;
    for (var j = 0; j < v.length; j++) {
        if (v[j] == i) {
            if (size <= 0) {
                bottom = j;
                size = 0;
            }
            size++;
        }
        else if (v[j] == i + 1)
            size--;
    }
    return (size <= 0) ? -1 : bottom;
}
// We also need to make sure it makes sense to expand the vertex in the specified
// GL_n. For this, we introduce the "height" of a vertex, which is the maximum
// element it contains (it is the height of the longest column, seen as a partition).
function vertexHeight(v) {
    var max = 0;
    for (var i = 0; i < v.length; i++)
        max = Math.max(max, v[i]);
    return max;
}
// This silly datastructure will keep track of which elements we have seen during
// the traversal of the crystal.
var NumsSet = /** @class */ (function () {
    function NumsSet() {
        this.elems = {};
    }
    NumsSet.prototype.add = function (nums) { this.elems[nums.join("|")] = null; };
    NumsSet.prototype.has = function (nums) { return this.elems.hasOwnProperty(nums.join("|")); };
    return NumsSet;
}());
function visitGLnCrystal(n, start, visit) {
    assertOrCrash(isLatticeWord(start));
    assertOrCrash(vertexHeight(start) <= n);
    // Convert each array to a string and put it in this object to keep track of
    // what we have seen so far.
    var seen = {};
    // Initially, we have the top vertex.
    seen[start.toString()] = null;
    visit(start);
    // The state of the DFS will be a quadruple of the following:
    // A list giving the vertex we are currently at, modified as we move around the crystal.
    var mutVert = start.slice(0);
    // A stack of which index we modified on each step down the current path.
    var mutStack = [];
    // A stack telling us where to resume expanding when we move back up the current path.
    var expStack = [];
    // An integer in the range [1, n] telling us which crystal operator to try next.
    // If toExpand = n, then this triggers a backtrack.
    var toExpand = 1;
    for (;;) {
        // Backtrack step.
        if (toExpand == n) {
            // Are we done with the whole crystal?
            if (mutStack.length == 0)
                break;
            // Backtrack one vertex along the path.
            mutVert[mutStack.pop()] -= 1;
            toExpand = expStack.pop();
            continue;
        }
        // Check along the edge f_i out of the current vertex.
        var maybeIdx = crystal_f(toExpand, mutVert);
        // If there was no edge, move onto the next.
        if (maybeIdx < 0) {
            toExpand += 1;
            continue;
        }
        // We did find an outgoing edge.
        mutVert[maybeIdx] += 1;
        // If we've seen it before, ignore it.
        var mutVertStr = mutVert.toString();
        if (seen.hasOwnProperty(mutVertStr)) {
            mutVert[maybeIdx] -= 1;
            toExpand += 1;
            continue;
        }
        // Otherwise, visit it, add it to our seen set, and move to it.
        seen[mutVertStr] = null;
        visit(mutVert);
        mutStack.push(maybeIdx);
        expStack.push(toExpand + 1);
        toExpand = 1;
    }
}
// Return the whole crystal of GL_n below the given starting vertex.
function expandInGL(n, start) {
    var crystal = [];
    visitGLnCrystal(n, start, function (v) { return crystal.push(v.slice(0)); });
    return crystal;
}
// Return the hook length of the cell (i, j) of a partition. (i, j) are 
// 0-indexed.
function hookLength(part, i, j) {
    var k = 0;
    while (i + k + 1 < part.length && part[i + k + 1] > j)
        k++;
    return k + part[i] - j;
}
// Compute quickly the dimension of a representation of the symmetric group.
function dimensionSymmetric(partition) {
    assertOrCrash(isPartition(partition));
    var product = 1;
    var count = 1;
    for (var i = 0; i < partition.length; i++)
        for (var j = 1; j <= partition[i]; j++)
            product *= (count++) / hookLength(partition, i, j - 1);
    // Lol these dank floating points
    return Math.round(product);
}
// Compute quickly the dimension of a representation of GL_n.
function dimensionInGL(n, partition) {
    assertOrCrash(isPartition(partition));
    var product = 1;
    for (var i = 0; i < partition.length; i++)
        for (var j = 1; j <= partition[i]; j++)
            product *= (n + j - (i + 1)) / hookLength(partition, i, j - 1);
    // Lol these dank floating points
    return Math.round(product);
}
// Produce some highest-weight vector of the given weight from a partition. There are many such
// embeddings, we use the one which sends [4, 2, 1] to [1, 1, 1, 1, 2, 2, 3].
function partitionToHw(part) {
    assertOrCrash(isPartition(part));
    var v = [];
    for (var i = 0; i < part.length; i++)
        for (var j = 0; j < part[i]; j++)
            v.push(i + 1);
    return v;
}
// Tensor partitions as if in the representation ring of GL_n.
function tensorPartitions(n, partLeft, partRight) {
    assertOrCrash(n >= 2 && isPartition(partLeft) && isPartition(partRight));
    // Optimisation: check which one has smaller dimension, and put it on the right.
    var _a = [dimensionInGL(n, partLeft), dimensionInGL(n, partRight)], dim1 = _a[0], dim2 = _a[1];
    if (dim1 < dim2)
        _b = [partRight, partLeft], partLeft = _b[0], partRight = _b[1];
    // Now, traverse the crystal and accumulate those vertices which induce a highest-weight
    // in the tensor product.
    var partitions = [];
    visitGLnCrystal(n, partitionToHw(partRight), function (v) {
        var maybePartition = latticeWordToMaybePartition(partLeft, v);
        if (maybePartition != null)
            partitions.push(maybePartition);
    });
    return partitions;
    var _b;
}
/// <reference path="crystal.ts"/>
// The unit inclusion Z -> Algebra.
function algebraUnit(num) {
    return [{ part: [], mult: num }];
}
// Place a partition into the algebra.
function algebraPart(part) {
    assertOrCrash(isPartition(part));
    return [{ part: part, mult: 1 }];
}
// Normalise to sorted form, without duplicates or items of multiplicity 0.
function algebraNormalise(lin) {
    var sorted = lin.slice(0).sort(function (_a, _b) {
        var part1 = _a.part;
        var part2 = _b.part;
        return -compareLists(part1, part2);
    });
    var result = [];
    for (var _i = 0, sorted_1 = sorted; _i < sorted_1.length; _i++) {
        var _a = sorted_1[_i], part = _a.part, mult = _a.mult;
        if (mult == 0)
            continue;
        if (result.length == 0 || compareLists(result[result.length - 1].part, part) != 0)
            result.push({ part: part, mult: mult });
        else {
            var newMult = result[result.length - 1].mult + mult;
            if (newMult == 0)
                result.pop();
            else
                result[result.length - 1].mult = newMult;
        }
    }
    return result;
}
// Addition of linear combinations.
function algebraAdd() {
    var lins = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        lins[_i] = arguments[_i];
    }
    return algebraNormalise((_a = []).concat.apply(_a, lins));
    var _a;
}
// The next few operations are dependent on which algebra we are working in. We also
// need a way to restricted injected partitions to the given algebra.
var AlgebraType = /** @class */ (function () {
    function AlgebraType(algebra, n) {
        this.algebra = algebra;
        this.n = n;
    }
    AlgebraType.GL = function (n) {
        assertOrCrash(n >= 2);
        return new AlgebraType('gl', n);
    };
    AlgebraType.prototype.restrict = function (lin) {
        var _this = this;
        if (this.algebra == 'gl') {
            var restricted = lin.filter(function (elem) { return elem.part.length <= _this.n; });
            return (restricted.length == 0) ? algebraUnit(0) : restricted;
        }
        return lin;
    };
    // Return in which GL_n the two partitions should be tensored.
    AlgebraType.prototype.tensorIn = function (part1, part2) {
        return (this.algebra == 'gl') ? this.n : part1.length + part2.length;
    };
    // Dimension of the irreducible corresponding to the given partition.
    AlgebraType.prototype.dimension = function (part) {
        return (this == AlgebraType.Sym) ? dimensionSymmetric(part) : dimensionInGL(this.n, part);
    };
    AlgebraType.Sym = new AlgebraType('sym', 0);
    return AlgebraType;
}());
// Multiplication of linear combinations, given which algebra we are working over.
function algebraMul(type) {
    var lins = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        lins[_i - 1] = arguments[_i];
    }
    if (lins.length == 0)
        return algebraUnit(1);
    var sofar = lins[0];
    for (var i = 1; i < lins.length; i++) {
        var product = [];
        for (var _a = 0, sofar_1 = sofar; _a < sofar_1.length; _a++) {
            var _b = sofar_1[_a], part1 = _b.part, mult1 = _b.mult;
            for (var _c = 0, _d = lins[i]; _c < _d.length; _c++) {
                var _e = _d[_c], part2 = _e.part, mult2 = _e.mult;
                if (part1.length == 0) {
                    product.push({ part: part2, mult: mult1 * mult2 });
                    continue;
                }
                if (part2.length == 0) {
                    product.push({ part: part1, mult: mult1 * mult2 });
                    continue;
                }
                for (var _f = 0, _g = tensorPartitions(type.tensorIn(part1, part2), part1, part2); _f < _g.length; _f++) {
                    var part = _g[_f];
                    product.push({ part: part, mult: mult1 * mult2 });
                }
            }
        }
        sofar = algebraNormalise(product);
    }
    return sofar;
}
// Represent a linear combination as a string.
function algebraString(lin) {
    var output = [];
    for (var _i = 0, lin_1 = lin; _i < lin_1.length; _i++) {
        var _a = lin_1[_i], part = _a.part, mult = _a.mult;
        var multStr = "" + mult;
        var partStr = "[" + part.join(", ") + "]";
        if (partStr == "[]") {
            output.push(multStr);
            continue;
        }
        if (multStr == "1")
            multStr = "";
        output.push(multStr + partStr);
    }
    if (output.length == 0)
        return "0";
    return output.join(" + ");
}
/// <reference path="algebra.ts"/>
var precedence = { '+': 0, '*': 1 };
var ParseError = /** @class */ (function () {
    function ParseError(pos, extent, msg) {
        this.pos = pos;
        this.extent = extent;
        this.msg = msg;
    }
    return ParseError;
}());
var Item = /** @class */ (function () {
    function Item(item, pos) {
        this.item = item;
        this.pos = pos;
    }
    return Item;
}());
function evaluate(type, str) {
    var rpnResult = toRPN(str);
    if (rpnResult instanceof ParseError)
        return rpnResult;
    var items = rpnResult;
    var stack = [];
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var _a = items_1[_i], item = _a.item, pos = _a.pos;
        if (typeof item == 'number')
            stack.push(algebraUnit(item));
        else if (item instanceof Array)
            stack.push(type.restrict(algebraPart(item)));
        else {
            if (stack.length < 2)
                return new ParseError(pos, 1, "Not enough arguments to " + item);
            var right = stack.pop();
            var left = stack.pop();
            if (item == '+')
                stack.push(algebraAdd(left, right));
            else if (item == '*')
                stack.push(algebraMul(type, left, right));
        }
    }
    if (stack.length != 1)
        return new ParseError(0, str.length, "Missing operations");
    return stack[0];
}
function toRPN(str) {
    var opStack = [];
    var outQueue = [];
    var re = /\s+|\d+|[+*()]|\[\s*\]|\[\s*\d+\s*(,\s*\d+\s*)*\]/g;
    var matchArray;
    var lastToken = "";
    var nextIndex = 0;
    var currentPos = 0;
    var pushOp = function (tok) { return opStack.push({ tok: tok, pos: currentPos }); };
    var itemFromOp = function (_a) {
        var tok = _a.tok, pos = _a.pos;
        return new Item(tok, pos);
    };
    while ((matchArray = re.exec(str)) != null) {
        var token = matchArray[0];
        currentPos = matchArray.index;
        if (matchArray.index != nextIndex) {
            var pos = nextIndex;
            var extent = currentPos - pos;
            var bad = str.slice(pos, pos + extent);
            return new ParseError(pos, extent, "Unrecognised token \"" + bad + "\"");
        }
        nextIndex = currentPos + token.length;
        if (token[0] == '[') {
            var nums = extractNums(token);
            if (!isPartition(nums))
                return new ParseError(currentPos, token.length, "Partitions are weakly decreasing sequences of positive integers: " + token + " is not a partition.");
            // Hackery so I can write 2[3, 1]
            if (lastToken.match(/\d+/))
                pushOp('*');
            outQueue.push(new Item(nums, currentPos));
        }
        else if (token.match(/^\s+/) != null) {
            // Skip whitespace
        }
        else if (token.match(/\d+/))
            outQueue.push(new Item(parseInt(token, 10), currentPos));
        else if (token == '(')
            pushOp('(');
        else if (token.match(/[+*]/) != null) {
            while (opStack.length != 0 && precedence[opStack[opStack.length - 1].tok] >= precedence[token])
                outQueue.push(itemFromOp(opStack.pop()));
            pushOp(token);
        }
        else if (token == ')') {
            while (opStack.length != 0 && opStack[opStack.length - 1].tok != '(') {
                outQueue.push(itemFromOp(opStack.pop()));
            }
            if (opStack.length == 0 || opStack.pop().tok != '(')
                return new ParseError(matchArray.index, 1, 'Unmatched closing parenthesis');
        }
        else {
            assertOrCrash(false);
        }
        lastToken = token;
    }
    if (nextIndex != str.length)
        return new ParseError(nextIndex, str.length - nextIndex, "Unrecognised token.");
    while (opStack.length != 0) {
        var _a = opStack.pop(), tok = _a.tok, pos = _a.pos;
        if (tok == '(')
            return new ParseError(pos, 1, 'Unmatched opening parenthesis.');
        outQueue.push(new Item(tok, pos));
    }
    return outQueue;
}
// Extract all contiguous strings of digits from a string.
function extractNums(str) {
    var matches = str.match(/\d+/g);
    if (matches == null)
        return [];
    return matches.map(function (s) { return parseInt(s, 10); });
}
/// <reference path="src/parse.ts"/>
// Read a configuration out of the config form.
function readConfig() {
    var $checked = document.querySelector('input[name="algebra"]:checked');
    var $number = document.getElementById('gln');
    if ($number.valueAsNumber < 2)
        $number.value = '' + 2;
    if ($checked.value == 'sym')
        return AlgebraType.Sym;
    return AlgebraType.GL($number.valueAsNumber);
}
// Read the config and do a computation.
function doComputation() {
    var $computation = document.getElementById('computation');
    var $result = document.getElementById('result');
    var $error = document.getElementById('error');
    var $errorMessage = document.getElementById('errorMessage');
    var $errorInput = document.getElementById('errorInput');
    var input = $computation.value;
    var algebraType = readConfig();
    var maybeResult = evaluate(algebraType, input);
    if (maybeResult instanceof ParseError) {
        $error.style.display = 'block';
        $errorMessage.innerText = maybeResult.msg;
        $errorInput.innerHTML = frameError(maybeResult, input);
    }
    else {
        $error.style.display = 'none';
    }
    var lin = (maybeResult instanceof ParseError) ? algebraUnit(0) : maybeResult;
    $result.innerText = algebraString(lin);
    writeTable(algebraType, lin);
}
// Write the table of details
function writeTable(algebraType, lin) {
    var $table = document.getElementById('decomposition');
    var $td = function () { return document.createElement('td'); };
    var $th = function () { return document.createElement('th'); };
    var $row = function (cellFn) {
        var cells = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            cells[_i - 1] = arguments[_i];
        }
        var row = document.createElement('tr');
        for (var _a = 0, cells_1 = cells; _a < cells_1.length; _a++) {
            var val = cells_1[_a];
            var cell = cellFn();
            cell.innerText = val;
            row.appendChild(cell);
        }
        return row;
    };
    var rows = [$row($th, 'Partition', 'Multiplicity', 'Dimension')];
    for (var _i = 0, lin_2 = lin; _i < lin_2.length; _i++) {
        var _a = lin_2[_i], part = _a.part, mult = _a.mult;
        rows.push($row($td, '[' + part.join(', ') + ']', '' + mult, '' + algebraType.dimension(part)));
    }
    $table.innerHTML = '';
    for (var _b = 0, rows_1 = rows; _b < rows_1.length; _b++) {
        var row = rows_1[_b];
        $table.appendChild(row);
    }
}
// Return some nice pretty error code.
function frameError(err, str) {
    var stringParts = [
        str.slice(0, err.pos),
        '<span class="error">',
        str.slice(err.pos, err.pos + err.extent),
        '</span>',
        str.slice(err.pos + err.extent),
    ];
    return stringParts.join("");
}
// Set up event handlers.
var $computationForm = document.getElementById('computationForm');
$computationForm.addEventListener('submit', function (event) {
    event.preventDefault();
});
$computationForm.addEventListener('change', function (event) {
    event.preventDefault();
    doComputation();
});
// Fire inital computation.
doComputation();
//# sourceMappingURL=symfunc.js.map