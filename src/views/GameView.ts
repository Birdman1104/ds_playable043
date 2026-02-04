import { PixiGrid } from 'libs/grid';
import { getGameViewGridConfig } from '../configs/gridConfigs/GameViewGC';
import { BoardView } from './BoardView';

export class GameView extends PixiGrid {
  public constructor() {
    super();

    this.init();
  }

  public getGridConfig(): ICellConfig {
    return getGameViewGridConfig();
  }

  public rebuild(): void {
    super.rebuild(this.getGridConfig());
  }

  private init(): void {
    const board = new BoardView();
    this.attach('board', board);
  }
}
