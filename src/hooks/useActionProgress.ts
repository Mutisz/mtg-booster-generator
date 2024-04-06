import { useLocalStorage } from 'usehooks-ts';

import { ActionProgress, SourceType, defaults } from '../state';
import { useSourceType } from './useSourceType';

export const useActionProgress = () => {
  const [actionProgress, setActionProgress] = useLocalStorage<{ [key in SourceType]: ActionProgress }>(
    'actionProgress',
    defaults.actionProgressBySource,
  );
  const { sourceType } = useSourceType();

  return {
    actionProgress: actionProgress[sourceType],
    isActionInProgress: () => actionProgress[sourceType].progress > 0 && actionProgress[sourceType].progress < 100,
    setActionSuccess: () => setActionProgress({ ...actionProgress, [sourceType]: { progress: 100 } }),
    setActionFail: () => setActionProgress({ ...actionProgress, [sourceType]: { progress: 0 } }),
    setActionProgress: (progress: ActionProgress) => setActionProgress({ ...actionProgress, [sourceType]: progress }),
  };
};
