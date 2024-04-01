import { useLocalStorage } from 'usehooks-ts';

import { defaults } from '../state';
import { useSourceType } from './useSourceType';

export const useSearchProgress = () => {
  const [searchProgress, setSearchProgress] = useLocalStorage('searchProgress', defaults.searchProgressBySource);
  const { sourceType } = useSourceType();

  return {
    searchProgress: searchProgress[sourceType],
    isInProgress: () => searchProgress[sourceType] > 0 && searchProgress[sourceType] < 100,
    setSearchProgress: (progress: number) => setSearchProgress({ ...searchProgress, [sourceType]: progress }),
  };
};
