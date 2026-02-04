// @ts-nocheck

import { Container } from "@pixi/display";
import { Cell } from "./cell.js";
import { CellScale } from "./types.js";
import { Rect, align, fit } from "./utils.js";
import { GridDebugger } from "./grid-debugger.js";
export class PixiGrid extends Container {
  constructor() {
    super();
    if (process.env.NODE_ENV === "development") {
      this._debugger = new GridDebugger();
      this.addChild(this._debugger);
    }
    const config = this.getGridConfig();
    this._cells = this._buildCells(config.cells);
    this._area = this._buildArea(config.area);
    this.rebuild(config);
  }
  get cells() {
    return this._cells;
  }
  get area() {
    return this._area;
  }
  getCell(cellId) {
    return this._cells.find((cell) => cell.name === cellId);
  }
  rebuild(config = this.getGridConfig()) {
    const { area, cells, debug } = config;
    /* area */
    this._area.copyFrom(area);
    /* cells */
    cells.forEach((cellConfig) => {
      const cell = this.getCell(cellConfig.name);
      cell.init(cellConfig, area);
      cell.contents.forEach((content) => {
        this._rebuildContent(cell, content);
      });
    });
    /* debug */
    if (process.env.NODE_ENV === "development" && debug != null) {
      this._debugger.clear();
      this._debugger.draw(this, debug);
    }
  }
  attach(cellName, content, addChild = true) {
    addChild && this.addChild(content);
    const cell = this.getCell(cellName);
    if (cell == null) {
      throw new Error(`No cell found with name ${cellName}`);
    }
    content.once("destroyed", () => {
      this.detach(cellName, content);
    });
    cell.addContent(content);
    this._rebuildContent(cell, content);
  }
  detach(cellName, content) {
    const cell = this.getCell(cellName);
    if (!cell.contents.find((c) => c === content)) {
      throw new Error("No cell found with specified content");
    }
    cell.removeContent(content);
    content.off("destroyed");
  }
  _rebuildContent(cell, content) {
    /* reset content */
    this._resetContent(cell, content);
    /* adjust content */
    const bounds = content.getBounds();
    this._scaleContent(cell, content, bounds);
    this._alignContent(cell, content, bounds);
  }
  _resetContent(cell, content) {
    content.position.set(0, 0);
    if (cell.scale !== CellScale.none) {
      content.scale.set(1, 1);
    }
  }
  _scaleContent(cell, content, bounds) {
    switch (cell.scale) {
      case CellScale.none: {
        //
        break;
      }
      case CellScale.custom: {
        if (content.resize != null) {
          throw new Error("resize() function does not implemented");
        }
        content.resize(cell.area.width, cell.area.height);
        break;
      }
      default: {
        const worldScaleX = content.worldTransform.a / content.localTransform.a;
        const worldScaleY = content.worldTransform.d / content.localTransform.d;
        const contentDimensions = {
          width: bounds.width / worldScaleX,
          height: bounds.height / worldScaleY,
        };
        const scale = fit(contentDimensions, cell.area, cell.scale);
        content.scale.set(scale.x, scale.y);
      }
    }
  }
  _alignContent(cell, content, bounds) {
    const worldScaleX = content.worldTransform.a / content.localTransform.a;
    const worldScaleY = content.worldTransform.d / content.localTransform.d;
    const contentDimensions = {
      width: (bounds.width / worldScaleX) * content.scale.x,
      height: (bounds.height / worldScaleY) * content.scale.y,
    };
    const pos = align(contentDimensions, cell.area, cell.align);
    content.position.set(pos.x, pos.y);
    content.x -= (bounds.x / worldScaleX) * content.scale.x;
    content.y -= (bounds.y / worldScaleY) * content.scale.y;
  }
  _buildArea(rawArea) {
    return new Rect().copyFrom(rawArea);
  }
  _buildCells(rawCells) {
    const cells = new Array(rawCells.length);
    rawCells.forEach((cell, i) => (cells[i] = new Cell(cell.name)));
    return cells;
  }
}
