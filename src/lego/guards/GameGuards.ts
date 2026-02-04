import { GAME_CONFIG } from 'configs/GameConfig';
import Head from 'models/HeadModel';

export const hintParamGuard = (): boolean => GAME_CONFIG.Hint;
export const hintModelGuard = (): boolean => !!Head.gameModel?.hintModel;
