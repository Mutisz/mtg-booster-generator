import { useLocalStorage } from 'usehooks-ts';

import { Preferences, defaults } from '../state';

export const usePreferences = () => {
  const [preferences, setPreferences] = useLocalStorage<Preferences>('preferences', defaults.preferences);

  return { preferences, setPreferences };
};
