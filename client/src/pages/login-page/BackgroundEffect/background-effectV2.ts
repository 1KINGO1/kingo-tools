const speedX = 10;
const speedY = 10;

class Curve {
  private x: number;
  private y: number;
  private speedX: number;
  private speedY: number;
  private opacity: number = Math.random() + 0.5;

  constructor(private ctx: CanvasRenderingContext2D,
              private maxW: number,
              private maxH: number) {
    this.speedX = Math.random() * speedX * (Math.random() > .5 ? 1 : -1);
    this.speedY = Math.random() * speedY * (Math.random() > .5 ? 1 : -1);

    this.x = maxW/2;
    this.y = Math.random() * (maxH+ 500);
  }

  render(){
    this.ctx.beginPath();
    this.ctx.strokeStyle = `rgba(31,27,36,${this.opacity})`;
    this.ctx.bezierCurveTo(-+ this.maxW / 20, -this.maxH / 20, this.x, this.y ,this.maxW + this.maxW / 20, this.maxH + this.maxH / 20);
    this.ctx.stroke();

    this.move();
  }

  private move(){
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x >= this.maxW*2 || this.x <= -this.maxW){
      this.speedX *= -1;
    }
    if (this.y >= this.maxH*2 || this.y <= -this.maxH){
      this.speedY *= -1;
    }
  }
}

export class BackgroundEffect{

  private canvas: any;
  private ctx: CanvasRenderingContext2D;
  private curves: Curve[];
  private interval: any;

  constructor(canvas: any) {
    this.curves = [];
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    for (let i = 0; i < 260; i++){
      this.curves.push(new Curve(this.ctx, this.canvas.width, this.canvas.height));
    }
  }

  init(){
    this.interval = setInterval(this.loop.bind(this), 1000 / 60);
  }

  destroy(){
    clearInterval(this.interval);
    this.interval = null;
  }

  loop(): void{
    this.clearBackground();
    this.renderAllCurves();
  }

  private renderAllCurves(): void{
    this.curves.forEach(curve => {
      curve.render();
    })
  }

  clearBackground(): void{
    this.ctx.fillStyle = "#121212";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}