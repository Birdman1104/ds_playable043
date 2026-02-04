import { AdModel } from './AdModel';
import { GameModel } from './GameModel';
import { ObservableModel } from './ObservableModel';

class HeadModel extends ObservableModel {
    private _gameModel: GameModel | null = null;
    private _ad: AdModel | null = null;

    public constructor() {
        super('HeadModel');
        this.makeObservable();
    }

    public set gameModel(value: GameModel | null) {
        this._gameModel = value;
    }

    public get gameModel(): GameModel | null {
        return this._gameModel;
    }

    public set ad(value: AdModel | null) {
        this._ad = value;
    }

    public get ad(): AdModel | null {
        return this._ad;
    }

    public initializeADModel(): void {
        this._ad = new AdModel();
        this._ad.initialize();
    }

    public initializeGameModel(): void {
        this._gameModel = new GameModel();
        this._gameModel.initialize();
    }

    public destroyGameModel(): void {
        this._gameModel?.destroy();
        this._gameModel = null;
    }
}

const Head = new HeadModel();

export default Head;
