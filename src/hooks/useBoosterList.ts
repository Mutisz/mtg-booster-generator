import _ from 'lodash';
import { useLocalStorage } from 'usehooks-ts';

import { Booster, BoosterCard, BoosterType, CollectionCard, Preferences, Rarity, defaults } from '../state';
import { useCardList } from './useCardList';
import { usePreferences } from './usePreferences';
import { useSourceType } from './useSourceType';

type BoosterPart = {
  count: number;
  rarity?: Rarity[];
  setName?: string;
  chancePercent?: number;
  replacement?: Omit<BoosterPart, 'replacement'>;
};

const boosterPartListByType: { [key in BoosterType]: BoosterPart[] } = {
  [BoosterType.Draft]: [
    { count: 10, rarity: [Rarity.Common], replacement: { count: 1, chancePercent: 0.33 } },
    { count: 3, rarity: [Rarity.Uncommon] },
    { count: 1, rarity: [Rarity.Rare, Rarity.Mythic] },
  ],
  [BoosterType.Play]: [
    {
      count: 7,
      rarity: [Rarity.Common],
      replacement: { count: 1, setName: 'The List', chancePercent: 0.125 },
    },
    { count: 2 },
  ],
  [BoosterType.Set]: [
    { count: 7, rarity: [Rarity.Common, Rarity.Uncommon] },
    { count: 3 },
    { count: 1, rarity: [Rarity.Rare, Rarity.Mythic] },
    { count: 1, setName: 'The List', chancePercent: 0.25 },
  ],
};

const getMatchingCardList = (
  preferences: Preferences,
  boosterPart: BoosterPart,
  cardList: CollectionCard[],
): CollectionCard[] =>
  cardList.filter((card) => {
    const setNameList = boosterPart.setName ? [boosterPart.setName] : preferences.expansionSetNameList;
    const matchPreferences = setNameList.length === 0 || setNameList.includes(card.setName);
    const matchRarity = boosterPart.rarity === undefined || boosterPart.rarity.includes(card.rarity);

    return card.quantity > 0 && matchPreferences && matchRarity;
  });

const generateBoosterPart = (
  preferences: Preferences,
  boosterPart: BoosterPart,
  cardList: CollectionCard[],
): { boosterCardList: BoosterCard[]; cardListNew: CollectionCard[] } => {
  const emptyBooster = { boosterCardList: [], cardListNew: cardList };
  if (boosterPart.chancePercent !== undefined && Math.random() > boosterPart.chancePercent) {
    return emptyBooster;
  }

  const { boosterCardList: replacementCardList, cardListNew: cardListNoReplacement } =
    boosterPart.replacement !== undefined
      ? generateBoosterPart(preferences, boosterPart.replacement, cardList)
      : emptyBooster;
  const matchingCardList = getMatchingCardList(preferences, boosterPart, cardListNoReplacement);

  const boosterCardCount = boosterPart.count - replacementCardList.length;
  const boosterCardList = _.sampleSize(matchingCardList, boosterCardCount);
  const cardListNoBoosterPart = cardListNoReplacement.map((card) => {
    return boosterCardList.includes(card) ? { ...card, quantity: --card.quantity } : card;
  });

  return {
    boosterCardList: boosterCardList.map((card) => ({
      cardName: card.cardName,
      imgUrlList: card.imgUrlList,
      dataUrl: card.dataUrl,
    })),
    cardListNew: cardListNoBoosterPart,
  };
};

const generateBooster = (
  preferences: Preferences,
  boosterPartList: BoosterPart[],
  cardList: CollectionCard[],
): { boosterCardList: BoosterCard[]; cardListNew: CollectionCard[] } => {
  let cardListNew: CollectionCard[] = cardList;
  let boosterCardList: BoosterCard[] = [];
  boosterPartList.forEach((boosterPart) => {
    const boosterPartGenerated = generateBoosterPart(preferences, boosterPart, cardListNew);
    boosterCardList = boosterCardList.concat(boosterPartGenerated.boosterCardList);
    cardListNew = boosterPartGenerated.cardListNew;
  });

  return { boosterCardList, cardListNew };
};

const generateBoosterList = (preferences: Preferences, cardList: CollectionCard[]): Booster[] => {
  const boosterPartList = boosterPartListByType[preferences.boosterType];
  let cardListNew: CollectionCard[] = cardList;
  let boosterList: Booster[] = [];
  for (let i = 0; i < preferences.boosterCount; i++) {
    const boosterGenerated = generateBooster(preferences, boosterPartList, cardListNew);
    boosterList = boosterList.concat([{ cardList: boosterGenerated.boosterCardList }]);
    cardListNew = boosterGenerated.cardListNew;
  }

  return boosterList;
};

export const useBoosterList = () => {
  const [boosterList, setBoosterList] = useLocalStorage('boosterList', defaults.boosterListBySource);
  const { sourceType } = useSourceType();
  const { preferences } = usePreferences();
  const { cardList } = useCardList();

  const resetBoosterList = () => setBoosterList({ ...boosterList, [sourceType]: [] });

  return {
    boosterList: boosterList[sourceType],
    generateBoosterList: () => {
      resetBoosterList();
      const boosterListForSource = generateBoosterList(preferences, _.cloneDeep(cardList));
      setBoosterList({ ...boosterList, [sourceType]: boosterListForSource });
    },
    resetBoosterList,
  };
};
