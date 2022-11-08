import { ThunkDispatch } from "redux-thunk";
export interface IArtLayer {
  id: string;
  name: string;
}

export interface IArtLayerItem {
  id: string;
  layerId: string;
  rarity: number;
  preview: string;
  file: File;
}

export interface IArtLayerWithItems {
  id: string;
  name: string;
  items: IArtLayerItem[];
}

export interface IProjectState {
  layers: IArtLayer[];
  layerItems: IArtLayerItem[];
  layerAndItems: IArtLayerWithItems[];
  previewPageSize: number;
  previewCurrentPage: number;
  collectionName: string;
  description: string;
  width: number;
  height: number;
  rarityStatus: boolean;
  totalSupply: number;
  randomPlay: boolean;
}

export type AppDispatch = ThunkDispatch<{}, {}, any>;
