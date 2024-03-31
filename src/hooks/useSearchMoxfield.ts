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
  quantity: number;
  card: {
    id: string;
    set_name: string;
    name: string;
    type_line: string;
    color_identity: string[];
    rarity: string;
    card_faces: {
      id: string;
    }[];
  };
};

const apiUrl = 'https://api2.moxfield.com/v1';
const imgUrl = 'https://assets.moxfield.net/cards';
const dataUrl = 'https://www.moxfield.com/cards';

const searchUrl = `${apiUrl}/collections/search?pageSize=100&sortType=cardName&sortDirection=ascending`;

const getImgUrlList = (cardData: CollectionCardData): string[] =>
  cardData.card.card_faces.map((cardFace) => `${imgUrl}/card-face-${cardFace.id}-normal.webp`);

const getDataUrl = (cardData: CollectionCardData): string => `${dataUrl}/${cardData.card.id}`;

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
      quantity: cardData.quantity,
      setName: cardData.card.set_name,
      cardName: cardData.card.name,
      rarity: getRarity(cardData.card.rarity),
      color: getManaColorList(cardData.card.color_identity),
      imgUrlList: getImgUrlList(cardData),
      dataUrl: getDataUrl(cardData),
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
          Source.MoxfieldApi,
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
