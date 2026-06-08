import { Shipment, ShipmentStatus, StatusHistory, ShipmentFormData } from '../types';
import { generateId, generateOrderNo } from '../utils';

interface FilterOptions {
  orderNo: string;
  origin: string;
  destination: string;
  status: ShipmentStatus | '';
}

const STORAGE_KEY = 'freight_shipments';

function getShipmentsFromStorage(): Shipment[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveShipmentsToStorage(shipments: Shipment[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(shipments));
}

export function getAllShipments(): Shipment[] {
  return getShipmentsFromStorage();
}

export function getShipmentById(id: string): Shipment | undefined {
  const shipments = getShipmentsFromStorage();
  return shipments.find(s => s.id === id);
}

export function createShipment(formData: ShipmentFormData): Shipment {
  const shipments = getShipmentsFromStorage();
  const now = new Date().toISOString();

  const initialStatus = ShipmentStatus.PENDING;
  const historyItem: StatusHistory = {
    id: generateId(),
    status: initialStatus,
    timestamp: now,
    remark: '运单已创建',
  };

  const newShipment: Shipment = {
    id: generateId(),
    orderNo: formData.orderNo || generateOrderNo(),
    shipper: formData.shipper,
    consignee: formData.consignee,
    origin: formData.origin,
    destination: formData.destination,
    goodsName: formData.goodsName,
    weight: parseFloat(formData.weight),
    volume: parseFloat(formData.volume),
    transportMode: formData.transportMode,
    estimatedCost: parseFloat(formData.estimatedCost),
    plannedDepartureTime: formData.plannedDepartureTime,
    estimatedArrivalTime: formData.estimatedArrivalTime,
    status: initialStatus,
    statusHistory: [historyItem],
    createdAt: now,
    updatedAt: now,
  };

  shipments.unshift(newShipment);
  saveShipmentsToStorage(shipments);
  return newShipment;
}

export function updateShipmentStatus(
  id: string,
  newStatus: ShipmentStatus,
  remark?: string
): Shipment | undefined {
  const shipments = getShipmentsFromStorage();
  const index = shipments.findIndex(s => s.id === id);

  if (index === -1) return undefined;

  const now = new Date().toISOString();
  const historyItem: StatusHistory = {
    id: generateId(),
    status: newStatus,
    timestamp: now,
    remark: remark || `状态更新为：${newStatus}`,
  };

  shipments[index].status = newStatus;
  shipments[index].statusHistory.push(historyItem);
  shipments[index].updatedAt = now;

  saveShipmentsToStorage(shipments);
  return shipments[index];
}

export function filterShipments(filters: FilterOptions): Shipment[] {
  const shipments = getShipmentsFromStorage();
  return shipments.filter(shipment => {
    if (filters.orderNo && !shipment.orderNo.toLowerCase().includes(filters.orderNo.toLowerCase())) {
      return false;
    }
    if (filters.origin && !shipment.origin.includes(filters.origin)) {
      return false;
    }
    if (filters.destination && !shipment.destination.includes(filters.destination)) {
      return false;
    }
    if (filters.status && shipment.status !== filters.status) {
      return false;
    }
    return true;
  });
}

export function seedSampleData(): void {
  const existing = getShipmentsFromStorage();
  if (existing.length > 0) return;

  const samples: Shipment[] = [
    {
      id: generateId(),
      orderNo: 'FY202606010001',
      shipper: '上海电子科技有限公司',
      consignee: '北京贸易有限公司',
      origin: '上海市浦东新区',
      destination: '北京市朝阳区',
      goodsName: '电子元器件',
      weight: 500,
      volume: 2.5,
      transportMode: '公路运输' as any,
      estimatedCost: 2800,
      plannedDepartureTime: '2026-06-10T08:00',
      estimatedArrivalTime: '2026-06-12T18:00',
      status: ShipmentStatus.IN_TRANSIT,
      statusHistory: [
        { id: generateId(), status: ShipmentStatus.PENDING, timestamp: '2026-06-01T10:00:00Z', remark: '运单已创建' },
        { id: generateId(), status: ShipmentStatus.ACCEPTED, timestamp: '2026-06-01T14:30:00Z', remark: '司机已接单' },
        { id: generateId(), status: ShipmentStatus.IN_TRANSIT, timestamp: '2026-06-02T08:00:00Z', remark: '货物已发车' },
      ],
      createdAt: '2026-06-01T10:00:00Z',
      updatedAt: '2026-06-02T08:00:00Z',
    },
    {
      id: generateId(),
      orderNo: 'FY202606030002',
      shipper: '广州服装批发公司',
      consignee: '成都零售商城',
      origin: '广州市白云区',
      destination: '成都市武侯区',
      goodsName: '冬季服装',
      weight: 1200,
      volume: 8.0,
      transportMode: '铁路运输' as any,
      estimatedCost: 5600,
      plannedDepartureTime: '2026-06-15T10:00',
      estimatedArrivalTime: '2026-06-18T16:00',
      status: ShipmentStatus.PENDING,
      statusHistory: [
        { id: generateId(), status: ShipmentStatus.PENDING, timestamp: '2026-06-03T09:00:00Z', remark: '运单已创建' },
      ],
      createdAt: '2026-06-03T09:00:00Z',
      updatedAt: '2026-06-03T09:00:00Z',
    },
    {
      id: generateId(),
      orderNo: 'FY202606050003',
      shipper: '深圳医疗器械股份有限公司',
      consignee: '杭州第一人民医院',
      origin: '深圳市南山区',
      destination: '杭州市西湖区',
      goodsName: '医疗设备',
      weight: 300,
      volume: 1.2,
      transportMode: '航空运输' as any,
      estimatedCost: 8500,
      plannedDepartureTime: '2026-06-08T06:00',
      estimatedArrivalTime: '2026-06-08T12:00',
      status: ShipmentStatus.ARRIVED,
      statusHistory: [
        { id: generateId(), status: ShipmentStatus.PENDING, timestamp: '2026-06-05T15:00:00Z', remark: '运单已创建' },
        { id: generateId(), status: ShipmentStatus.ACCEPTED, timestamp: '2026-06-05T16:00:00Z', remark: '承运商已确认' },
        { id: generateId(), status: ShipmentStatus.IN_TRANSIT, timestamp: '2026-06-08T06:30:00Z', remark: '货物已起飞' },
        { id: generateId(), status: ShipmentStatus.ARRIVED, timestamp: '2026-06-08T11:45:00Z', remark: '货物已到达目的地' },
      ],
      createdAt: '2026-06-05T15:00:00Z',
      updatedAt: '2026-06-08T11:45:00Z',
    },
    {
      id: generateId(),
      orderNo: 'FY202606060004',
      shipper: '青岛海产品加工厂',
      consignee: '上海餐饮集团',
      origin: '青岛市市北区',
      destination: '上海市黄浦区',
      goodsName: '冷冻海鲜',
      weight: 800,
      volume: 3.5,
      transportMode: '公路运输' as any,
      estimatedCost: 3200,
      plannedDepartureTime: '2026-06-09T04:00',
      estimatedArrivalTime: '2026-06-10T20:00',
      status: ShipmentStatus.EXCEPTION,
      statusHistory: [
        { id: generateId(), status: ShipmentStatus.PENDING, timestamp: '2026-06-06T10:00:00Z', remark: '运单已创建' },
        { id: generateId(), status: ShipmentStatus.ACCEPTED, timestamp: '2026-06-06T11:00:00Z', remark: '司机已接单' },
        { id: generateId(), status: ShipmentStatus.IN_TRANSIT, timestamp: '2026-06-09T04:30:00Z', remark: '货物已发车' },
        { id: generateId(), status: ShipmentStatus.EXCEPTION, timestamp: '2026-06-09T12:00:00Z', remark: '途中车辆故障，正在处理' },
      ],
      createdAt: '2026-06-06T10:00:00Z',
      updatedAt: '2026-06-09T12:00:00Z',
    },
  ];

  saveShipmentsToStorage(samples);
}
