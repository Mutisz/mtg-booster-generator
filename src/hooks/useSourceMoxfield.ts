import { useLocalStorage } from 'usehooks-ts';

import { SourceMoxfield, defaults } from '../state';

export const useSourceMoxfield = () => {
  const [sourceMoxfield, setSourceMoxfield] = useLocalStorage<SourceMoxfield>(
    'sourceMoxfield',
    defaults.source.moxfield,
  );

  return {
    sourceMoxfield,
    setSourceMoxfield,
  };
};
