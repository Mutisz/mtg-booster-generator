import { useErrorBoundary } from 'react-error-boundary';

import { CollectionCard } from '../state';
import { removeBasicLand } from '../util/removeBasicLand';
import { useActionProgress } from './useActionProgress';
import { useBoosterList } from './useBoosterList';
import { useCardList } from './useCardList';
import { useSetList } from './useSetList';

export const useSearchEvents = () => {
  const { setActionSuccess, setActionFail } = useActionProgress();
  const { setCardList, resetCardList } = useCardList();
  const { resetBoosterList } = useBoosterList();
  const { cacheSetList, resetSetList } = useSetList();

  const { showBoundary } = useErrorBoundary<Error>();

  const onSearchStart = () => {
    resetCardList();
    resetBoosterList();
    resetSetList();
  };

  const onSearchEnd = async (cardList: CollectionCard[]) => {
    const cardListNoLands = removeBasicLand(cardList);

    setCardList(cardListNoLands);
    setActionSuccess();
    await cacheSetList(cardListNoLands);
  };

  const onSearchFail = (error: Error) => {
    setActionFail();
    showBoundary(error);
  };

  return {
    onSearchStart,
    onSearchEnd,
    onSearchFail,
  };
};
