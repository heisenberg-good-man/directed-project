import { ShipmentStatus } from '../types';

interface StatusBadgeProps {
  status: ShipmentStatus;
}

const statusStyles: Record<ShipmentStatus, string> = {
  [ShipmentStatus.PENDING]: 'bg-gray-100 text-gray-700 border-gray-300',
  [ShipmentStatus.ACCEPTED]: 'bg-blue-100 text-blue-700 border-blue-300',
  [ShipmentStatus.IN_TRANSIT]: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  [ShipmentStatus.ARRIVED]: 'bg-purple-100 text-purple-700 border-purple-300',
  [ShipmentStatus.SIGNED]: 'bg-green-100 text-green-700 border-green-300',
  [ShipmentStatus.EXCEPTION]: 'bg-red-100 text-red-700 border-red-300',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status]}`}>
      {status}
    </span>
  );
}
