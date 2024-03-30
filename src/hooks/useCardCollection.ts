import { useLocalStorage } from 'usehooks-ts';

import { defaults } from '../state';

export const useCardCollection = () => {
  const [cardCollection, setCardCollection] = useLocalStorage('cardCollection', defaults.collection);

  return {
    cardCollection,
    setCardCollection,
  };
};
