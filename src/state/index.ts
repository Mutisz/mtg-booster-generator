export enum Source {
  Moxfield = 'Moxfield',
  Deckbox = 'Deckbox',
}

export type CredentialsMoxfield = {
  bearerToken: string;
};

export type Preferences = {
  boosterType: BoosterType;
  boosterCount: number;
  expansionSetNameList: string[];
  balanceColors: boolean;
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

export type CollectionCard = {
  id: string;
  quantity: number;
  setName: string;
  cardName: string;
  rarity: Rarity;
  color: ManaColor[];
  scryfallId?: string;
  multiverseIdList?: string[];
};

export type BoosterCard = {
  cardName: string;
  scryfallId?: string;
  multiverseIdList?: string[];
};

export type Booster = {
  cardList: BoosterCard[];
};

export type Defaults = {
  credentials: {
    source: Source;
    moxfield: CredentialsMoxfield;
  };
  preferences: Preferences;
  collection: CollectionCard[];
  boosterList: Booster[];
};

export const defaults: Defaults = {
  credentials: {
    source: Source.Moxfield,
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
