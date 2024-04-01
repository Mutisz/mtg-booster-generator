import { useLocalStorage } from 'usehooks-ts';

import { defaults } from '../state';

export const useSourceType = () => {
  const [sourceType, setSourceType] = useLocalStorage('sourceType', defaults.source.type);

  return {
    sourceType,
    setSourceType,
  };
};
