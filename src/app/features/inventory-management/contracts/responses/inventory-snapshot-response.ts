import {
  ApiResponse,
  BaseResponse,
} from '@contracts/interfaces/responses/base-response';

// InventorySnapshotResponse için ApiResponse kullanıyoruz
export type InventorySnapshotResponse =
  ApiResponse<InventorySnapshotResponseData>;

// inventorySnapshot listesi için data interface
export interface InventorySnapshotResponseData {
  totalCount: number;
  inventorySnapshot: ResultInventorySnapshot[];
}

// InventorySnapshotResult BaseResponse'tan extend ediyor
export interface ResultInventorySnapshot extends BaseResponse {
  productId: string;
  quantityAvailable: number;
  quantityReserved: number;
  quantitySold: number;
  totalQuantity: number;
  inventoryType: number;
  orderId: null;
  snapshotDate: Date;
  unitCost: number;
  totalValue: number;
  location: string;
  notes: string;
  rowActiveAndNotDeleted: boolean;
  rowIsNotDeleted: boolean;
}
