
import { ObservableModel } from './ObservableModel';

export enum PlayerState {
  Unknown = 'unknown',
  Idle = 'idle',
  Attack = 'attack',
  Die = 'die',
}

export class PlayerModel extends ObservableModel {

  private _state: PlayerState = PlayerState.Unknown;


  public constructor() {
    super('PlayerModel');

    this.makeObservable();
  }


  public get state(): PlayerState {
    return this._state;
  }

  public set state(value: PlayerState) {
    this._state = value;
  }


  public setState(state: PlayerState): void {
    if (this._state === PlayerState.Die) return;
    this._state = state;
  }

}
