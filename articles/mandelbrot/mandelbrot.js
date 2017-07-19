/* Some references I found useful:
   - http://webglfundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html
*/

// range(5) => [0, 1, 2, 3, 4]
function range(n) {
	return Array.apply(null, Array(n)).map(function(_, i) { return i; });
}

// func should take (i, j) to matrix entries.
function mat4(func) {
	return range(4).map(function(i) {
		return range(4).map(function(j) { 
			return func(i, j);
		});
	});
}

// Diagonal matrix.
function diag4(x, y, z, w) {
	return mat4(function(i, j) {
		return (i == j) ? [x, y, z, w][i] : 0;
	});
}

// Identity matrix.
function id4() {
	return diag4(1, 1, 1, 1);
}

// Matrix multiplication of two 4x4 matrices.
function mat4mult(A, B) {
	return mat4(function(i, j) {
		return range(4).reduce(function(acc, k) {
			return acc + A[i][k] * B[k][j];
		}, 0);
	});
}

// Matrix multiplication of a list of 4x4 matrices.
function mat4mults(mats) {
	return mats.reduce(mat4mult, id4());
}

// Apply matrix to vector.
function mat4multvec(mat, vec) {
	return mat.map(function(row) {
		return row.reduce(function(sum, _, i) { return sum + row[i] * vec[i]; }, 0);
	});
}

// Scaling matrix
function mat4scale(x, y, z) {
	return diag4(x, y, z, 1);
}

// Translation matrix
function mat4trans(x, y, z) {
	return [
		[1,0,0,x],
		[0,1,0,y],
		[0,0,1,z],
		[0,0,0,1]];
}

// Flatten matrix (in column-major order).
function mat4flat(mat) {
	return range(16).map(function(i) { return mat[i%4][i/4 | 0]; });
}

position = {
	width: 1000,
	height: 600,
	centre: {re: 0, im: 0},
	scale: 300, /* pixels/unit */
};

/* Create a mandelbrot set with the given parameters inside the canvas.
   Also accepts a text element for writing into. */
