import csv from 'csvtojson';
import { useCallback } from 'react';

import { CollectionSearchError } from '../errors/CollectionSearchError';
import { ActionProgress, CollectionCard, Rarity, SourceType } from '../state';
import { useActionProgress } from './useActionProgress';
import { useSearchEvents } from './useSearchEvents';

type FileCardData = {
  Count: string;
  Name: string;
  Edition: string;
  'Edition Code': string;
  'Printing Id': string;
  Type: string;
  Cost: string;
  Rarity: string;
  'Image URL': string;
};

const dataUrl = 'https://deckbox.org/mtg';

const progressAction = 'Fetching Deckbox collection';

const rarityMap: { [key: string]: Rarity } = {
  Common: Rarity.Common,
  Uncommon: Rarity.Uncommon,
  Rare: Rarity.Rare,
  MythicRare: Rarity.Mythic,
};

const getRarity = (rarity: string): Rarity => rarityMap[rarity] ?? Rarity.Other;

const searchDeckboxFile = async (
  setActionProgress: (progress: ActionProgress) => void,
  file: File,
): Promise<CollectionCard[]> => {
  // 1 of 3 steps
  const fileString = await file.text();
  setActionProgress({ action: progressAction, progress: 33 });

  // 2 of 3 steps
  const fileData = await csv().fromString(fileString);
  setActionProgress({ action: progressAction, progress: 66 });

  return (fileData as FileCardData[]).map((cardData) => ({
    quantity: parseInt(cardData.Count),
    setName: cardData.Edition,
    setCode: cardData['Edition Code'],
    cardName: cardData.Name,
    type: cardData.Type,
    rarity: getRarity(cardData.Rarity),
    imgUrlList: [cardData['Image URL']],
    dataUrl: `${dataUrl}/${cardData.Name}?printing=${cardData['Printing Id']}`,
  }));
};

export const useSearchDeckboxFile = () => {
  const { isActionInProgress, setActionProgress } = useActionProgress();
  const { onSearchStart, onSearchEnd, onSearchFail } = useSearchEvents();

  const trySearchDeckboxFile = async (file: File) => {
    try {
      onSearchStart();
      const cardListNew = await searchDeckboxFile(setActionProgress, file);
      await onSearchEnd(cardListNew);
    } catch (error) {
      onSearchFail(
        new CollectionSearchError(
          (error as Error).message,
          SourceType.DeckboxFile,
          'Please make sure that required columns are present in imported file.',
        ),
      );
    }
  };

  const searchDeckboxFileCallback = useCallback(async (file: File) => {
    if (isActionInProgress() === false) {
      await trySearchDeckboxFile(file);
    }
  }, []);

  return searchDeckboxFileCallback;
};
