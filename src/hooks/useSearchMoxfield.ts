import { useCallback, useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';

import { CollectionSearchError } from '../errors/CollectionSearchError';
import { CollectionCard, ManaColor, Rarity, Source } from '../state';
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
    color_identity: string[];
    rarity: string;
    multiverse_ids: string[];
  };
};

const baseUrl = 'https://api2.moxfield.com/v1';
const searchUrl = `${baseUrl}/collections/search?pageSize=100&sortType=cardName&sortDirection=ascending`;

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

  const collectionPageData = (await collectionPageResponse.json()) as CollectionPageData;

  const collectionWithPageData = [
    ...collection,
    ...collectionPageData.data.map((cardData) => ({
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

  return page !== collectionPageData.totalPages
    ? fetchCollectionPage(bearerToken, ++page, collectionWithPageData)
    : collectionWithPageData;
};

export const useSearchMoxfield = () => {
  const [loading, setLoading] = useState(false);
  const { showBoundary } = useErrorBoundary<Error>();
  const { credentialsMoxfield } = useCredentialsMoxfield();
  const { cardCollection, setCardCollection } = useCardCollection();

  const fetchCollection = async () => {
    try {
      const newCardCollection = await fetchCollectionPage(credentialsMoxfield.bearerToken);
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
    if (loading === false) {
      setLoading(true);
      await fetchCollection();
      setLoading(false);
    }
  }, [loading]);

  return {
    cardCollectionLoading: loading,
    cardCollection,
    searchAndUpdate,
  };
};
