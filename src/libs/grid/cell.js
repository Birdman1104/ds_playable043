// @ts-nocheck

import { CellAlign, CellScale } from "./types.js";
import { Point, Rect } from "./utils.js";
export class Cell {
  constructor(name) {
    this.name = name;
    this.contents = [];
  }
  get area() {
    return this._area;
  }
  get bounds() {
    return this._bounds;
  }
  get scale() {
    return this._scale;
  }
  get align() {
    return this._align;
  }
  init(config, area) {
    const { bounds, padding, offset, scale, align } = config;
    this._bounds = this._getBounds(bounds, offset, area);
    this._area = this._getArea(padding);
    this._scale = this._getScale(scale);
    this._align = this._getAlign(align);
    return this;
  }
  addContent(content) {
    this.contents.push(content);
  }
  removeContent(content) {
    this.contents.splice(this.contents.indexOf(content), 1);
  }
  _getBounds(bounds, offset = new Point(0, 0), area) {
    const { x: ax, y: ay, width: aw, height: ah } = area;
    const { x: bx, y: by, width: bw, height: bh } = bounds;
    const { x: ox, y: oy } = offset;
    const x = ax + bx * aw + ox;
    const y = ay + by * ah + oy;
    const w = bw * aw;
    const h = bh * ah;
    return new Rect(x, y, w, h);
  }
  _getArea(padding = new Rect(0, 0, 1, 1)) {
    const { x: bx, y: by, width: bw, height: bh } = this._bounds;
    const { x: px, y: py, width: pw, height: ph } = padding;
    const x = bx + px * bw;
    const y = by + py * bh;
    const w = bw - (1 - pw) * bw;
    const h = bh - (1 - ph) * bh;
    return new Rect(x, y, w, h);
  }
  _getScale(scale = CellScale.fit) {
    return scale;
  }
  _getAlign(align = CellAlign.center) {
    return align;
  }
}
