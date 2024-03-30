import { useLocalStorage } from 'usehooks-ts';

import { defaults } from '../state';

export const useCredentialsSource = () => {
  const [source, setSource] = useLocalStorage('credentialsSource', defaults.credentials.source);

  return {
    source,
    setSource,
  };
};
