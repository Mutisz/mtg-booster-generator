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
  collection: CollectionCard[];
  boosterList: Booster[];
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
  collection: [],
  boosterList: [],
};
