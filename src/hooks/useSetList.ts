import { uniq } from 'lodash';
import { useCallback } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { useLocalStorage } from 'usehooks-ts';

import { ActionProgress, CollectionCard, JsonSet, JsonSetData, SourceType, defaults } from '../state';
import { useActionProgress } from './useActionProgress';
import { useSourceType } from './useSourceType';

const apiUrl = 'https://mtgjson.com/api/v5';

const progressAction = 'Caching set list';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchSet = async (setCode: string, setDataList: JsonSetData[]) => {
  const setRespose = await fetch(`${apiUrl}/${setCode.toUpperCase()}.json`);
  if (setRespose.ok === false) {
    throw new Error('Unauthorized or invalid request!');
  }

  const setData = ((await setRespose.json()) as JsonSet).data;
  setDataList.push({
    booster: setData.booster ? { jumpstart: setData.booster.jumpstart } : {},
    cards: setData.cards.map((card) => ({ uuid: card.uuid, name: card.name })),
    code: setData.code,
    name: setData.name,
  });

  // Throttle to prevent HTTP errors
  await sleep(500);
};

const fetchSetList = async (
  setActionProgress: (progress: ActionProgress) => void,
  cardList: CollectionCard[],
): Promise<JsonSetData[]> => {
  const setCodeList = uniq(cardList.map((card) => card.setCode));

  let setIndex = 1;
  const setDataList: JsonSetData[] = [];
  for (const setCode of setCodeList) {
    await fetchSet(setCode, setDataList);
    setActionProgress({ action: progressAction, progress: (setIndex / setCodeList.length) * 100 });
    setIndex++;
  }

  return setDataList;
};

export const useSetList = () => {
  const [setList, setSetList] = useLocalStorage<{ [key in SourceType]: JsonSetData[] }>(
    'setList',
    defaults.setListBySource,
  );
  const { isActionInProgress, setActionSuccess, setActionFail, setActionProgress } = useActionProgress();
  const { sourceType } = useSourceType();

  const { showBoundary } = useErrorBoundary<Error>();

  const resetSetList = () => setSetList({ ...setList, [sourceType]: [] });
  const tryCacheSetList = async (cardList: CollectionCard[]) => {
    try {
      resetSetList();
      const setListNew = await fetchSetList(setActionProgress, cardList);
      setSetList({ ...setList, [sourceType]: setListNew });
      setActionSuccess();
    } catch (error) {
      setActionFail();
      showBoundary(error as Error);
    }
  };

  const cacheSetListCallback = useCallback(
    async (cardList: CollectionCard[]) => {
      if (isActionInProgress() === false) {
        await tryCacheSetList(cardList);
      }
    },
    [sourceType],
  );

  return { setList: setList[sourceType], cacheSetList: cacheSetListCallback, resetSetList };
};
