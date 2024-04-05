import { head, sampleSize, sum } from 'lodash';

import { Booster, BoosterType, CollectionCard, Preferences } from '../state';

type JsonBoosterId = string;
type JsonCardUuid = string;
type JsonCardWeight = number;

type JsonCard = {
  uuid: JsonCardUuid;
  name: string;
};

type JsonBoosterSheet = {
  cards: { [key: JsonCardUuid]: JsonCardWeight };
  fixed?: boolean;
};

type JsonBooster = {
  contents: { [key: JsonBoosterId]: JsonCardWeight };
  weight: JsonCardWeight;
};

type JsonBoosterType = {
  boosters: JsonBooster[];
  sheets: { [key: JsonBoosterId]: JsonBoosterSheet };
};

type JsonSetData = {
  booster: { jumpstart?: JsonBoosterType };
  cards: JsonCard[];
};

type JsonSet = {
  data: JsonSetData;
};

const apiUrl = 'https://mtgjson.com/api/v5';

const getMatchingCardList = (sheet: JsonBoosterSheet, setCardList: JsonCard[], cardList: CollectionCard[]) =>
  Object.entries(sheet.cards).reduce<JsonCard[]>((matchingCardListAcc, [uuid, weight]) => {
    const setCard = setCardList.find((setCard) => setCard.uuid === uuid);
    if (setCard === undefined) {
      throw new Error('Cannot find card in set!');
    }

    if (['Swamp', 'Island', 'Forest', 'Mountain', 'Plains'].includes(setCard.name)) {
      return [...matchingCardListAcc, ...new Array<JsonCard>(weight).fill(setCard)];
    }
    const matchingCard = cardList.find((card) => card.cardName === setCard.name && card.quantity >= weight);
    if (matchingCard !== undefined) {
      matchingCard.quantity -= weight;
      return [...matchingCardListAcc, ...new Array<JsonCard>(weight).fill(setCard)];
    }

    return matchingCardListAcc;
  }, []);

const getBoosterCardList = (
  boosterType: JsonBoosterType,
  booster: JsonBooster,
  setCardList: JsonCard[],
  cardList: CollectionCard[],
) =>
  Object.entries(booster.contents).reduce<JsonCard[]>((boosterCardListAcc, [sheetId, sheetWeight]) => {
    const sheet = boosterType.sheets[sheetId];
    const matchingCardList = getMatchingCardList(sheet, setCardList, cardList);
    if (sheet.fixed && matchingCardList.length === sheetWeight) {
      return [...boosterCardListAcc, ...matchingCardList];
    } else if (matchingCardList.length >= sheetWeight) {
      return [...boosterCardListAcc, ...sampleSize(matchingCardList, sheetWeight)];
    }

    return boosterCardListAcc;
  }, []);

const generateJumpstartList = async (preferences: Preferences, cardList: CollectionCard[]): Promise<Booster[]> => {
  const matchingCardList = cardList.filter((card) => preferences.expansionSetNameList.includes(card.setName));
  const setCode = head(matchingCardList)?.setCode;
  if (setCode === undefined) {
    throw new Error('Only one expansion must be selected to generate jumpstarts!');
  }

  const setRespose = await fetch(`${apiUrl}/${setCode.toUpperCase()}.json`);
  if (setRespose.ok === false) {
    throw new Error('Unauthorized or invalid request!');
  }

  const setData = ((await setRespose.json()) as JsonSet).data;
  const jumpstartBooster = setData.booster.jumpstart;
  if (jumpstartBooster === undefined) {
    return [];
  }

  const jumpstartBoosterList = jumpstartBooster.boosters.reduce<Booster[]>((jumpstartBoosterListAcc, booster) => {
    const boosterSheetWeightSum = sum(Object.values(booster.contents));
    const boosterCardList = getBoosterCardList(jumpstartBooster, booster, setData.cards, cardList);
    if (boosterCardList.length === boosterSheetWeightSum) {
      return [
        ...jumpstartBoosterListAcc,
        { cardList: boosterCardList.map((setCard) => ({ cardName: setCard.name })), type: BoosterType.Jumpstart },
      ];
    }

    return jumpstartBoosterListAcc;
  }, []);

  return jumpstartBoosterList;
};

export default generateJumpstartList;
