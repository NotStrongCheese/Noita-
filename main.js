// THIS IS A PIXEL SIMULATION

/** @type {HTMLCanvasElement} */
let Canvas;
/** @type {CanvasRenderingContext2D} */
let Ctx;

document.addEventListener("DOMContentLoaded", () => {
    Canvas = document.getElementById("Canvas");
    Ctx = Canvas.getContext("2d");
    
    // Set canvas size
    Canvas.width = innerWidth;
    Canvas.height = innerHeight;

    Init();

    Frame();
});

let Mouse = {
    X: 0,
    Y: 0,
    LDown: false,
    RDown: false
};
document.addEventListener("mousemove", (Event) => {
    Mouse.X = Event.clientX;
    Mouse.Y = Event.clientY;
});

document.addEventListener("mousedown", (Event) => {
    if (Event.button === 0) {
        Mouse.LDown = true;
    } else if (Event.button === 2) {
        Mouse.RDown = true;
    }
});

document.addEventListener("mouseup", (Event) => {
    if (Event.button === 0) {
        Mouse.LDown = false;
    } else if (Event.button === 2) {
        Mouse.RDown = false;
    }
});

document.addEventListener("contextmenu", (Event) => {
    Event.preventDefault();
});

window.addEventListener("resize", () => {
    Canvas.width = innerWidth;
    Canvas.height = innerHeight;
});

class LiquidPixel {
    constructor(X, Y, Size) {
        this.X = X;
        this.Y = Y;
        this.Size = Size;
        this.Color = "rgba(0, 150, 255, 0.5)"; // Default color
    }

    Draw() {
        Ctx.fillStyle = this.Color;
        Ctx.fillRect(this.X, this.Y, this.Size, this.Size);
    }

    Update() {
        this.Y += this.Size;
        this.Y = Math.min(this.Y, Canvas.height - this.Size); // Prevent going off the bottom
        this.X = Math.max(0, Math.min(this.X, Canvas.width - this.Size)); // Prevent going off the sides

        this.X = Math.round(this.X / this.Size) * this.Size;
        this.Y = Math.round(this.Y / this.Size) * this.Size;

        for (let Pixel of LiquidPixels) {
            if (Pixel.X == this.X && Pixel.Y == this.Y && Pixel !== this) {
                this.Y -= this.Size;
                this.X += (Math.random() < 0.5 ? -1 : 1) * this.Size;
            }
        }
        if (this.Y == Math.round(Canvas.height / this.Size) * this.Size - this.Size) {
            this.X += (Math.random() < 0.5 ? -1 : 1) * this.Size;
        }
        for (let Pixel of LiquidPixels) {
            if (Pixel !== this && Math.abs(Pixel.X - this.X) < this.Size && Math.abs(Pixel.Y - this.Y) < this.Size) {
                if (Pixel.Y > this.Y) {
                    this.Y = Pixel.Y - this.Size;
                }
            }
        }
    }
}

let LiquidPixels = [];

function Init() {
    for (let i = 0; i < 1000; i++) {
        LiquidPixels.push(new LiquidPixel(Math.random() * Canvas.width, Math.random() * Canvas.height, 5));
    }
}

function Frame() {
    Ctx.clearRect(0, 0, Canvas.width, Canvas.height);
    
    Ctx.fillStyle = "black";
    Ctx.fillRect(0, 0, Canvas.width, Canvas.height);

    for (let Pixel of LiquidPixels) {
        Pixel.Update();
        Pixel.Draw();
    }

    requestAnimationFrame(Frame);
}