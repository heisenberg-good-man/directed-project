import { useState, useCallback, useEffect } from 'react';
import { Shipment, ShipmentFormData } from './types';
import { getAllShipments, createShipment, seedSampleData } from './services/shipmentService';
import Header from './components/Header';
import ShipmentList from './components/ShipmentList';
import CreateShipmentForm from './components/CreateShipmentForm';
import ShipmentDetail from './components/ShipmentDetail';
import Toast, { ToastMessage, ToastType } from './components/Toast';
import { generateId } from './utils';

type View = 'list' | 'create' | 'detail';

function App() {
  const [view, setView] = useState<View>('list');
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    seedSampleData();
    refreshShipments();
  }, []);

  const refreshShipments = useCallback(() => {
    setShipments(getAllShipments());
  }, []);

  const showToast = useCallback((type: ToastType, message: string) => {
    const toast: ToastMessage = { id: generateId(), type, message };
    setToasts(prev => [...prev, toast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleCreateShipment = (data: ShipmentFormData) => {
    try {
      const newShipment = createShipment(data);
      refreshShipments();
      showToast('success', `运单「${newShipment.orderNo}」创建成功`);
      setView('list');
    } catch {
      showToast('error', '运单创建失败，请重试');
    }
  };

  const handleViewDetail = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setView('detail');
  };

  const handleUpdateShipment = (updated: Shipment) => {
    setSelectedShipment(updated);
    refreshShipments();
  };

  const handleNavigate = (target: 'list' | 'create') => {
    setView(target);
    setSelectedShipment(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onNavigate={handleNavigate}
        currentView={view === 'detail' ? 'list' : view}
      />
      <main className="max-w-7xl mx-auto">
        {view === 'list' && (
          <ShipmentList
            shipments={shipments}
            onRefresh={refreshShipments}
            onViewDetail={handleViewDetail}
            onCreateNew={() => handleNavigate('create')}
          />
        )}
        {view === 'create' && (
          <CreateShipmentForm
            onSubmit={handleCreateShipment}
            onCancel={() => handleNavigate('list')}
          />
        )}
        {view === 'detail' && selectedShipment && (
          <ShipmentDetail
            shipment={selectedShipment}
            onBack={() => handleNavigate('list')}
            onUpdate={handleUpdateShipment}
            showToast={showToast}
          />
        )}
      </main>
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;
