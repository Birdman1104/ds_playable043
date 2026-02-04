import { delayRunnable, removeRunnable } from 'utils/Utils';
import { ObservableModel } from './ObservableModel';

const HINT_ON_IDLE = 3;

export class HintModel extends ObservableModel {
  private _visible: boolean;
  private visibilityTimer: any;

  public constructor() {
    super('HintModel');

    this._visible = false;
    this.makeObservable();
  }

  get visible(): boolean {
    return this._visible;
  }

  set visible(value: boolean) {
    this._visible = value;
    this.stopVisibilityTimer();
  }

  public destroy(): void {
    this.stopVisibilityTimer();
  }

  public setVisibility(value: boolean): void {
    this.visible = value;
  }

  public startVisibilityTimer(): void {
    this.visibilityTimer = delayRunnable(HINT_ON_IDLE, () => (this._visible = true), this);
  }

  public stopVisibilityTimer(): void {
    removeRunnable(this.visibilityTimer);
    this.visibilityTimer = null;
  }
}
