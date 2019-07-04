"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// Assert that a condition is true, otherwise crash the program with a message.
function assert(cond, msg) {
    if (cond)
        return;
    var message = "Assertion failed" + ((msg == undefined) ? "." : ": " + msg);
    throw new Error(message);
}
// Memoise a function
function memoised(f) {
    var memoTable = {};
    return function (k) {
        var kString = JSON.stringify(k);
        if (!memoTable.hasOwnProperty(kString))
            memoTable[kString] = f(k);
        return memoTable[kString];
    };
}
// Generate the list of numbers [1, 2, ..., n].
function range(n) {
    var numbers = [];
    for (var i = 1; i <= n; i++)
        numbers.push(i);
    return numbers;
}
// The sum of a list.
function sum(ns) {
    return ns.reduce(function (a, b) { return a + b; }, 0);
}
// The product of a list.
function product(ns) {
    return ns.reduce(function (a, b) { return a * b; }, 1);
}
// The factorial of n.
var factorial = memoised(factorialHelp);
function factorialHelp(n) {
    assert(n >= 0);
    return product(range(n));
}
// The greatest common divisor of two integers.
function gcd(a, b) {
    if (b == 0)
        return a;
    return gcd(b, a % b);
}
// Check that a list is weakly decreasing, i.e. [a >= b >= ... >= d].
function isWeaklyDecreasing(ns) {
    for (var i = 0; i < ns.length - 1; i++)
        if (ns[i] < ns[i + 1])
            return false;
    return true;
}
// Check a list is a partition.
function isPartition(ns) {
    return isWeaklyDecreasing(ns) && ns.every(function (x) { return x > 0; });
}
// Turn any weak composition (list of nonnegative integers) into a partition,
// by removing any zero parts, and sorting.
function partitionFromComposition(comp) {
    return comp.filter(function (x) { return x > 0; }).sort(function (a, b) { return b - a; });
}
// Generate all partitions of n, in lex order.
var partitionsOf = memoised(partitionsOfHelper);
function partitionsOfHelper(n) {
    // Helper function: returns all the partitions of n which fit inside a width w strip.
    function helper(n, w) {
        assert(n >= 0);
        assert(w >= 0);
        if (n == 0)
            return [[]];
        if (w <= 0)
            return [];
        var results = [];
        var _loop_1 = function (row) {
            var smaller = helper(n - row, row);
            results.push.apply(results, smaller.map(function (part) { return [row].concat(part); }));
        };
        for (var row = Math.min(n, w); row >= 1; row--) {
            _loop_1(row);
        }
        return results;
    }
    return helper(n, n);
}
// Turn a partition into "group notation", for example the partition
// [4, 4, 3, 2, 2, 2, 1] => [[4, 2], [3, 1], [2, 3], [1, 1]].
function groupPartition(partition) {
    if (partition.length == 0)
        return [];
    var i = 0, j = 0;
    var groups = [];
    while (i < partition.length) {
        for (j = i; j < partition.length; j++)
            if (partition[i] != partition[j])
                break;
        groups.push([partition[i], j - i]);
        i = j;
    }
    return groups;
}
// The symmetric group S_l acts on a partition of length l by permuting the parts.
// When the partition is written in "group notation" [[a1, b1], ..., [ar, br]], the
// order of the stabiliser of this action is b1! * ... * br!.
function stabiliserOrder(partition) {
    var factorials = groupPartition(partition).map(function (_a) {
        var _ = _a[0], b = _a[1];
        return factorial(b);
    });
    return product(factorials);
}
// For a partition of n, how many elements of the symmetric group S_n are conjugate
// to an element with the given cycle type? When the cycle type is written in
// "group notation" [[a1, b1], ..., [ar, br]], the answer is
// n! / ((a1^b1 * ... * ar^br) * (b1! * ... * br!)
var conjugacySize = memoised(conjugacySizeHelp);
function conjugacySizeHelp(cycleType) {
    var n = sum(cycleType);
    var groups = groupPartition(cycleType);
    var factorials = groups.map(function (_a) {
        var _ = _a[0], b = _a[1];
        return factorial(b);
    });
    var powers = groups.map(function (_a) {
        var a = _a[0], b = _a[1];
        return Math.pow(a, b);
    });
    return factorial(n) / (product(powers) * product(factorials));
}
// For an element of the symmetric group with a given cycle type, what cycle type
// does the pth power of that element have? The answer can be computed independently
// for each cycle; for a cycle of size n, the power n^p breaks into gcd(n, p) cycles,
// each of length n / gcd(n, p).
function cyclePow(cycleType, p) {
    var newCycleType = [];
    for (var _i = 0, cycleType_1 = cycleType; _i < cycleType_1.length; _i++) {
        var cycle = cycleType_1[_i];
        var div = gcd(cycle, p);
        for (var i = 0; i < div; i++)
            newCycleType.push(cycle / div);
    }
    return partitionFromComposition(newCycleType);
}
// Turn a partition into a string
function showPartition(partition) {
    return JSON.stringify(partition);
}
// Turn a string into a partition
function readPartition(partition) {
    return JSON.parse(partition);
}
// Return a LaTeX expression of the partition in "group notation", so
// [4, 4, 3, 2, 2, 2, 1] => [4^2, 3^1, 2^3, 1^1].
function showPartitionCompact(partition) {
    return "[" + groupPartition(partition).map(function (_a) {
        var a = _a[0], b = _a[1];
        return a + "^{" + b + "}";
    }).join(",") + "]";
}
// A map of type (Partition -> T). Since Javascript only understands strings as
// may keys, we convert to and from strings a lot.
var PartMap = /** @class */ (function () {
    function PartMap() {
        this.store = {};
    }
    PartMap.prototype.has = function (k) {
        return this.store.hasOwnProperty(showPartition(k));
    };
    PartMap.prototype.get = function (k) {
        var kString = showPartition(k);
        if (!this.store.hasOwnProperty(kString))
            return null;
        return this.store[kString];
    };
    PartMap.prototype.set = function (k, v) {
        this.store[showPartition(k)] = v;
    };
    PartMap.prototype.keys = function () {
        return Object.keys(this.store).map(readPartition);
    };
    return PartMap;
}());
// -----------------------------------------
// --- Linear combinations of partitions ---
// -----------------------------------------
// An integer-linear combination of partitions.
var Lin = /** @class */ (function (_super) {
    __extends(Lin, _super);
    function Lin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Lin.prototype.get = function (k) {
        var coeff = _super.prototype.get.call(this, k);
        if (coeff == null)
            return 0;
        return coeff;
    };
    Lin.prototype.support = function () {
        var _this = this;
        return this.keys().filter(function (k) { return _this.get(k) != 0; });
    };
    Lin.prototype.toList = function () {
        var _this = this;
        return this.support().map(function (k) { return [k, _this.get(k)]; });
    };
    Lin.prototype.show = function (letter) {
        var output = [];
        for (var _i = 0, _a = this.support(); _i < _a.length; _i++) {
            var part = _a[_i];
            var coeffStr = "" + this.get(part);
            var partStr = showPartition(part);
            if (partStr == "[]") {
                output.push(coeffStr);
                continue;
            }
            if (coeffStr == "1")
                coeffStr = "";
            output.push(coeffStr + ((letter === undefined) ? '' : letter) + partStr);
        }
        if (output.length == 0)
            return "0";
        return output.join(" + ");
    };
    Lin.fromList = function (pairs) {
        var lin = new Lin();
        for (var _i = 0, pairs_1 = pairs; _i < pairs_1.length; _i++) {
            var _a = pairs_1[_i], partition = _a[0], coeff = _a[1];
            lin.set(partition, lin.get(partition) + coeff);
        }
        return lin;
    };
    Lin.zero = function () {
        return Lin.fromList([]);
    };
    Lin.scale = function (scalar, lin) {
        return Lin.fromList(lin.toList().map(function (_a) {
            var k = _a[0], v = _a[1];
            return [k, scalar * v];
        }));
    };
    Lin.add = function (left, right) {
        return Lin.fromList(left.toList().concat(right.toList()));
    };
    Lin.sub = function (left, right) {
        return Lin.add(left, Lin.scale(-1, right));
    };
    Lin.applyDiagonal = function (f, lin) {
        return Lin.fromList(lin.toList().map(function (_a) {
            var k = _a[0], v = _a[1];
            return [k, f(k) * v];
        }));
    };
    Lin.applyBilinear = function (f, left, right) {
        var pairs = [];
        for (var _i = 0, _a = left.toList(); _i < _a.length; _i++) {
            var _b = _a[_i], k1 = _b[0], v1 = _b[1];
            for (var _c = 0, _d = right.toList(); _c < _d.length; _c++) {
                var _e = _d[_c], k2 = _e[0], v2 = _e[1];
                pairs.push.apply(pairs, Lin.scale(v1 * v2, f(k1, k2)).toList());
            }
        }
        return Lin.fromList(pairs);
    };
    return Lin;
}(PartMap));
// ------------------------------------
// --- Power sum to monomial basis  ---
// ------------------------------------
// Multiply the monomial symmetric function m_(r) with an augmented monomial symmetric function.
// The product M_r * M(l1, ..., lk) is equal to the sum
//    M(l1 + r, ..., lk) + ... + M(l1, ..., lk + r) + M(r, l1, ..., lk),
// where we need to remember to sort the compositions on the right side back into being partitions.
function multRowWithAugmented(rowPartition, partition) {
    var _a;
    if (partition.length == 1)
        _a = [partition, rowPartition], rowPartition = _a[0], partition = _a[1];
    assert(rowPartition.length == 1);
    var row = rowPartition[0];
    var compositions = partition.map(function (part, i) { return partition.slice(0, i).concat([part + row]).concat(partition.slice(i + 1)); });
    compositions.push(partition.concat([row]));
    return Lin.fromList(compositions.map(function (comp) { return [partitionFromComposition(comp), 1]; }));
}
// Expand a power sum symmetric function into an augmented monomial symmetric function.
function powerToAugmentedMonomial(partition) {
    return partition
        .map(function (part) { return Lin.fromList([[[part], 1]]); })
        .reduce(function (a, b) { return Lin.applyBilinear(multRowWithAugmented, a, b); }, Lin.fromList([[[], 1]]));
}
// Expand a power sum symmetric function into monomial symmetric function.
function powerToMonomial(partition) {
    return Lin.applyDiagonal(stabiliserOrder, powerToAugmentedMonomial(partition));
}
// ----------------------------------------
// --- Characters and character tables  ---
// ----------------------------------------
// A character of the symmetric group is a linear combination of partitions. A character table
// is a map from partitions to such linear combinations.
var CharacterTable = /** @class */ (function (_super) {
    __extends(CharacterTable, _super);
    function CharacterTable(n) {
        var _this = _super.call(this) || this;
        _this.n = n;
        _this.partitions = partitionsOf(n);
        for (var _i = 0, _a = _this.partitions; _i < _a.length; _i++) {
            var partition = _a[_i];
            _this.set(partition, Lin.zero());
        }
        return _this;
    }
    CharacterTable.prototype.get = function (partition) {
        var result = _super.prototype.get.call(this, partition);
        assert(result != null);
        return result;
    };
    return CharacterTable;
}(PartMap));
// To generate the character table for the permutation modules, we just need to transpose the
// turn-power-sums-into-monomial data.
function characterTablePermutation(n) {
    var table = new CharacterTable(n);
    for (var _i = 0, _a = table.partitions; _i < _a.length; _i++) {
        var col = _a[_i];
        for (var _b = 0, _c = powerToMonomial(col).toList(); _b < _c.length; _b++) {
            var _d = _c[_b], row = _d[0], coeff = _d[1];
            table.set(row, Lin.add(table.get(row), Lin.fromList([[col, coeff]])));
        }
    }
    return table;
}
// Inner product on class functions in the symmetric group on n letters.
function innerProduct(n, left, right) {
    return sum(partitionsOf(n).map(function (part) { return left.get(part) * right.get(part) * conjugacySize(part); })) / factorial(n);
}
// Character table for the Specht modules (we will memoise this).
function characterTableSpechtHelper(n) {
    var permTable = characterTablePermutation(n);
    var partitions = partitionsOf(n);
    for (var i = 0; i < partitions.length; i++) {
        // This row of permTable is currently a Specht module. We look at everything below it, compute
        // the inner product, and subtract off where needed.
        var spechtMod = permTable.get(partitions[i]);
        for (var j = i + 1; j < partitions.length; j++) {
            var mod = permTable.get(partitions[j]);
            var multiplicity = innerProduct(n, spechtMod, mod);
            permTable.set(partitions[j], Lin.sub(mod, Lin.scale(multiplicity, spechtMod)));
        }
    }
    return permTable;
}
var characterTableSpecht = memoised(characterTableSpechtHelper);
// Tensor product on class functions in the symmetric group on n letters.
function tensorProduct(n, left, right) {
    var character = Lin.zero();
    for (var _i = 0, _a = partitionsOf(n); _i < _a.length; _i++) {
        var part = _a[_i];
        character.set(part, left.get(part) * right.get(part));
    }
    return character;
}
// Decompose a character into a linear combination of irreducible characters of S_n.
function decomposeCharacter(n, character) {
    var irrCharacters = characterTableSpecht(n);
    return Lin.fromList(partitionsOf(n).map(function (partition) { return [partition, innerProduct(n, irrCharacters.get(partition), character)]; }));
}
// Return the trivial character for S_n.
function trivialCharacter(n) {
    return Lin.fromList(partitionsOf(n).map(function (part) { return [part, 1]; }));
}
// Given a character 𝜒, return the character (g -> 𝜒(g^p)).
function characterPow(n, character, p) {
    return Lin.fromList(partitionsOf(n).map(function (part) { return [part, character.get(cyclePow(part, p))]; }));
}
// Compute the (r + 1) exterior powers 𝛬^0(V), 𝛬^1(V), ..., 𝛬^r(V)
function exteriorPowers(n, r, character) {
    var exteriors = [trivialCharacter(n)];
    // Now apply the recurrence e_i = (1/i)(e_{i-1} p_1 - e_{i-2} p_2 + ... + (-1)^(i-1) e_0 p_i)
    for (var i = 1; i <= r; i++) {
        var altSum = Lin.zero();
        for (var j = 1; j <= i; j++) {
            var term = tensorProduct(n, exteriors[i - j], characterPow(n, character, j));
            altSum = Lin.add(altSum, Lin.scale((j % 2 == 0) ? -1 : 1, term));
        }
        exteriors[i] = Lin.scale(1 / i, altSum);
    }
    return exteriors;
}
// Compute the (r + 1) symmetric powers S^0(V), S^1(V), ..., S^r(V)
function symmetricPowers(n, r, character) {
    var symmetrics = [trivialCharacter(n)];
    // Now apply the recurrence e_i = (1/i)(e_{i-1} p_1 - e_{i-2} p_2 + ... + (-1)^(i-1) e_0 p_i)
    for (var i = 1; i <= r; i++) {
        var sum_1 = Lin.zero();
        for (var j = 1; j <= i; j++) {
            var term = tensorProduct(n, symmetrics[i - j], characterPow(n, character, j));
            sum_1 = Lin.add(sum_1, term);
        }
        symmetrics[i] = Lin.scale(1 / i, sum_1);
    }
    return symmetrics;
}
function tensorPowers(n, r, character) {
    var tensors = [trivialCharacter(n)];
    for (var i = 1; i <= r; i++)
        tensors[i] = tensorProduct(n, tensors[i - 1], character);
    return tensors;
}
// The rest of this file is just interfacing to HTML.
function showDomTable(n, table, letter) {
    var Cl = /** @class */ (function () {
        function Cl(classname) {
            this.classname = classname;
        }
        return Cl;
    }());
    function C(classname) { return new Cl(classname); }
    var E = function (el) {
        var children = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            children[_i - 1] = arguments[_i];
        }
        var $el = document.createElement(el);
        for (var _a = 0, children_1 = children; _a < children_1.length; _a++) {
            var $child = children_1[_a];
            if (typeof $child == 'string') {
                var $text = document.createTextNode($child);
                $el.appendChild($text);
            }
            else if ($child instanceof Cl) {
                $el.classList.add($child.classname);
            }
            else {
                $el.appendChild($child);
            }
        }
        return $el;
    };
    var M = function (text) {
        var $span = E('span');
        $span.innerHTML = katex.renderToString(text);
        return $span;
    };
    var selectedPartitions = [];
    var parts = partitionsOf(n);
    var partsReverse = parts.slice().reverse();
    var $table = E('table', E('thead', E.apply(void 0, ['tr',
        C('underlined'),
        E('td', C('rightderlined'))].concat(partsReverse.map(function (part) { return E('th', M("{" + showPartitionCompact(part) + "}")); })))), E.apply(void 0, ['tbody', 
        // Row showing the sizes of conjugacy classes.
        E.apply(void 0, ['tr',
            C('underlined'),
            E('td', C('rightderlined'), '#')].concat(partsReverse.map(function (part) { return E('td', M("" + conjugacySize(part))); })))].concat(parts.map(function (part) {
        var cells = partsReverse.map(function (colpart) { return E('td', M("" + table.get(part).get(colpart))); });
        var row = E.apply(void 0, ['tr',
            E('td', C('rightderlined'), M(letter + showPartitionCompact(part)))].concat(cells));
        row.classList.add('character');
        row.addEventListener('click', function () {
            var partString = showPartition(part);
            var idx = selectedPartitions.indexOf(partString);
            if (idx >= 0) {
                selectedPartitions.splice(idx, 1);
                this.classList.remove('selected');
            }
            else {
                selectedPartitions.push(partString);
                this.classList.add('selected');
            }
            updateProduct();
        });
        return row;
    }))));
    var $product = E('div');
    function productContents() {
        if (selectedPartitions.length == 0)
            return [E('p', "Select some characters to tensor.")];
        var selectedCharacters = selectedPartitions.map(function (partitionString) { return table.get(readPartition(partitionString)); });
        var chi = selectedCharacters.reduce(function (a, b) { return tensorProduct(n, a, b); });
        var interestingCharacters = [
            ["\\chi", chi]
        ].concat(exteriorPowers(n, 4, chi).slice(2).map(function (lin, r) { return ["\\wedge^{" + (r + 2) + "} \\chi", lin]; }), symmetricPowers(n, 4, chi).slice(2).map(function (lin, r) { return ["S^{" + (r + 2) + "} \\chi", lin]; }), tensorPowers(n, 4, chi).slice(2).map(function (lin, r) { return ["\\otimes^{" + (r + 2) + "} \\chi", lin]; }));
        return [
            E('p', "Selected ", M("\\chi = " + selectedPartitions.map(function (s) { return letter + s; }).join(" \\otimes "))),
            E('h3', "Decomposition of ", M("\\chi"), " and its exterior, symmetric and tensor powers"),
            createDecompositionTable(interestingCharacters)
        ];
    }
    function updateProduct() {
        while ($product.firstChild)
            $product.removeChild($product.firstChild);
        $product.append.apply($product, productContents());
    }
    function createDecompositionTable(characters) {
        var irreducibles = characterTableSpecht(n);
        return E.apply(void 0, ['table', 
            // Header: the names of each character.
            E.apply(void 0, ['tr',
                C('underlined'),
                E('td', C('rightderlined'))].concat(characters.map(function (_a) {
                var name = _a[0], _ = _a[1];
                return E('th', M(name));
            }))), 
            // Second row: dimensions.
            E.apply(void 0, ['tr',
                C('underlined'),
                E('td', C('rightderlined'), M('\\dim'))].concat(characters.map(function (_a) {
                var _ = _a[0], lin = _a[1];
                return E('td', "" + lin.get(irreducibles.partitions[irreducibles.partitions.length - 1]));
            })))].concat(irreducibles.keys().map(function (partition) { return E.apply(void 0, ['tr',
            E('td', C('rightderlined'), M("s" + showPartitionCompact(partition)))].concat(characters.map(function (_a) {
            var _ = _a[0], lin = _a[1];
            return E('td', "" + innerProduct(n, irreducibles.get(partition), lin));
        }))); })));
    }
    updateProduct();
    return E('div', E('h3', "Character table for the " + ((letter == 's') ? 'Specht' : 'permutation') + " modules of ", M("S_{" + n + "}")), $table, $product);
}
function doComputation() {
    var checked = document.querySelector('input[name="module-kind"]:checked');
    var n = document.getElementById("order").valueAsNumber;
    var $tablePlace = document.getElementById("tablePlace");
    while ($tablePlace.firstChild)
        $tablePlace.removeChild($tablePlace.firstChild);
    var characterTable = (checked.value == "specht") ? characterTableSpecht(n) : characterTablePermutation(n);
    var letter = (checked.value == "specht") ? "s" : "h";
    $tablePlace.appendChild(showDomTable(n, characterTable, letter));
}
var $computationForm = document.getElementById('computationForm');
$computationForm.addEventListener('submit', function (ev) { return ev.preventDefault(); });
$computationForm.addEventListener('change', function (ev) { ev.preventDefault(); doComputation(); });
doComputation();
//# sourceMappingURL=characters.js.map