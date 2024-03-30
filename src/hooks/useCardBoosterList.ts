import _ from 'lodash';
import { useLocalStorage } from 'usehooks-ts';

import { Booster, BoosterCard, BoosterType, CollectionCard, Preferences, Rarity, defaults } from '../state';
import { useCardCollection } from './useCardCollection';
import { usePreferences } from './usePreferences';

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
  cardCollection: CollectionCard[],
): CollectionCard[] =>
  cardCollection.filter((card) => {
    const setNameList = boosterPart.setName ? [boosterPart.setName] : preferences.expansionSetNameList;
    const matchPreferences = setNameList.length === 0 || setNameList.includes(card.setName);
    const matchRarity = boosterPart.rarity === undefined || boosterPart.rarity.includes(card.rarity);

    return card.quantity > 0 && matchPreferences && matchRarity;
  });

const generateBoosterPart = (
  preferences: Preferences,
  boosterPart: BoosterPart,
  cardCollection: CollectionCard[],
): { boosterCardList: BoosterCard[]; cardCollectionNew: CollectionCard[] } => {
  const emptyBooster = { boosterCardList: [], cardCollectionNew: cardCollection };
  if (boosterPart.chancePercent !== undefined && Math.random() > boosterPart.chancePercent) {
    return emptyBooster;
  }

  const { boosterCardList: replacementCardList, cardCollectionNew: cardCollectionNoReplacement } =
    boosterPart.replacement !== undefined
      ? generateBoosterPart(preferences, boosterPart.replacement, cardCollection)
      : emptyBooster;
  const matchingCardList = getMatchingCardList(preferences, boosterPart, cardCollectionNoReplacement);

  const boosterCardCount = boosterPart.count - replacementCardList.length;
  const boosterCardList = _.sampleSize(matchingCardList, boosterCardCount);
  const cardCollectionNoBooster = cardCollectionNoReplacement.map((card) => {
    return boosterCardList.includes(card) ? { ...card, quantity: --card.quantity } : card;
  });

  return {
    boosterCardList: boosterCardList.map((card) => ({
      cardName: card.cardName,
      scryfallId: card.scryfallId,
      multiverseIdList: card.multiverseIdList,
    })),
    cardCollectionNew: cardCollectionNoBooster,
  };
};

const generateBooster = (
  preferences: Preferences,
  boosterPartList: BoosterPart[],
  cardCollection: CollectionCard[],
): { boosterCardList: BoosterCard[]; cardCollectionNew: CollectionCard[] } => {
  let cardCollectionNew: CollectionCard[] = cardCollection;
  let boosterCardList: BoosterCard[] = [];
  boosterPartList.forEach((boosterPart) => {
    const boosterPartGenerated = generateBoosterPart(preferences, boosterPart, cardCollectionNew);
    boosterCardList = boosterCardList.concat(boosterPartGenerated.boosterCardList);
    cardCollectionNew = boosterPartGenerated.cardCollectionNew;
  });

  return { boosterCardList, cardCollectionNew };
};

const generateBoosterList = (preferences: Preferences, cardCollection: CollectionCard[]): Booster[] => {
  const boosterPartList = boosterPartListByType[preferences.boosterType];
  let cardCollectionNew: CollectionCard[] = cardCollection;
  let boosterList: Booster[] = [];
  for (let i = 0; i < preferences.boosterCount; i++) {
    const boosterGenerated = generateBooster(preferences, boosterPartList, cardCollectionNew);
    boosterList = boosterList.concat([{ cardList: boosterGenerated.boosterCardList }]);
    cardCollectionNew = boosterGenerated.cardCollectionNew;
  }

  return boosterList;
};

export const useCardBoosterList = () => {
  const [cardBoosterList, setCardBoosterList] = useLocalStorage('cardBoosterList', defaults.boosterList);
  const { preferences } = usePreferences();
  const { cardCollection } = useCardCollection();

  return {
    cardBoosterList,
    generateCardBoosterList: () => {
      const boosterList = generateBoosterList(preferences, _.cloneDeep(cardCollection));
      setCardBoosterList(boosterList);
    },
    resetCardBoosterList: () => setCardBoosterList([]),
  };
};
