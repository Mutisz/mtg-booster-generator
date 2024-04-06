export enum SourceType {
  MoxfieldApi = 'MoxfieldApi',
  MoxfieldFile = 'MoxfieldFile',
  DeckboxFile = 'DeckboxFile',
}

export type SourceMoxfield = {
  bearerToken: string;
};

export type Source = {
  type: SourceType;
  moxfield: SourceMoxfield;
};

export enum BoosterType {
  Draft = 'Draft',
  Jumpstart = 'Jumpstart',
  Play = 'Play',
  Set = 'Set',
}

export enum Rarity {
  Common = 'Common',
  Uncommon = 'Uncommon',
  Rare = 'Rare',
  Mythic = 'Mythic',
  Other = 'Other',
}

export enum ManaColor {
  Black = 'Black',
  Blue = 'Blue',
  Green = 'Green',
  Red = 'Red',
  White = 'White',
}

export type Preferences = {
  boosterType: BoosterType;
  boosterCount: number;
  expansionSetCodeList: string[];
  balanceColors: boolean;
};

export type JsonBoosterId = string;
export type JsonCardUuid = string;
export type JsonCardWeight = number;

export type JsonCard = {
  uuid: JsonCardUuid;
  name: string;
};

export type JsonBoosterSheet = {
  cards: { [key: JsonCardUuid]: JsonCardWeight };
  fixed?: boolean;
};

export type JsonBooster = {
  contents: { [key: JsonBoosterId]: JsonCardWeight };
  weight: JsonCardWeight;
};

export type JsonBoosterType = {
  boosters: JsonBooster[];
  sheets: { [key: JsonBoosterId]: JsonBoosterSheet };
};

export type JsonSetData = {
  booster: { jumpstart?: JsonBoosterType };
  cards: JsonCard[];
  code: string;
  name: string;
};

export type JsonSet = {
  data: JsonSetData;
};

export type CollectionCard = {
  quantity: number;
  setCode: string;
  setName: string;
  cardName: string;
  type: string;
  rarity: Rarity;
  colorList?: ManaColor[];
  imgUrlList?: string[];
  dataUrl?: string;
};

export type BoosterCard = {
  cardName: string;
  imgUrlList?: string[];
  dataUrl?: string;
};

export type Booster = {
  cardList: BoosterCard[];
  type: BoosterType;
  name?: string;
};

export type ActionProgress = {
  action?: string;
  progress: number;
};

export type Defaults = {
  source: Source;
  preferences: Preferences;
  actionProgressBySource: { [key in SourceType]: ActionProgress };
  setListBySource: { [key in SourceType]: JsonSetData[] };
  cardListBySource: { [key in SourceType]: CollectionCard[] };
  boosterListBySource: { [key in SourceType]: Booster[] };
};

const defaultProgressBySource = {
  [SourceType.MoxfieldApi]: { progress: 0 },
  [SourceType.MoxfieldFile]: { progress: 0 },
  [SourceType.DeckboxFile]: { progress: 0 },
};

const defaultListBySource = {
  [SourceType.MoxfieldApi]: [],
  [SourceType.MoxfieldFile]: [],
  [SourceType.DeckboxFile]: [],
};

export const defaults: Defaults = {
  source: {
    type: SourceType.MoxfieldApi,
    moxfield: { bearerToken: '' },
  },
  preferences: {
    boosterType: BoosterType.Draft,
    boosterCount: 6,
    expansionSetCodeList: [],
    balanceColors: true,
  },
  actionProgressBySource: defaultProgressBySource,
  setListBySource: defaultListBySource,
  cardListBySource: defaultListBySource,
  boosterListBySource: defaultListBySource,
};
