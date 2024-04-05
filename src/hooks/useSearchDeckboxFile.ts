import csv from 'csvtojson';
import { useCallback } from 'react';
import { useErrorBoundary } from 'react-error-boundary';

import { CollectionSearchError } from '../errors/CollectionSearchError';
import { CollectionCard, Rarity, SourceType } from '../state';
import { removeBasicLand } from '../util/removeBasicLand';
import { useBoosterList } from './useBoosterList';
import { useCardList } from './useCardList';
import { useSearchProgress } from './useSearchProgress';

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

const rarityMap: { [key: string]: Rarity } = {
  Common: Rarity.Common,
  Uncommon: Rarity.Uncommon,
  Rare: Rarity.Rare,
  MythicRare: Rarity.Mythic,
};

const getRarity = (rarity: string): Rarity => rarityMap[rarity] ?? Rarity.Other;

const searchDeckboxFile = async (setProgress: (progress: number) => void, file: File): Promise<CollectionCard[]> => {
  const fileString = await file.text();
  setProgress(33); // 1 of 3 steps

  const fileData = await csv().fromString(fileString);
  setProgress(66); // 2 of 3 steps

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
  const { searchProgress, isInProgress, setSearchProgress } = useSearchProgress();
  const { showBoundary } = useErrorBoundary<Error>();
  const { setCardList, resetCardList } = useCardList();
  const { resetBoosterList } = useBoosterList();

  const trySearchDeckboxFile = async (file: File) => {
    try {
      resetCardList();
      resetBoosterList();
      const cardListNew = await searchDeckboxFile(setSearchProgress, file);
      setCardList(removeBasicLand(cardListNew));
      setSearchProgress(100);
    } catch (error) {
      setSearchProgress(0);
      showBoundary(
        new CollectionSearchError(
          (error as Error).message,
          SourceType.DeckboxFile,
          'Please make sure that required columns are present in imported file.',
        ),
      );
    }
  };

  const searchDeckboxFileCallback = useCallback(
    async (file: File) => {
      if (isInProgress() === false) {
        await trySearchDeckboxFile(file);
      }
    },
    [searchProgress],
  );

  return searchDeckboxFileCallback;
};
