function edges(boid, edgesRect) {
    if (boid.position.x < edgesRect.left) boid.velocity.x += edgeFactor;
    if (boid.position.x > edgesRect.right) boid.velocity.x -= edgeFactor;
    if (boid.position.y < edgesRect.top) boid.velocity.y += edgeFactor;
    if (boid.position.y > edgesRect.bottom) boid.velocity.y -= edgeFactor;
}

function isInViewRange(boid, other) {
    const distance = boid.position.dist(other.position)
    return distance <= perceptionDistance;
}

function limitSpeed(boid) {
    const boidSpeed = boid.velocity.mag();
    if (boidSpeed > maxSpeed) {
        boid.velocity.normalize()
            .mult(maxSpeed);
    }
}

function alignment(boids, boid) {
    const avgVelocity = createVector(0, 0);
    let neighboursCount = 0;

    boids.forEach(other => {
        if (isInViewRange(boid, other)) {
            avgVelocity.add(other.velocity);
            neighboursCount++;
        }
    });

    if (neighboursCount > 0) {
        avgVelocity.div(neighboursCount)
            .sub(boid.velocity)
            .mult(alignmentFactor);
        boid.velocity.add(avgVelocity);
        limitSpeed(boid);
    }
}

function cohesion(boids, boid) {
    const center = createVector(0, 0);
    let neighboursCount = 0;

    boids.forEach(other => {
        if (isInViewRange(boid, other)) {
            center.add(other.position);
            neighboursCount++;
        }
    });

    if (neighboursCount > 0) {
        center.div(neighboursCount)
            .sub(boid.position)
            .mult(centeringFactor);
        boid.velocity.add(center);
        limitSpeed(boid);
    }
}

function separation(boids, boid) {
    const target = createVector(0, 0);
    boids.forEach(other => {
        const distance = boid.position.dist(other.position);
        if (boid !== other && distance < separationDistance) {
            target.add(
                p5.Vector.sub(boid.position, other.position)
            );
        }
    });

    target.mult(separationFactor);
    boid.velocity.add(target);
    limitSpeed(boid);
}

class Flock {
    constructor(count, color) {
        this.color = color;
        this.boids = [];
        for (let i = 0; i < count; i++) {
            this.boids.push(new Boid(
                createVector(random(screenSize.width), random(screenSize.height)),
                p5.Vector.random2D().setMag(minSpeed, maxSpeed),
            ));
        }
    }

    update(combinedBoids, edgesRect) {
        this.boids.forEach(boid => {
            alignment(this.boids, boid);
            cohesion(this.boids, boid);
            separation(combinedBoids, boid);
            edges(boid, edgesRect);

            boid.update();
        });
    }

    draw(showPerception, showSeparation) {
        this.boids.forEach(boid => {
            boid.draw(this.color);

            if (showPerception) {
                boid.drawRadius(perceptionDistance, '#eb6a6b');
            }
            if (showSeparation) {
                boid.drawRadius(separationDistance, '#00ffff');
            }
        });
    }
}
