import { GameState } from '../../models/GameModel';
import Head from '../../models/HeadModel';




export const onGameModelStateUpdateCommand = (state: GameState): void => {
  switch (state) {
    case GameState.Game:
      break;
    case GameState.Lose:
      break;
    case GameState.Win:
      break;

    default:
      break;
  }
};


export const onShowLoseCtaCommand = (): void => {
  Head.gameModel?.setState(GameState.Lose);
};

export const onFirstClickCommand = (): void => {
  Head.ad?.sound?.turnOn();
};
