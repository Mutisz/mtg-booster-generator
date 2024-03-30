import { useLocalStorage } from 'usehooks-ts';

import { defaults } from '../state';

export const usePreferences = () => {
  const [preferences, setPreferences] = useLocalStorage('preferences', defaults.preferences);

  return { preferences, setPreferences };
};
