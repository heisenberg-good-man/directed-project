export enum ShipmentStatus {
  PENDING = '待接单',
  ACCEPTED = '已接单',
  IN_TRANSIT = '运输中',
  ARRIVED = '已到达',
  SIGNED = '已签收',
  EXCEPTION = '异常',
}

export enum TransportMode {
  TRUCK = '公路运输',
  RAIL = '铁路运输',
  AIR = '航空运输',
  SEA = '海运',
}

export interface StatusHistory {
  id: string;
  status: ShipmentStatus;
  timestamp: string;
  remark?: string;
}

export interface Shipment {
  id: string;
  orderNo: string;
  shipper: string;
  consignee: string;
  origin: string;
  destination: string;
  goodsName: string;
  weight: number;
  volume: number;
  transportMode: TransportMode;
  estimatedCost: number;
  plannedDepartureTime: string;
  estimatedArrivalTime: string;
  status: ShipmentStatus;
  statusHistory: StatusHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentFormData {
  orderNo: string;
  shipper: string;
  consignee: string;
  origin: string;
  destination: string;
  goodsName: string;
  weight: string;
  volume: string;
  transportMode: TransportMode;
  estimatedCost: string;
  plannedDepartureTime: string;
  estimatedArrivalTime: string;
}
