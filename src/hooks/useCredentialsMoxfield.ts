import { useLocalStorage } from 'usehooks-ts';

import { defaults } from '../state';

export const useCredentialsMoxfield = () => {
  const [credentialsMoxfield, setCredentialsMoxfield] = useLocalStorage(
    'credentialsMoxfield',
    defaults.credentials.moxfield,
  );

  return {
    credentialsMoxfield,
    setCredentialsMoxfield,
  };
};
