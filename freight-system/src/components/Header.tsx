interface HeaderProps {
  onNavigate: (view: 'list' | 'create') => void;
  currentView: 'list' | 'create';
}

export default function Header({ onNavigate, currentView }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">货运管理系统</h1>
          </div>
          <nav className="flex gap-2">
            <button
              onClick={() => onNavigate('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              运单列表
            </button>
            <button
              onClick={() => onNavigate('create')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'create'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              新建运单
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
