const speedX = 10;
const speedY = 10;

class Particle {

  x: number;
  y: number;

  speedX: number;
  speedY: number;

  private readonly maxW: number;
  private readonly maxH: number;

  private ctx: CanvasRenderingContext2D;

  constructor(startX: number, startY: number, ctx: CanvasRenderingContext2D, maxW: number, maxH: number) {
    this.x = startX;
    this.y = startY;
    this.maxW = maxW;
    this.maxH = maxH;
    this.ctx = ctx;

    this.speedX = Math.random() * speedX * (Math.random() > .5 ? 1 : -1);
    this.speedY = Math.random() * speedY * (Math.random() > .5 ? 1 : -1);
  }

  render(){
    this.ctx.beginPath();
    this.ctx.fillStyle  = "rgba(31,27,36,1)";
    this.ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    this.ctx.fill();

    this.move();
  }

  private move(){
    if (this.speedX <= 5 && this.speedY <= 5){
      if (this.x >= this.maxW || this.x <= 0){
        this.speedX = this.speedX * (-1);
      }
      if (this.y >= this.maxH || this.y <= 0){
        this.speedY = this.speedY * (-1);
      }
    }

    this.x += this.speedX;
    this.y += this.speedY;
  }

}

export class BackgroundEffect{

  private canvas: any;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[];
  private interval: any;

  constructor(canvas: any) {
    this.particles = [];
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    for (let i = 0; i < 160; i++){
      this.particles.push(new Particle(Math.random() * this.canvas.width,
                                       Math.random() * this.canvas.height,
                                             this.ctx,
                                             this.canvas.width,
                                             this.canvas.height));
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
    this.renderAllParticles();
  }

  private renderAllParticles(): void{
    this.particles.forEach(particle => {
      particle.render();
    });
    for (let particle_index = 0; particle_index < this.particles.length; particle_index++){
      if (!this.particles[particle_index + 1]) break;
      if (this.particles[particle_index].speedX > 5 ||
          this.particles[particle_index].speedY > 5 ||
          this.particles[particle_index + 1].speedX > 5 ||
          this.particles[particle_index + 1].speedY > 5) {
        continue;
      }
      this.ctx.beginPath();
      this.ctx.strokeStyle = `rgba(31,27,36,1)`;
      this.ctx.bezierCurveTo(
        this.particles[particle_index].x,
        this.particles[particle_index].y,
        this.canvas.width / 2,
        this.canvas.height /2,
        this.particles[particle_index + 1].x,
        this.particles[particle_index + 1].y);
      this.ctx.stroke();
    }
  }

  clearBackground(): void{
    this.ctx.fillStyle = "#121212";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}