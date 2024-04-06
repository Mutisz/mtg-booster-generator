import { useLocalStorage } from 'usehooks-ts';

import { CollectionCard, SourceType, defaults } from '../state';
import { useSourceType } from './useSourceType';

export const useCardList = () => {
  const [cardList, setCardList] = useLocalStorage<{ [key in SourceType]: CollectionCard[] }>(
    'cardList',
    defaults.cardListBySource,
  );
  const { sourceType } = useSourceType();

  return {
    cardList: cardList[sourceType],
    setCardList: (cardListForSource: CollectionCard[]) => setCardList({ ...cardList, [sourceType]: cardListForSource }),
    resetCardList: () => setCardList({ ...cardList, [sourceType]: [] }),
  };
};
