//handles the photo class, each of these guys will have a CPPN that represents its genetic material.

class Photograph {
    constructor(x, y, genome = NaN) {
        this.x = x;
        this.y = y;
        this.brain = genome;
        this.brain.score = 0;

        photos.push(this);
    }

    draw() {
        let img = createImage(sideLength, sideLength);
        img.loadPixels();

        for (let i = 0; i < img.width; i++) {
            for (let j = 0; j < img.height; j++) {
                //get outputs from this.brain
                img.set(i, j, color(this.brain.activate(i / sideLength, j / sideLength)));
            }
        }

        img.updatePixels();
        image(img, this.x, this.y);
    }
}