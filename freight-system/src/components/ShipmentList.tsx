import { useState, useEffect, useMemo } from 'react';
import { Shipment, ShipmentStatus } from '../types';
import { filterShipments } from '../services/shipmentService';
import { formatDateTime } from '../utils';
import StatusBadge from './StatusBadge';

interface FilterOptions {
  orderNo: string;
  origin: string;
  destination: string;
  status: ShipmentStatus | '';
}

interface ShipmentListProps {
  shipments: Shipment[];
  onRefresh: () => void;
  onViewDetail: (shipment: Shipment) => void;
  onCreateNew: () => void;
}

export default function ShipmentList({ shipments, onRefresh, onViewDetail, onCreateNew }: ShipmentListProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    orderNo: '',
    origin: '',
    destination: '',
    status: '',
  });

  const filteredShipments = useMemo(() => {
    return filterShipments(filters);
  }, [filters, shipments]);

  useEffect(() => {
    onRefresh();
  }, []);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      orderNo: '',
      origin: '',
      destination: '',
      status: '',
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">运单列表</h2>
        <button
          onClick={onCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新建运单
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">运单号</label>
            <input
              type="text"
              value={filters.orderNo}
              onChange={(e) => handleFilterChange('orderNo', e.target.value)}
              placeholder="输入运单号搜索"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">起点</label>
            <input
              type="text"
              value={filters.origin}
              onChange={(e) => handleFilterChange('origin', e.target.value)}
              placeholder="输入起点"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">终点</label>
            <input
              type="text"
              value={filters.destination}
              onChange={(e) => handleFilterChange('destination', e.target.value)}
              placeholder="输入终点"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white"
            >
              <option value="">全部状态</option>
              {Object.values(ShipmentStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            重置筛选
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">运单号</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">发货人</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">收货人</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">路线</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">货物</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">预计费用</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">状态</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">创建时间</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p>暂无运单数据</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredShipments.map(shipment => (
                  <tr key={shipment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{shipment.orderNo}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{shipment.shipper}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{shipment.consignee}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div className="flex items-center gap-1">
                        <span>{shipment.origin}</span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <span>{shipment.destination}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{shipment.goodsName}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 font-medium">¥{shipment.estimatedCost.toLocaleString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={shipment.status} /></td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDateTime(shipment.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onViewDetail(shipment)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        查看详情
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        共 {filteredShipments.length} 条记录
      </div>
    </div>
  );
}