function createDrawing(canvas, text, position) {
	// Create the canvas (taking care of hidpi), and append it to the given container.
	// Taking care of hidpi: canvas.style.width is in CSS (display) pixels, while plain canvas.width
	// is backing pixels.
	var pixelRatio = window.devicePixelRatio || 1;
	canvas.style.width = position.width + 'px';
	canvas.style.height = position.height + 'px';
	canvas.width = position.width * pixelRatio;
	canvas.height = position.height * pixelRatio;

	// Create the OpenGL drawing context.
	var gl = canvas.getContext('webgl');
	if (!gl)
		console.log('Could not init WebGL');

	// Set the colour to black, then clear the colour and depth buffers.
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Fetch and compile the shaders embedded in the HTML.
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");
	// Wire these shaders together into the shader program.
	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
	gl.useProgram(shaderProgram);

	// Extract the vertexPosition reference from the program, and enable ... something?
	var vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(vertexPositionAttribute);

	// Create a buffer holding a [-1, 1] square in the xy-plane, and bind it to the buffer.
	var squareVerticesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
	var vertices = [
		1.0, 1.0, 0.0,
		-1.0, 1.0, 0.0,
		1.0, -1.0, 0.0,
		-1.0, -1.0, 0.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	gl.vertexAttribPointer(
		vertexPositionAttribute /* index of vertex attribute */,
		3 /* size (per vertex) */,
		gl.FLOAT,
		false /* fixed-pt normalisation? */,
		0 /* stride, between consecutive bytes */,
		0 /* offset of first component */);

	return {
		canvas: canvas,
		gl: gl,
		text: text,
		shaderProgram: shaderProgram,
		position: position,
	};
}

var canvas = document.getElementById('glcanvas');
var text = document.getElementById('gltext');
var drawing = createDrawing(canvas, text, position);
draw2(drawing);
canvas.addEventListener('mousedown', onMouseDownEvent);
canvas.addEventListener('wheel', onWheelEvent);

// Return the matrix taking clipspace coordinates to the complex plane.
function clip2plane(position) {
	var centre = position.centre;
	var matrix = mat4mults([
		mat4trans(centre.re, centre.im, 0),
		mat4scale(position.width / position.scale, position.height / position.scale, 1)
	]);
	return matrix;
}

// Return the matrix taking viewport coordinates to clipspace.
function viewport2clip(drawing) {
	var matrix = mat4mults([
		mat4trans(-1, -1, 0),
		mat4scale(2/drawing.canvas.width, 2/drawing.canvas.height, 1)
	]);
	return matrix;
}

function draw2(drawing) {
	var umatrix = clip2plane(drawing.position);

	var uMatrix = drawing.gl.getUniformLocation(drawing.shaderProgram, "u_matrix");
	if (uMatrix === null) {
		console.log("Could not get location of u_matrix");
	}

	drawing.gl.uniformMatrix4fv(uMatrix, false /* transpose */, new Float32Array(mat4flat(umatrix)));

	drawing.gl.clear(drawing.gl.COLOR_BUFFER_BIT | drawing.gl.DEPTH_BUFFER_BIT);
	drawing.gl.drawArrays(drawing.gl.TRIANGLE_STRIP, 0, 4);
	if (drawing.gl.getError() != drawing.gl.NO_ERROR) {
		console.log("There was an error: " + drawing.gl.getError());
	}

	drawing.text.innerHTML = "Centre:" + drawing.position.centre.re + " + " + drawing.position.centre.im + "<i>i</i><br>Zoom level: " + drawing.position.scale;
}

function mousePlaneCoords(event) {
	// Get mouse coordinates.
	var rect = drawing.canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    // Apply hidpi correction.
    var pixelRatio = window.devicePixelRatio || 1;
    x *= pixelRatio;
    y *= pixelRatio;

    // Place origin in bottom left.
    y = drawing.canvas.height - y;

    // Transform through clip space onto the plane.
    var trans = mat4mults([clip2plane(drawing.position), viewport2clip(drawing)]);
    var coords = mat4multvec(trans, [x, y, 0, 1]);

    return {re: coords[0] / coords[3], im: coords[1] / coords[3]};
}

function onMouseDownEvent(event) {
	var originalPos = {
		re: drawing.position.centre.re,
		im: drawing.position.centre.im,
	};
	var startPos = mousePlaneCoords(event);

	var onMouseMoveEvent = function(event) {
		drawing.position.centre = originalPos; // Dodgy - have to reset this before calling mousePlaneCoords.
		var newPos = mousePlaneCoords(event);
		var delta = {
			re: newPos.re - startPos.re,
			im: newPos.im - startPos.im,
		};

		drawing.position.centre.re = originalPos.re - delta.re;
		drawing.position.centre.im = originalPos.im - delta.im;
		window.requestAnimationFrame(function() {draw2(drawing);});
	};

	var onMouseUpEvent = function(event) {
		onMouseMoveEvent(event);
		drawing.canvas.removeEventListener('mousemove', onMouseMoveEvent);
		drawing.canvas.removeEventListener('mouseup', onMouseUpEvent);
	};

	drawing.canvas.addEventListener('mousemove', onMouseMoveEvent);
	drawing.canvas.addEventListener('mouseup', onMouseUpEvent);
}

function onWheelEvent(event) {
	var mouse = mousePlaneCoords(event);
	var delta = -event.deltaY;
	var multipliers = [1, 10, 80];
	var scaledDelta = delta * multipliers[event.deltaMode];

	var scaleMult = Math.pow(1.001, scaledDelta);
	if (drawing.position.scale < 80 && scaleMult < 1.0) {
		// Can't zoom past here.
		return;
	}

	var trans = mat4mults([
		mat4trans(mouse.re, mouse.im, 0),
		mat4scale(1/scaleMult, 1/scaleMult, 1),
		mat4trans(-mouse.re, -mouse.im, 0)
	]);

	var newCentre = mat4multvec(trans, [drawing.position.centre.re, drawing.position.centre.im, 0, 1]);
	drawing.position.centre.re = newCentre[0] / newCentre[3];
	drawing.position.centre.im = newCentre[1] / newCentre[3];
	drawing.position.scale *= scaleMult;

	window.requestAnimationFrame(function() {draw2(drawing);});

	// Don't bubble: catch the event.
	event.preventDefault();
}

// Create a shader from the script element id, infer its type, compile it, and return a handle to it.
function getShader(gl, id) {
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
		return null;
	}

	var source = shaderScript.text;
	var type = null;
	if (shaderScript.type == "x-shader/x-fragment") {
		type = gl.FRAGMENT_SHADER;
	} else if (shaderScript.type == "x-shader/x-vertex") {
		type = gl.VERTEX_SHADER;
	}
	if (type === null) {
		return null;
	}

	var shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	// See if it compiled successfully
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
		alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));  
		gl.deleteShader(shader);
		return null;  
	}

	return shader;
}
