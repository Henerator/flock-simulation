let screenSize;
let edgesRect;

const flocks = [];
const boidsCount = 30;
const edgeFactor = 0.8;
const edgeMargin = 150;
let perceptionDistance = 120;
let separationDistance = 40;
let alignmentFactor = 0.05;
let centeringFactor = 0.01;
let separationFactor = 0.1;
let minSpeed = 3;
let maxSpeed = 15;

let alignmentFactorSlider;
let centeringFactorSlider;
let separationFactorSlider;

let perceptionCheckbox;
let separationCheckbox;

function updateScreenSize() {
    const bodyRect = document.body.getBoundingClientRect();
    screenSize = {
        width: bodyRect.width,
        height: 500,
    };
    edgesRect = {
        left: edgeMargin,
        top: edgeMargin,
        right: screenSize.width - edgeMargin,
        bottom: screenSize.height - edgeMargin,
    };
    resizeCanvas(screenSize.width, screenSize.height)
}

function generateFlock(count, color) {
    flocks.push(new Flock(count, color));
}

function generateTestBoids() {
    boids.push(new Boid(
        createVector(screenSize.width/2 - 40, screenSize.height/2),
        createVector(10, 0),
    ));
    boids.push(new Boid(
        createVector(screenSize.width/2 + 40, screenSize.height/2),
        createVector(-10, 0),
    ));
    noLoop();
}

function setup() {
    createCanvas();
    updateScreenSize();

    window.addEventListener('resize', updateScreenSize);

    alignmentFactorSlider = createSlider(0, 0.01, 0.001, 0.001);
    centeringFactorSlider = createSlider(0, 0.05, 0.01, 0.01);
    separationFactorSlider = createSlider(0, 0.1, 0.01, 0.01);
    maxSpeedSlider = createSlider(0, 30, 11, 1);
    perceptionDistanceSlider = createSlider(0, 300, 140, 10);
    separationDistanceSlider = createSlider(0, 200, 80, 10);

    perceptionCheckbox = createCheckbox('perception', false);;
    separationCheckbox = createCheckbox('separation', false);;

    generateFlock(boidsCount, '#fff');
    generateFlock(boidsCount, '#ffa21e');

    draw();
}

function clearCanvas() {
    noStroke();
    fill('#333');
    rect(0, 0, screenSize.width, screenSize.height);
}

function draw() {
    alignmentFactor = alignmentFactorSlider.value();
    centeringFactor = centeringFactorSlider.value();
    separationFactor = separationFactorSlider.value();
    maxSpeed = maxSpeedSlider.value();
    perceptionDistance = perceptionDistanceSlider.value();
    separationDistance = separationDistanceSlider.value();
    
    clearCanvas();

    flocks.forEach(flock => {
        const showPerception= perceptionCheckbox.checked();
        const showSeparation= separationCheckbox.checked();
        flock.draw(showPerception, showSeparation);
    });

    update();
}

function update() {
    const combinedBoids = flocks.reduce((all, flock) => [...all, ...flock.boids], []);
    flocks.forEach(flock => flock.update(combinedBoids, edgesRect));
}
