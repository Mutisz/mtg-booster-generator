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
  expansionSetNameList: string[];
  balanceColors: boolean;
};

export type CollectionCard = {
  quantity: number;
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
};

export type Defaults = {
  source: Source;
  preferences: Preferences;
  searchProgressBySource: { [key in SourceType]: number };
  cardListBySource: { [key in SourceType]: CollectionCard[] };
  boosterListBySource: { [key in SourceType]: Booster[] };
};

const defaultProgressBySource = {
  [SourceType.MoxfieldApi]: 0,
  [SourceType.MoxfieldFile]: 0,
  [SourceType.DeckboxFile]: 0,
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
    expansionSetNameList: [],
    balanceColors: true,
  },
  searchProgressBySource: defaultProgressBySource,
  cardListBySource: defaultListBySource,
  boosterListBySource: defaultListBySource,
};
