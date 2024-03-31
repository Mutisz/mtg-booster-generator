import { CollectionCard } from '../state';

const basicLandRegex = /Basic.+Land/;

export const removeBasicLand = (collection: CollectionCard[]): CollectionCard[] =>
  collection.filter((card) => card.type.match(basicLandRegex) === null);
