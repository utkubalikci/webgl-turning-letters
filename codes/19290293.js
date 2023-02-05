var gl;
var theta;
var thetaLoc;
var isDirClockwise = true;
var isMooving = true;
var delay = 50;
var bufferId;
var color;
var colorLoc;
var horizontal;
var horizontalLoc;
var vertical;
var verticalLoc;
var scale;
var program;

function buttonPressedFunc(){
	isDirClockwise=!isDirClockwise;
}

function startStop(){
	isMooving=!isMooving;
}

function scaleVertices(){

	var vertices = [
		//VERTICES OF M
		vec2(-.4 * scale, -.7 * scale), //1
		vec2(-.35 * scale, -.7 * scale), //2
		vec2(-.35 * scale, .7 * scale), //3
		
		vec2(-.35 * scale, .7 * scale), //3
		vec2(-.4 * scale, .7 * scale), //4
		vec2(-.4 * scale, -.7 * scale), //1
		
		vec2(-.35 * scale, .7 * scale), //3
		vec2(-.35 * scale, .6 * scale), //5
		vec2(-.1 * scale, .1 * scale), //7
		
		vec2(-.1 * scale, .1 * scale), //7
		vec2(-.1 * scale, .0), //8
		vec2(+.15 * scale, .6 * scale), //9
		
		vec2(-.35 * scale, .6 * scale), //5
		vec2(-.1 * scale, .1 * scale), //7
		vec2(-.1 * scale, .0), //8
		
		vec2(-.1 * scale, .1 * scale), //7
		vec2(.15 * scale, .6 * scale), //9
		vec2(.15 * scale, .7 * scale), //10
		
		vec2(.15 * scale, .7 * scale), //10
		vec2(.2 * scale, .7 * scale), //11
		vec2(.15 * scale, -.7 * scale), //12
		
		vec2(.2 * scale, .7 * scale), //11
		vec2(.15 * scale, -.7 * scale), //12
		vec2(.2 * scale, -.7 * scale), //13
		
		//VERTICES OF I
		vec2(.35 * scale, -.7 * scale), //1
		vec2(.4 * scale, -.7 * scale), //2
		vec2(.35 * scale, .7 * scale), //3
		vec2(.4 * scale, .7 * scale), //4
	];

	bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

	// Associate out shader variables with our data buffer
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );
}

window.onload = function init() {

	const canvas = document.querySelector("#glcanvas");
	// Initialize the GL context
	gl = WebGLUtils.setupWebGL(canvas);
	// Only continue if WebGL is available and working
	if (!gl) {
	alert("Unable to initialize WebGL. Your browser or machine may not support it.");
	return;
	}
  
	program = initShaders(gl, "vertex-shader", "fragment-shader")
	gl.useProgram( program );
	
	var myButton = document.getElementById("DirectionButton"); 
	myButton.addEventListener("click", buttonPressedFunc);

	var startStopBtn = document.getElementById("StartStopButton"); 
	startStopBtn.addEventListener("click", startStop);
	
	// Rotate Speed
	var speedSlide = document.getElementById("slide");
	speedSlide.addEventListener("input",function(){
		delay = speedSlide.value;
	});

	thetaLoc = gl.getUniformLocation(program, "theta");
	theta = 0;
	
	// MOVE WITH ARROW KEYS
	horizontalLoc = gl.getUniformLocation(program,"horizontal");
	verticalLoc = gl.getUniformLocation(program,"vertical");
	horizontal = 0;
	vertical = 0;

	window.addEventListener("keydown", function (event) {
		if (event.defaultPrevented) {
			return; // Do nothing if the event was already processed
		}
		switch (event.key) {
			case "ArrowDown":
				vertical -= .05
				break;
			case "ArrowUp":
				vertical += .05
				break;
			case "ArrowLeft":
				horizontal -= .05
				break;
			case "ArrowRight":
				horizontal += .05
				break;
			default:
				return; // Quit when this doesn't handle the key event.
		}
		// Cancel the default action to avoid it being handled twice
			event.preventDefault();
		}, true);
		//--------------------------
			
			
	// CHANGE COLOR
	color = vec4(1, 1, 1, 1); //Default White
	colorLoc = gl.getUniformLocation(program, "color");
	var slideR = document.getElementById("slideR");
	slideR.addEventListener("input",function(){
	color[0] = slideR.value;
	});
	
	var slideG = document.getElementById("slideG");
	slideG.addEventListener("input",function(){
		color[1] = slideG.value;
	});
	
	var slideB = document.getElementById("slideB");
	slideB.addEventListener("input",function(){
		color[2] = slideB.value;
	});
				
	var slideO = document.getElementById("slideO");
		slideO.addEventListener("input",function(){
		color[3] = slideO.value;
	});
	//----------------------------------------
			
	// Set clear color to black, fully opaque
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	
	// Change Scale
	scale = 1;
	var scaleSlide = document.getElementById("slide2");
	scaleSlide.addEventListener("input",function(){
		scale = scaleSlide.value;
		scaleVertices();
	});
	//-----------------
	
	scaleVertices();
	requestAnimFrame(render);
	}
					
function render(){
	setTimeout(function() {
		// Clear the color buffer with specified clear color
		gl.clear(gl.COLOR_BUFFER_BIT);
		if (isMooving)
		theta += (isDirClockwise ? -0.1 : 0.1);
		gl.uniform1f(thetaLoc, theta);
		gl.uniform4fv(colorLoc, color);
		gl.uniform1f(horizontalLoc, horizontal);
		gl.uniform1f(verticalLoc, vertical);
		//M
		gl.drawArrays(gl.TRIANGLES, 0, 24);
		//I
		gl.drawArrays(gl.TRIANGLE_STRIP, 24, 4);
		render();
	}, delay);
	
}