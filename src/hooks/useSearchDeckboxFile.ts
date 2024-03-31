import csv from 'csvtojson';
import { useCallback } from 'react';

import { CollectionCard, Rarity } from '../state';
import { removeBasicLand } from '../util/removeBasicLand';
import { useCardBoosterList } from './useCardBoosterList';
import { useCardCollection } from './useCardCollection';

type CollectionCardData = {
  Count: string;
  Name: string;
  Edition: string;
  'Printing Id': string;
  Type: string;
  Cost: string;
  Rarity: string;
  'Image URL': string;
};

const dataUrl = 'https://deckbox.org/mtg';

const rarityMap: { [key: string]: Rarity } = {
  Common: Rarity.Common,
  Uncommon: Rarity.Uncommon,
  Rare: Rarity.Rare,
  MythicRare: Rarity.Mythic,
};

const getRarity = (rarity: string): Rarity => rarityMap[rarity] ?? Rarity.Other;

export const useSearchDeckboxFile = () => {
  const { cardCollection, setCardCollection } = useCardCollection();
  const { resetCardBoosterList } = useCardBoosterList();

  const searchAndUpdate = useCallback(async (file: File) => {
    setCardCollection([]);
    resetCardBoosterList();

    const collectionFileString = await file.text();
    const collectionFileData = await csv().fromString(collectionFileString);
    const collectionNew: CollectionCard[] = (collectionFileData as CollectionCardData[]).map((cardData) => ({
      quantity: parseInt(cardData.Count),
      setName: cardData.Edition,
      cardName: cardData.Name,
      type: cardData.Type,
      rarity: getRarity(cardData.Rarity),
      imgUrlList: [cardData['Image URL']],
      dataUrl: `${dataUrl}/${cardData.Name}?printing=${cardData['Printing Id']}`,
    }));

    setCardCollection(removeBasicLand(collectionNew));
  }, []);

  return {
    cardCollection,
    searchAndUpdate,
  };
};
