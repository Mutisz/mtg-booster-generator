import { concat, sample, sampleSize, shuffle } from 'lodash';

import { Booster, BoosterCard, BoosterType, CollectionCard, ManaColor, Preferences, Rarity } from '../state';

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
  [BoosterType.Jumpstart]: [],
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
  color: ManaColor | null = null,
): CollectionCard[] =>
  cardList.filter((card) => {
    const setCodeList = preferences.expansionSetCodeList;
    const cardColorList = card.colorList ?? [];

    const matchPreferences = setCodeList.length === 0 || setCodeList.includes(card.setCode);
    const matchRarity = boosterPart.rarity === undefined || boosterPart.rarity.includes(card.rarity);
    const matchColor = color === null || cardColorList.length === 0 || cardColorList.includes(color);

    return card.quantity > 0 && matchPreferences && matchRarity && matchColor;
  });

const randomizeCardBalancingColor = (
  preferences: Preferences,
  boosterPart: BoosterPart,
  cardList: CollectionCard[],
  colorRotation: ManaColor[],
): CollectionCard | null => {
  while (colorRotation.length !== 0) {
    const color = colorRotation.shift();
    if (color === undefined) {
      return null;
    }

    const colorCardList = getMatchingCardList(preferences, boosterPart, cardList, color);
    const card = sample(colorCardList);
    if (card !== undefined) {
      card.quantity--;
      colorRotation.push(color);
      return card;
    }
  }

  return null;
};

const randomizeCardListBalancingColor = (
  preferences: Preferences,
  boosterPart: BoosterPart,
  boosterCardCount: number,
  cardList: CollectionCard[],
  colorRotation: ManaColor[],
): CollectionCard[] => {
  const selectedCardList: CollectionCard[] = [];
  for (let i = 0; i < boosterCardCount; i++) {
    const card = randomizeCardBalancingColor(preferences, boosterPart, cardList, colorRotation);
    if (card === null) {
      return selectedCardList;
    }

    selectedCardList.push(card);
  }

  return selectedCardList;
};

const randomizeCardList = (
  preferences: Preferences,
  boosterPart: BoosterPart,
  boosterCardCount: number,
  cardList: CollectionCard[],
): CollectionCard[] => {
  const matchingCardList = getMatchingCardList(preferences, boosterPart, cardList);

  const selectedCardList = sampleSize(matchingCardList, boosterCardCount);
  selectedCardList.forEach((card) => card.quantity--);

  return selectedCardList;
};

const generateBoosterPart = (
  preferences: Preferences,
  boosterPart: BoosterPart,
  cardList: CollectionCard[],
  colorRotation: ManaColor[],
): BoosterCard[] => {
  if (boosterPart.chancePercent !== undefined && Math.random() > boosterPart.chancePercent) {
    return [];
  }

  const replacementBoosterCardList =
    boosterPart.replacement !== undefined
      ? generateBoosterPart(preferences, boosterPart.replacement, cardList, colorRotation)
      : [];

  const boosterCardCount = boosterPart.count - replacementBoosterCardList.length;
  const selectedCardList = preferences.balanceColors
    ? randomizeCardListBalancingColor(preferences, boosterPart, boosterCardCount, cardList, colorRotation)
    : randomizeCardList(preferences, boosterPart, boosterCardCount, cardList);

  return concat(
    selectedCardList.map(
      (card) => ({
        cardName: card.cardName,
        imgUrlList: card.imgUrlList,
        dataUrl: card.dataUrl,
      }),
      replacementBoosterCardList,
    ),
  );
};

const generateBooster = (
  preferences: Preferences,
  boosterPartList: BoosterPart[],
  cardList: CollectionCard[],
): BoosterCard[] => {
  let boosterCardList: BoosterCard[] = [];
  const colorRotation = shuffle(Object.values(ManaColor));
  boosterPartList.forEach((boosterPart) => {
    const boosterPartCardList = generateBoosterPart(preferences, boosterPart, cardList, colorRotation);
    boosterCardList = boosterCardList.concat(boosterPartCardList);
  });

  return boosterCardList;
};

const generateBoosterList = (preferences: Preferences, cardList: CollectionCard[]): Booster[] => {
  const boosterPartList = boosterPartListByType[preferences.boosterType];
  let boosterList: Booster[] = [];
  for (let i = 0; i < preferences.boosterCount; i++) {
    const boosterCardList = generateBooster(preferences, boosterPartList, cardList);
    boosterList = boosterList.concat([{ cardList: boosterCardList, type: preferences.boosterType }]);
  }

  return boosterList;
};

export default generateBoosterList;
