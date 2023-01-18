export class Particle {
  public context: CanvasRenderingContext2D;
  private size: number;
  private _color: string;
  private _lStar: number;
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
    this._color = color;
    this._lStar = lStar;
    this._x = x;
    this._y = y;
  }
  draw() {
    this.context.fillStyle = this._color;
    this.context.fillRect(this._x, this._y, this.size, this.size);
  }
  remove() {
    this.context.clearRect(this._x, this._y, this.size, this.size);
  }
  get color() {
    return this._color;
  }
  set color(value: string) {
    this._color = value;
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
  set lStar(value: number) {
    this._lStar = value;
  }
  get lStar() {
    return this._lStar;
  }
}
