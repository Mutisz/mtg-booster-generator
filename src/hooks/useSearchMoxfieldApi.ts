import { useCallback } from 'react';
import { useErrorBoundary } from 'react-error-boundary';

import { CollectionSearchError } from '../errors/CollectionSearchError';
import { CollectionCard, ManaColor, Rarity, SourceType } from '../state';
import { removeBasicLand } from '../util/removeBasicLand';
import { useBoosterList } from './useBoosterList';
import { useCardList } from './useCardList';
import { useSearchProgress } from './useSearchProgress';
import { useSourceMoxfield } from './useSourceMoxfield';

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
  cardData.card.card_faces.length > 0
    ? cardData.card.card_faces.map((cardFace) => `${imgUrl}/card-face-${cardFace.id}-normal.webp`)
    : [`${imgUrl}/card-${cardData.card.id}-normal.webp`];

const getDataUrl = (cardData: CollectionCardData): string => `${dataUrl}/${cardData.card.id}`;

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
  cardList: CollectionCard[] = [],
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
  const cardListNew = [
    ...cardList,
    ...collectionPage.data.map((cardData) => ({
      quantity: cardData.quantity,
      setName: cardData.card.set_name,
      cardName: cardData.card.name,
      type: cardData.card.type_line,
      rarity: getRarity(cardData.card.rarity),
      color: getManaColorList(cardData.card.color_identity),
      imgUrlList: getImgUrlList(cardData),
      dataUrl: getDataUrl(cardData),
    })),
  ];

  setProgress((page / collectionPage.totalPages) * 100);

  return page !== collectionPage.totalPages
    ? fetchCollectionPage(setProgress, bearerToken, ++page, cardListNew)
    : cardListNew;
};

export const useSearchMoxfieldApi = () => {
  const { isInProgress, setSearchProgress } = useSearchProgress();
  const { showBoundary } = useErrorBoundary<Error>();
  const { sourceMoxfield } = useSourceMoxfield();
  const { setCardList, resetCardList } = useCardList();
  const { resetBoosterList } = useBoosterList();

  const tryFetchCollection = async () => {
    try {
      resetCardList();
      resetBoosterList();
      const cardListNew = await fetchCollectionPage(setSearchProgress, sourceMoxfield.bearerToken);
      setCardList(removeBasicLand(cardListNew));
      setSearchProgress(100);
    } catch (error) {
      setSearchProgress(0);
      showBoundary(
        new CollectionSearchError(
          (error as Error).message,
          SourceType.MoxfieldApi,
          'Please make sure that bearer token is valid and CORS is disabled as per instructions.',
        ),
      );
    }
  };

  const searchMoxfieldApi = useCallback(async () => {
    if (isInProgress() === false) {
      await tryFetchCollection();
    }
  }, []);

  return searchMoxfieldApi;
};
