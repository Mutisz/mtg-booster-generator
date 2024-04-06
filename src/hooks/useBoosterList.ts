import { cloneDeep } from 'lodash';
import { useCallback } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { useLocalStorage } from 'usehooks-ts';

import { Booster, BoosterType, SourceType, defaults } from '../state';
import generateBoosterList from '../util/generateBoosterList';
import generateJumpstartList from '../util/generateJumpstartList';
import { useCardList } from './useCardList';
import { usePreferences } from './usePreferences';
import { useSourceType } from './useSourceType';

export const useBoosterList = () => {
  const [boosterList, setBoosterList] = useLocalStorage<{ [key in SourceType]: Booster[] }>(
    'boosterList',
    defaults.boosterListBySource,
  );
  const { sourceType } = useSourceType();
  const { preferences } = usePreferences();
  const { cardList } = useCardList();

  const { showBoundary } = useErrorBoundary<Error>();

  const resetBoosterList = () => setBoosterList({ ...boosterList, [sourceType]: [] });
  const tryGenerateBoosterList = async () => {
    try {
      resetBoosterList();
      const boosterListForSource =
        preferences.boosterType === BoosterType.Jumpstart
          ? await generateJumpstartList(preferences, cloneDeep(cardList))
          : generateBoosterList(preferences, cloneDeep(cardList));
      setBoosterList({ ...boosterList, [sourceType]: boosterListForSource });
    } catch (error) {
      showBoundary(error as Error);
    }
  };

  const generateBoosterListCallback = useCallback(async () => {
    await tryGenerateBoosterList();
  }, [sourceType, preferences, cardList]);

  return {
    boosterList: boosterList[sourceType],
    generateBoosterList: generateBoosterListCallback,
    resetBoosterList,
  };
};
