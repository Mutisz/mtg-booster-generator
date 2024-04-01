import { useLocalStorage } from 'usehooks-ts';

import { defaults } from '../state';

export const useSourceMoxfield = () => {
  const [sourceMoxfield, setSourceMoxfield] = useLocalStorage('sourceMoxfield', defaults.source.moxfield);

  return {
    sourceMoxfield,
    setSourceMoxfield,
  };
};
