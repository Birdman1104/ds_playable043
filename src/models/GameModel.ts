
import { HintModel } from './HintModel';
import { ObservableModel } from './ObservableModel';
import { PlayerModel } from './PlayerModel';

export enum GameState {
  Unknown = 'Unknown',
  Intro = 'Intro',
  Game = 'Game',
  Win = 'Win',
  Lose = 'Lose',
  ResetPlayer = 'ResetPlayer',
}

export class GameModel extends ObservableModel {
  private _state: GameState;
  private _player: PlayerModel = {} as PlayerModel;
  private _hintModel: HintModel | null = null;

  constructor() {
    super('GameModel');

    this._state = GameState.Unknown;
    this.makeObservable();
  }

  get state(): GameState {
    return this._state;
  }

  set state(value: GameState) {
    this._state = value;
  }

  get player(): PlayerModel {
    return this._player;
  }

  set player(value: PlayerModel) {
    this._player = value;
  }

  get hintModel(): HintModel | null {
    return this._hintModel;
  }

  set hintModel(value: HintModel) {
    this._hintModel = value;
  }

  public setState(state: GameState): void {
    this._state = state;
  }

  public initialize(): void {
    this._state = GameState.Intro;
  }

  public initPlayer(): void {
    this._player = new PlayerModel();
  }

  // HINT
  public initializeHintModel(): void {
    this._hintModel = new HintModel();
    this._hintModel.initialize();
  }

  public destroyHintModel(): void {
    this._hintModel?.destroy();
    this._hintModel = null;
  }
}
