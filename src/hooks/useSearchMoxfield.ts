import { useCallback, useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';

import { CollectionSearchError } from '../errors/CollectionSearchError';
import { CollectionCard, ManaColor, Rarity, Source } from '../state';
import { useCardBoosterList } from './useCardBoosterList';
import { useCardCollection } from './useCardCollection';
import { useCredentialsMoxfield } from './useCredentialsMoxfield';

type CollectionPageData = {
  totalPages: number;
  data: CollectionCardData[];
};

type CollectionCardData = {
  id: string;
  quantity: number;
  card: {
    id: string;
    scryfall_id: string;
    set_name: string;
    name: string;
    type_line: string;
    color_identity: string[];
    rarity: string;
    multiverse_ids: string[];
  };
};

const baseUrl = 'https://api2.moxfield.com/v1';
const searchUrl = `${baseUrl}/collections/search?pageSize=100&sortType=cardName&sortDirection=ascending`;

const basicLandRegex = /Basic.+Land/;

const rarityMap: { [key: string]: Rarity } = {
  common: Rarity.Common,
  uncommon: Rarity.Uncommon,
  rare: Rarity.Rare,
  mythic: Rarity.Mythic,
};

const manaColorMap: { [key: string]: ManaColor } = {
  B: ManaColor.Black,
  U: ManaColor.Blue,
  G: ManaColor.Green,
  R: ManaColor.Red,
  W: ManaColor.White,
};

const getRarity = (rarity: string): Rarity => rarityMap[rarity] ?? Rarity.Other;

const getManaColorList = (colorList: string[]): ManaColor[] =>
  colorList.map((color) => {
    if (manaColorMap[color] == undefined) {
      throw new Error(`Mana color value ${color} is not recognized.`);
    }

    return manaColorMap[color];
  });

const fetchCollectionPage = async (
  setProgress: (progress: number) => void,
  bearerToken: string,
  page: number = 1,
  collection: CollectionCard[] = [],
): Promise<CollectionCard[]> => {
  const collectionPageResponse = await fetch(`${searchUrl}&pageNumber=${page}`, {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });
  if (collectionPageResponse.ok === false) {
    throw new Error('Unauthorized or invalid request!');
  }

  const collectionPage = (await collectionPageResponse.json()) as CollectionPageData;
  const collectionPageData = collectionPage.data.filter(
    (cardData) => cardData.card.type_line.match(basicLandRegex) === null,
  );
  const collectionNew = [
    ...collection,
    ...collectionPageData.map((cardData) => ({
      id: cardData.card.id,
      quantity: cardData.quantity,
      setName: cardData.card.set_name,
      cardName: cardData.card.name,
      rarity: getRarity(cardData.card.rarity),
      color: getManaColorList(cardData.card.color_identity),
      scryfallId: cardData.card.scryfall_id,
      multiverseIdList: cardData.card.multiverse_ids,
    })),
  ];

  setProgress((page / collectionPage.totalPages) * 100);

  return page !== collectionPage.totalPages
    ? fetchCollectionPage(setProgress, bearerToken, ++page, collectionNew)
    : collectionNew;
};

export const useSearchMoxfield = () => {
  const [progress, setProgress] = useState<number>(0);
  const { showBoundary } = useErrorBoundary<Error>();
  const { credentialsMoxfield } = useCredentialsMoxfield();
  const { cardCollection, setCardCollection } = useCardCollection();
  const { resetCardBoosterList } = useCardBoosterList();

  const fetchCollection = async () => {
    try {
      setCardCollection([]);
      resetCardBoosterList();
      const newCardCollection = await fetchCollectionPage(setProgress, credentialsMoxfield.bearerToken);
      setCardCollection(newCardCollection);
    } catch (error) {
      showBoundary(
        new CollectionSearchError(
          (error as Error).message,
          Source.Moxfield,
          'Please make sure that bearer token is valid and CORS is disabled as per instructions.',
        ),
      );
    }
  };

  const searchAndUpdate = useCallback(async () => {
    if (progress === 0) {
      await fetchCollection();
      setProgress(0);
    }
  }, []);

  return {
    cardCollectionProgress: progress,
    cardCollection,
    searchAndUpdate,
  };
};
