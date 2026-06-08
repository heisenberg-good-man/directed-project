import { useState } from 'react';
import { Shipment, ShipmentStatus } from '../types';
import { updateShipmentStatus } from '../services/shipmentService';
import { formatDateTime } from '../utils';
import StatusBadge from './StatusBadge';

interface ShipmentDetailProps {
  shipment: Shipment;
  onBack: () => void;
  onUpdate: (updated: Shipment) => void;
  showToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export default function ShipmentDetail({ shipment, onBack, onUpdate, showToast }: ShipmentDetailProps) {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<ShipmentStatus>(shipment.status);
  const [statusRemark, setStatusRemark] = useState('');

  const availableStatuses = Object.values(ShipmentStatus);

  const handleUpdateStatus = () => {
    if (newStatus === shipment.status) {
      showToast('info', '状态未发生变化');
      setShowStatusModal(false);
      return;
    }
    const updated = updateShipmentStatus(shipment.id, newStatus, statusRemark || undefined);
    if (updated) {
      onUpdate(updated);
      showToast('success', `状态已更新为「${newStatus}」`);
      setShowStatusModal(false);
      setStatusRemark('');
    } else {
      showToast('error', '状态更新失败');
    }
  };

  const infoItem = (label: string, value: React.ReactNode) => (
    <div className="py-3 border-b border-gray-100 last:border-b-0">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-sm font-medium text-gray-800">{value}</div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800 text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回列表
        </button>
        <h2 className="text-2xl font-bold text-gray-800">运单详情</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-sm text-gray-500">运单号</div>
                <div className="text-xl font-bold text-gray-900 mt-1">{shipment.orderNo}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={shipment.status} />
                <button
                  onClick={() => {
                    setNewStatus(shipment.status);
                    setStatusRemark('');
                    setShowStatusModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  更新状态
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">基本信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              {infoItem('发货人', shipment.shipper)}
              {infoItem('收货人', shipment.consignee)}
              {infoItem('起点', shipment.origin)}
              {infoItem('终点', shipment.destination)}
              {infoItem('货物名称', shipment.goodsName)}
              {infoItem('运输方式', shipment.transportMode)}
              {infoItem('重量', `${shipment.weight} kg`)}
              {infoItem('体积', `${shipment.volume} m³`)}
              {infoItem('预计费用', `¥${shipment.estimatedCost.toLocaleString()}`)}
              {infoItem('计划发车时间', formatDateTime(shipment.plannedDepartureTime))}
              {infoItem('预计到达时间', formatDateTime(shipment.estimatedArrivalTime))}
              {infoItem('创建时间', formatDateTime(shipment.createdAt))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">状态流转记录</h3>
            <div className="relative">
              {shipment.statusHistory.map((history, index) => (
                <div key={history.id} className="flex gap-3 pb-6 last:pb-0 relative">
                  {index < shipment.statusHistory.length - 1 && (
                    <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gray-200" />
                  )}
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center z-10">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={history.status} />
                    </div>
                    {history.remark && (
                      <p className="text-sm text-gray-600 mt-1">{history.remark}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{formatDateTime(history.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">更新运单状态</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">选择新状态</label>
                <div className="grid grid-cols-2 gap-2">
                  {availableStatuses.map(status => (
                    <button
                      key={status}
                      onClick={() => setNewStatus(status)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                        newStatus === status
                          ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">备注（可选）</label>
                <textarea
                  value={statusRemark}
                  onChange={(e) => setStatusRemark(e.target.value)}
                  rows={3}
                  placeholder="请输入状态变更备注..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                确认更新
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
