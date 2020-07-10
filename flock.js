class Flock {
    constructor(settings, color) {
        this.color = color;
        this.settings = settings;
        
        this.generateBoids();
    }

    addBoids(count) {
        const { minSpeed, maxSpeed } = this.settings;
        for (let i = 0; i < count; i++) {
            this.boids.push(new Boid(
                createVector(random(screenSize.width), random(screenSize.height)),
                p5.Vector.random2D().setMag(minSpeed, maxSpeed),
            ));
        }
    }

    generateBoids() {
        const { count } = this.settings;
        this.boids = [];
        this.addBoids(count);
    }

    updateSettings(settings) {
        this.settings = settings;

        const currentCount = this.boids.length;
        if (currentCount > settings.count) {
            this.boids = this.boids.slice(0, settings.count);
        } else if (currentCount < settings.count) {
            this.addBoids(settings.count - currentCount);
        }
    }

    update(combinedBoids, edgesRect) {
        this.boids.forEach(boid => {
            this.alignment(this.boids, boid);
            this.cohesion(this.boids, boid);
            this.separation(combinedBoids, boid);
            this.edges(boid, edgesRect);

            boid.update();
        });
    }

    draw() {
        const { showPerception, showSeparation, perceptionDistance, separationDistance } = this.settings;
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

    isInViewRange(boid, other) {
        const { perceptionDistance } = this.settings;
        const distance = boid.position.dist(other.position)
        return distance <= perceptionDistance;
    }

    limitSpeed(boid) {
        const { maxSpeed } = settings;
        const boidSpeed = boid.velocity.mag();
        if (boidSpeed > maxSpeed) {
            boid.velocity.normalize()
                .mult(maxSpeed);
        }
    }

    /// alignment, cohesion, separation in one cycle
    applyForces(boids, boid) {
        const { alignmentFactor, centeringFactor, separationDistance, separationFactor } = this.settings;
        const avgVelocity = createVector(0, 0);
        const center = createVector(0, 0);
        const target = createVector(0, 0);
        let neighboursCount = 0;

        boids.forEach(other => {
            if (this.isInViewRange(boid, other)) {
                avgVelocity.add(other.velocity);
                center.add(other.position);
                neighboursCount++;
            }

            const distance = boid.position.dist(other.position);
            if (boid !== other && distance < separationDistance) {
                target.add(
                    p5.Vector.sub(boid.position, other.position)
                );
            }
        });

        if (neighboursCount > 0) {
            avgVelocity.div(neighboursCount)
                .sub(boid.velocity)
                .mult(alignmentFactor);
            boid.velocity.add(avgVelocity);

            center.div(neighboursCount)
                .sub(boid.position)
                .mult(centeringFactor);
            boid.velocity.add(center);

            target.mult(separationFactor);
            boid.velocity.add(target);

            this.limitSpeed(boid);
        }
    }

    alignment(boids, boid) {
        const { alignmentFactor } = this.settings;
        const avgVelocity = createVector(0, 0);
        let neighboursCount = 0;

        boids.forEach(other => {
            if (this.isInViewRange(boid, other)) {
                avgVelocity.add(other.velocity);
                neighboursCount++;
            }
        });

        if (neighboursCount > 0) {
            avgVelocity.div(neighboursCount)
                .sub(boid.velocity)
                .mult(alignmentFactor);
            boid.velocity.add(avgVelocity);
            this.limitSpeed(boid);
        }
    }

    cohesion(boids, boid) {
        const { centeringFactor } = this.settings;
        const center = createVector(0, 0);
        let neighboursCount = 0;

        boids.forEach(other => {
            if (this.isInViewRange(boid, other)) {
                center.add(other.position);
                neighboursCount++;
            }
        });

        if (neighboursCount > 0) {
            center.div(neighboursCount)
                .sub(boid.position)
                .mult(centeringFactor);
            boid.velocity.add(center);
            this.limitSpeed(boid);
        }
    }

    separation(boids, boid) {
        const { separationDistance, separationFactor } = settings;
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
        this.limitSpeed(boid);
    }

    edges(boid, edgesRect) {
        const { edgeFactor } = this.settings;
        if (boid.position.x < edgesRect.left) boid.velocity.x += edgeFactor;
        if (boid.position.x > edgesRect.right) boid.velocity.x -= edgeFactor;
        if (boid.position.y < edgesRect.top) boid.velocity.y += edgeFactor;
        if (boid.position.y > edgesRect.bottom) boid.velocity.y -= edgeFactor;
    }
}
