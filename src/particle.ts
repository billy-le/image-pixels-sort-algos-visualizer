export class Particle {
  public context: CanvasRenderingContext2D;
  public size: number;
  public color: string;
  public lStar: number;
  private _x: number;
  private _y: number;

  constructor({
    context,
    color,
    size,
    lStar,
    x,
    y,
  }: {
    context: CanvasRenderingContext2D;
    color: string;
    size: number;
    lStar: number;
    x: number;
    y: number;
  }) {
    this.context = context;
    this.size = size;
    this.color = color;
    this.lStar = lStar;
    this._x = x;
    this._y = y;
  }
  draw() {
    this.context.fillStyle = this.color;
    this.context.fillRect(this._x, this._y, this.size, this.size);
  }
  cursor() {
    const halfSize = this.size / 2;
    this.context.fillStyle = "red";
    this.context.fillRect(this._x + halfSize / 2, this._y + halfSize / 2, halfSize, halfSize);
  }
  remove() {
    this.context.clearRect(this._x, this._y, this.size, this.size);
  }
  set x(point: number) {
    this._x = point;
  }
  get x() {
    return this._x;
  }
  set y(point: number) {
    this._y = point;
  }
  get y() {
    return this._y;
  }
}
