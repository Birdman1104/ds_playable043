// @ts-nocheck

import { CellAlign, CellScale } from "./types.js";
export class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    copyFrom({ x, y }) {
        this.set(x, y);
        return this;
    }
}
export class Rect {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    set(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        return this;
    }
    copyFrom({ x, y, width, height }) {
        this.set(x, y, width, height);
        return this;
    }
}
export function align(dimension, rect, alignType) {
    const { width: w1, height: h1 } = dimension;
    const { x: x2, y: y2, width: w2, height: h2 } = rect;
    const pos = new Point(x2, y2);
    switch (alignType) {
        case CellAlign.center:
            return pos.set(x2 + (w2 - w1) / 2, y2 + (h2 - h1) / 2);
        case CellAlign.centerTop:
            return pos.set(x2 + (w2 - w1) / 2, y2);
        case CellAlign.centerBottom:
            return pos.set(x2 + (w2 - w1) / 2, y2 + (h2 - h1));
        case CellAlign.leftCenter:
            return pos.set(x2, y2 + (h2 - h1) / 2);
        case CellAlign.leftTop:
            return pos;
        case CellAlign.leftBottom:
            return pos.set(x2, y2 + (h2 - h1));
        case CellAlign.rightCenter:
            return pos.set(x2 + (w2 - w1), y2 + (h2 - h1) / 2);
        case CellAlign.rightTop:
            return pos.set(x2 + (w2 - w1), y2);
        case CellAlign.rightBottom:
            return pos.set(x2 + (w2 - w1), y2 + (h2 - h1));
        case CellAlign.none:
            return pos;
        default:
            throw new Error(`Unknown align: ${alignType}`);
    }
}
export function fit(d1, d2, scaleType) {
    switch (scaleType) {
        case CellScale.fit:
            return internalFit(d1, d2);
        case CellScale.fill:
            return internalFill(d1, d2);
        case CellScale.showAll:
            return internalShowAll(d1, d2);
        case CellScale.envelop:
            return internalEnvelop(d1, d2);
        case CellScale.none:
            return new Point(1, 1);
        default:
            throw new Error(`Unknown scale type: ${scaleType}`);
    }
}
function internalFit(d1, d2) {
    const { width: w1, height: h1 } = d1;
    const { width: w2, height: h2 } = d2;
    const s = Math.min(w2 / w1, h2 / h1);
    return s < 1 ? new Point(s, s) : new Point(1, 1);
}
function internalShowAll(d1, d2) {
    const { width: w1, height: h1 } = d1;
    const { width: w2, height: h2 } = d2;
    const s = Math.min(w2 / w1, h2 / h1);
    return new Point(s, s);
}
function internalEnvelop(d1, d2) {
    const { width: w1, height: h1 } = d1;
    const { width: w2, height: h2 } = d2;
    const s = Math.max(w2 / w1, h2 / h1);
    return new Point(s, s);
}
function internalFill(d1, d2) {
    const { width: w1, height: h1 } = d1;
    const { width: w2, height: h2 } = d2;
    return new Point(w2 / w1, h2 / h1);
}