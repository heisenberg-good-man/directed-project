import { useState } from 'react';
import { ShipmentFormData, TransportMode } from '../types';
import { generateOrderNo } from '../utils';

interface CreateShipmentFormProps {
  onSubmit: (data: ShipmentFormData) => void;
  onCancel: () => void;
}

interface FormErrors {
  [key: string]: string;
}

export default function CreateShipmentForm({ onSubmit, onCancel }: CreateShipmentFormProps) {
  const [formData, setFormData] = useState<ShipmentFormData>({
    orderNo: generateOrderNo(),
    shipper: '',
    consignee: '',
    origin: '',
    destination: '',
    goodsName: '',
    weight: '',
    volume: '',
    transportMode: TransportMode.TRUCK,
    estimatedCost: '',
    plannedDepartureTime: '',
    estimatedArrivalTime: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.orderNo.trim()) newErrors.orderNo = '运单号不能为空';
    if (!formData.shipper.trim()) newErrors.shipper = '发货人不能为空';
    if (!formData.consignee.trim()) newErrors.consignee = '收货人不能为空';
    if (!formData.origin.trim()) newErrors.origin = '起点不能为空';
    if (!formData.destination.trim()) newErrors.destination = '终点不能为空';
    if (!formData.goodsName.trim()) newErrors.goodsName = '货物名称不能为空';

    if (!formData.weight.trim()) {
      newErrors.weight = '重量不能为空';
    } else if (isNaN(parseFloat(formData.weight)) || parseFloat(formData.weight) <= 0) {
      newErrors.weight = '重量必须为有效正数';
    }

    if (!formData.volume.trim()) {
      newErrors.volume = '体积不能为空';
    } else if (isNaN(parseFloat(formData.volume)) || parseFloat(formData.volume) <= 0) {
      newErrors.volume = '体积必须为有效正数';
    }

    if (!formData.estimatedCost.trim()) {
      newErrors.estimatedCost = '预计费用不能为空';
    } else if (isNaN(parseFloat(formData.estimatedCost)) || parseFloat(formData.estimatedCost) < 0) {
      newErrors.estimatedCost = '预计费用必须为有效数字';
    }

    if (!formData.plannedDepartureTime) {
      newErrors.plannedDepartureTime = '计划发车时间不能为空';
    }

    if (!formData.estimatedArrivalTime) {
      newErrors.estimatedArrivalTime = '预计到达时间不能为空';
    } else if (formData.plannedDepartureTime && formData.estimatedArrivalTime <= formData.plannedDepartureTime) {
      newErrors.estimatedArrivalTime = '预计到达时间必须晚于发车时间';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof ShipmentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-300'
    }`;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">新建运单</h2>
        <p className="text-sm text-gray-500 mt-1">请填写运单信息，带 * 为必填项</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              运单号 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.orderNo}
              onChange={(e) => handleChange('orderNo', e.target.value)}
              className={inputClass('orderNo')}
              placeholder="系统自动生成，可手动修改"
            />
            {errors.orderNo && <p className="text-red-500 text-xs mt-1">{errors.orderNo}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              运输方式 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.transportMode}
              onChange={(e) => handleChange('transportMode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white"
            >
              {Object.values(TransportMode).map(mode => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              发货人 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.shipper}
              onChange={(e) => handleChange('shipper', e.target.value)}
              className={inputClass('shipper')}
              placeholder="请输入发货人姓名或公司名称"
            />
            {errors.shipper && <p className="text-red-500 text-xs mt-1">{errors.shipper}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              收货人 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.consignee}
              onChange={(e) => handleChange('consignee', e.target.value)}
              className={inputClass('consignee')}
              placeholder="请输入收货人姓名或公司名称"
            />
            {errors.consignee && <p className="text-red-500 text-xs mt-1">{errors.consignee}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              起点 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.origin}
              onChange={(e) => handleChange('origin', e.target.value)}
              className={inputClass('origin')}
              placeholder="例如：上海市浦东新区"
            />
            {errors.origin && <p className="text-red-500 text-xs mt-1">{errors.origin}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              终点 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => handleChange('destination', e.target.value)}
              className={inputClass('destination')}
              placeholder="例如：北京市朝阳区"
            />
            {errors.destination && <p className="text-red-500 text-xs mt-1">{errors.destination}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              货物名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.goodsName}
              onChange={(e) => handleChange('goodsName', e.target.value)}
              className={inputClass('goodsName')}
              placeholder="请输入货物名称"
            />
            {errors.goodsName && <p className="text-red-500 text-xs mt-1">{errors.goodsName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                重量 (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
                className={inputClass('weight')}
                placeholder="0.00"
              />
              {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                体积 (m³) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.volume}
                onChange={(e) => handleChange('volume', e.target.value)}
                className={inputClass('volume')}
                placeholder="0.00"
              />
              {errors.volume && <p className="text-red-500 text-xs mt-1">{errors.volume}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              预计费用 (元) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.estimatedCost}
              onChange={(e) => handleChange('estimatedCost', e.target.value)}
              className={inputClass('estimatedCost')}
              placeholder="0.00"
            />
            {errors.estimatedCost && <p className="text-red-500 text-xs mt-1">{errors.estimatedCost}</p>}
          </div>

          <div />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              计划发车时间 <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={formData.plannedDepartureTime}
              onChange={(e) => handleChange('plannedDepartureTime', e.target.value)}
              className={inputClass('plannedDepartureTime')}
            />
            {errors.plannedDepartureTime && <p className="text-red-500 text-xs mt-1">{errors.plannedDepartureTime}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              预计到达时间 <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={formData.estimatedArrivalTime}
              onChange={(e) => handleChange('estimatedArrivalTime', e.target.value)}
              className={inputClass('estimatedArrivalTime')}
            />
            {errors.estimatedArrivalTime && <p className="text-red-500 text-xs mt-1">{errors.estimatedArrivalTime}</p>}
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            创建运单
          </button>
        </div>
      </form>
    </div>
  );
}
