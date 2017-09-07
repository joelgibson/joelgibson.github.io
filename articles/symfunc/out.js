"use strict";
// A vertex is highest-weight if it is a lattice word, meaning that every prefix of
// the word has partition weight. This means that reading from the left to the right,
// partitions can be built by adding a cell in the row specified by the letter, for
// example the word 11231 has successive partitions [1], [2], [2, 1], [2, 1, 1], and
// [3, 1, 1], and so is a lattice word.
//   The following function tests whether the given crystal vertex is highest-weight
// by building and returning the final partition, or returning null if the vertex was
// not highest-weight.
function hwToMaybePartition(v) {
    var partition = [];
    for (var i = 0; i < v.length; i++) {
        var num = v[i];
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
    var result = hwToMaybePartition(v);
    if (result == null)
        assertOrCrash(false, "Given vertex " + v + " was not a partition");
    return result;
}
// Test whether a crystal element is highest-weight.
function isLatticeWord(v) {
    return hwToMaybePartition(v) != null;
}
// In order to take the tensor products AxB of two crystals A, B given by highest
// weights, we need to generate the crystal B. (All highest weight elements in A x B
// come from a highest-weight element of A, paired with some element of B satsifying
// extra conditions). For this we will implement the crystal f_i operator, from which
// we can build the crystal.
// f_i takes a crystal vertex, and either creates a new crystal vertex (with weight
// modified by alpha_i), or kills it. Inside the tensor power of the basic crystal, it
// has the following description. Think of each occurence of i as a (, and each i+1 as
// a ). Other letters are ignored. f_i then acts by changing the leftmost unmatched (
// into an i+1. We do this via a stack.
//   Scan the letters of the vertex from left to right, pushing the current index onto
// the stack when we see a (, and popping from the stack when we see a ). The leftmost
// unmatched (if any) will be found at the bottom of the stack.
function crystal_f(i, v) {
    var stack = [];
    for (var j = 0; j < v.length; j++) {
        if (v[j] == i)
            stack.push(j);
        else if (v[j] == i + 1)
            stack.pop();
    }
    if (stack.length == 0)
        return null;
    var modify = stack[0];
    var newvert = v.slice(0);
    newvert[modify] = i + 1;
    return newvert;
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
// Generate the whole crystal of sl_n below the given starting vertex, which must
// be highest-weight.
function expandInGL(n, start) {
    assertOrCrash(isLatticeWord(start));
    assertOrCrash(vertexHeight(start) <= n);
    // Keep a list of elements seen in the crystal, backed by a set for fast
    // testing of whether we have come across it before.
    var crystal = [start];
    var seen = new NumsSet();
    seen.add(start);
    // Perform a breadth-first search of the crystal.
    var frontier = [start];
    while (frontier.length != 0) {
        var new_frontier = [];
        for (var j = 0; j < frontier.length; j++) {
            var v = frontier[j];
            for (var i = 1; i < n; i++) {
                var result = crystal_f(i, v);
                if (result != null && !seen.has(result)) {
                    seen.add(result);
                    new_frontier.push(result);
                }
            }
        }
        for (var i = 0; i < new_frontier.length; i++)
            crystal.push(new_frontier[i]);
        frontier = new_frontier;
    }
    return crystal;
}
// The tensor product of a highest-weight vertex with an expanded crystal
// is now easy to write. This function returns a list of the highest-weight
// elements in the tensor product.
function tensorHwWithCrystal(v, crystal) {
    var result = [];
    for (var i = 0; i < crystal.length; i++) {
        var tensorElem = v.concat(crystal[i]);
        if (isLatticeWord(tensorElem))
            result.push(tensorElem);
    }
    return result;
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
// Test whether the given list of numbers is a partition.
function isPartition(nums) {
    for (var i = 1; i < nums.length; i++)
        if (nums[i - 1] < nums[i])
            return false;
    if (nums.length > 0 && nums[nums.length - 1] <= 0)
        return false;
    return true;
}
// We will also want to represent a partition as a highest-weight element in some
// crystal. There are many ways of doing this, but there is a simple one that always
// works. We number the Young diagram associated to the partition by filling the first
// row with 1's, the second row with 2's, and so on. Then we take the left-to-right,
// top-to-bottom row reading.
function partitionToHw(part) {
    assertOrCrash(isPartition(part));
    var v = [];
    for (var i = 0; i < part.length; i++)
        for (var j = 0; j < part[i]; j++)
            v.push(i + 1);
    return v;
}
// The only valid way of constructing something of type Schur from primitives is the following
// two functions. The first injects units into the algebra, the second injects partitions in.
function schurUnit(num) {
    return [{ part: [], mult: num }];
}
function schurPart(part) {
    assertOrCrash(isPartition(part));
    return [{ part: part, mult: 1 }];
}
// Normalise to sorted form, without duplicates or items of multiplicity 0.
function schurNormalise(schur) {
    schur = schur.slice(0);
    schur.sort(function (_a, _b) {
        var part1 = _a.part;
        var part2 = _b.part;
        return -compareLists(part1, part2);
    });
    var result = [];
    for (var _i = 0, schur_1 = schur; _i < schur_1.length; _i++) {
        var _a = schur_1[_i], part = _a.part, mult = _a.mult;
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
// TODO: Do I use this anywhere?
function schurEq(a, b) {
    if (a.length != b.length)
        return false;
    return a.every(function (_a, i) {
        var part = _a.part;
        return compareLists(part, b[i].part) == 0;
    });
}
function schurAdd() {
    var schurs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        schurs[_i] = arguments[_i];
    }
    return schurNormalise((_a = []).concat.apply(_a, schurs));
    var _a;
}
// Tensor partitions as if in the representation ring of GL_n. If the given n = 0, then
// n will be taken large enough such that the tensor product appears to be happening in
// the Symmetric Function ring.
function tensorPartitions(n, part1, part2) {
    assertOrCrash(isPartition(part1) && isPartition(part2));
    if (n == 0)
        n = part1.length + part2.length + 1;
    var _a = [partitionToHw(part1), partitionToHw(part2)], v1 = _a[0], v2 = _a[1];
    var crystal2 = expandInGL(n, v2);
    var newHws = tensorHwWithCrystal(v1, crystal2);
    return schurAdd.apply(void 0, newHws.map(hwToMaybePartition).map(schurPart));
}
var SymAlgebra = { algebra: 'sym', n: 0 };
function GLAlgebra(n) {
    assertOrCrash(n >= 2);
    return { algebra: 'gl', n: n };
}
// We need to be able to restrict to the given algebra.
function schurRestrict(type, schur) {
    if (type.algebra == 'gl') {
        var restricted = schur.filter(function (elem) { return elem.part.length <= type.n; });
        if (restricted.length == 0)
            return schurUnit(0);
        return restricted;
    }
    return schur;
}
// Tensor the terms in the specified algebra.
function schurTensor(config) {
    var schurs = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        schurs[_i - 1] = arguments[_i];
    }
    if (schurs.length == 0)
        return schurUnit(1);
    var sofar = schurs[0];
    for (var i = 1; i < schurs.length; i++) {
        var product = [];
        for (var _a = 0, sofar_1 = sofar; _a < sofar_1.length; _a++) {
            var _b = sofar_1[_a], part1 = _b.part, mult1 = _b.mult;
            for (var _c = 0, _d = schurs[i]; _c < _d.length; _c++) {
                var _e = _d[_c], part2 = _e.part, mult2 = _e.mult;
                for (var _f = 0, _g = tensorPartitions(config.n, part1, part2); _f < _g.length; _f++) {
                    var _h = _g[_f], part = _h.part, mult = _h.mult;
                    product.push({ part: part, mult: mult * mult1 * mult2 });
                }
            }
        }
        sofar = schurNormalise(product);
    }
    return sofar;
}
// Convert to a string in a mildly sensible fashion.
function schurString(schur) {
    var output = [];
    for (var _i = 0, schur_2 = schur; _i < schur_2.length; _i++) {
        var _a = schur_2[_i], part = _a.part, mult = _a.mult;
        var multStr = "" + mult;
        var partStr = "[" + part.join(", ") + "]";
        if (partStr == "[]") {
            output.push(multStr);
            continue;
        }
        if (multStr == "1")
            multStr = "";
        if (multStr == "-1")
            multStr = "-";
        output.push(multStr + partStr);
    }
    if (output.length == 0)
        return "0";
    return output.join(" + ");
}
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
/// <reference path="crystal.ts"/>
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
            stack.push(schurUnit(item));
        else if (item instanceof Array)
            stack.push(schurRestrict(type, schurPart(item)));
        else {
            if (stack.length < 2)
                return new ParseError(pos, 1, "Not enough arguments to " + item);
            var right = stack.pop();
            var left = stack.pop();
            if (item == '+')
                stack.push(schurAdd(left, right));
            else if (item == '*')
                stack.push(schurTensor(type, left, right));
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
                return new ParseError(currentPos, token.length, "\"" + token + "\" is not a partition.");
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
/// <reference path="crystal.ts"/>
/// <reference path="parse.ts"/>
// Read a configuration out of the config form.
function readConfig() {
    var $checked = document.querySelector('input[name="algebra"]:checked');
    var $number = document.getElementById('gln');
    if ($number.valueAsNumber < 2)
        $number.value = '' + 2;
    if ($checked.value == 'sym')
        return SymAlgebra;
    return GLAlgebra($number.valueAsNumber);
}
// Read the config and do a computation.
function doComputation() {
    var $computation = document.getElementById('computation');
    var $result = document.getElementById('result');
    var $error = document.getElementById('error');
    var $errorMessage = document.getElementById('errorMessage');
    var $errorInput = document.getElementById('errorInput');
    var text = $computation.value;
    var config = readConfig();
    var result = evaluate(config, text);
    var resultSchur = schurUnit(0);
    if (result instanceof ParseError) {
        $error.style.display = 'block';
        $errorMessage.innerText = result.msg;
        $errorInput.innerHTML = frameError(result, text);
    }
    else {
        $error.style.display = 'none';
        resultSchur = result;
    }
    var resultStr = schurString(resultSchur);
    $result.innerText = resultStr;
    writeTable(resultSchur);
}
// Write the table of details
function writeTable(schur) {
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
    var config = readConfig();
    var rows = [$row($th, 'Partition', 'Multiplicity', 'Dimension')];
    for (var _i = 0, schur_3 = schur; _i < schur_3.length; _i++) {
        var _a = schur_3[_i], part = _a.part, mult = _a.mult;
        rows.push($row($td, '[' + part.join(', ') + ']', '' + mult, '' + ((config.algebra == 'sym') ? dimensionSymmetric(part) : dimensionInGL(config.n, part))));
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
    doComputation();
});
$computationForm.addEventListener('change', function (event) {
    doComputation();
});
// Fire inital computation.
doComputation();
