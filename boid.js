class Boid {
    constructor(position, velocity) {
        this.position = position;
        this.velocity = velocity;
    }

    drawRadius(radius, color) {
        noFill();
        stroke(color);
        strokeWeight(1);
        circle(this.position.x, this.position.y, radius);
    }

    draw(color) {
        noStroke();
        fill(color);

        const height = 20;
        const width = 10;
        const angle = this.velocity.heading();
        push();
        translate(this.position);
        rotate(angle);
        translate(height / 2, 0);
        triangle(0, 0, -height, -width / 2, -height, width / 2)
        pop();
    }

    update() {
        this.position.add(this.velocity);
    }
}
