let screenSize;
let edgesRect;

const flocks = [];

const settings = {
    count: 30,
    minSpeed: 3,
    maxSpeed: 11,
    edgeFactor: 0.8,
    edgeMargin: 150,
    perceptionDistance: 200,
    separationDistance: 80,
    alignmentFactor: 0.01,
    centeringFactor: 0.01,
    separationFactor: 0.01,
    showPerception: false,
    showSeparation: false,
};

const gui = new dat.GUI();

function updateScreenSize() {
    const bodyRect = document.body.getBoundingClientRect();
    screenSize = {
        width: bodyRect.width,
        height: bodyRect.height,
    };
    resizeCanvas(screenSize.width, screenSize.height)
}

function generateGUISettings() {
    gui.add(settings, 'count', 10, 100).step(10);
    gui.add(settings, 'maxSpeed', 0, 30).step(1);
    gui.add(settings, 'perceptionDistance', 0, 300).step(10);
    gui.add(settings, 'separationDistance', 0, 200).step(10);
    gui.add(settings, 'alignmentFactor', 0, 0.1).step(0.01);
    gui.add(settings, 'centeringFactor', 0, 0.05).step(0.01);
    gui.add(settings, 'separationFactor', 0, 0.1).step(0.01);

    gui.add(settings, 'showPerception');
    gui.add(settings, 'showSeparation');
}

function generateFlock(settings, color) {
    flocks.push(new Flock(settings, color));
}

function setup() {
    createCanvas();
    updateScreenSize();

    window.addEventListener('resize', updateScreenSize);

    generateGUISettings();

    generateFlock(settings, '#fff');
    generateFlock(settings, '#ffa21e');

    draw();
}

function clearCanvas() {
    noStroke();
    fill('#333');
    rect(0, 0, screenSize.width, screenSize.height);
}

function draw() {
    clearCanvas();

    flocks.forEach(flock => flock.draw());

    update();
}

function update() {
    edgesRect = {
        left: settings.edgeMargin,
        top: settings.edgeMargin,
        right: screenSize.width - settings.edgeMargin,
        bottom: screenSize.height - settings.edgeMargin,
    };

    const combinedBoids = flocks.reduce((all, flock) => [...all, ...flock.boids], []);
    flocks.forEach(flock => {
        flock.updateSettings(settings);
        flock.update(combinedBoids, edgesRect)
    });
}
