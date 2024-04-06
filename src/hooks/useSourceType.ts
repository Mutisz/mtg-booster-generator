import { useLocalStorage } from 'usehooks-ts';

import { SourceType, defaults } from '../state';

export const useSourceType = () => {
  const [sourceType, setSourceType] = useLocalStorage<SourceType>('sourceType', defaults.source.type);

  return {
    sourceType,
    setSourceType,
  };
};
