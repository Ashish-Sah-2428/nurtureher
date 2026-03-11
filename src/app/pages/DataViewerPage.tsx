import { useState, useEffect } from 'react';
import { localDB } from '../utils/localDatabase';
import { Download, Upload, Trash2, RefreshCw, Database, Users, FileText, Heart, BookOpen, MessageSquare } from 'lucide-react';

export default function DataViewerPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'assessments' | 'moods' | 'journals' | 'posts' | 'stats'>('stats');
  const [data, setData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = () => {
    switch (activeTab) {
      case 'users':
        setData(localDB.getAllUsers());
        break;
      case 'assessments':
        setData(localDB.getAllAssessments());
        break;
      case 'moods':
        setData(localDB.getUserMoods('all')); // Would need to modify for all users
        break;
      case 'journals':
        setData(localDB.getUserJournals('all')); // Would need to modify for all users
        break;
      case 'posts':
        setData(localDB.getAllPosts());
        break;
      case 'stats':
        setData(localDB.getStats());
        break;
    }
  };

  const handleExport = () => {
    const jsonData = localDB.exportData();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nurtureher-data-${new Date().toISOString()}.json`;
    a.click();
    alert('✅ Data exported successfully!');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        try {
          localDB.importData(event.target.result);
          alert('✅ Data imported successfully!');
          loadData();
        } catch (error) {
          alert('❌ Import failed: ' + error);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleClearAll = () => {
    if (confirm('⚠️ Are you sure? This will delete ALL data permanently!')) {
      if (confirm('🚨 FINAL WARNING: This cannot be undone!')) {
        localDB.clearAllData();
        alert('✅ All data cleared');
        loadData();
      }
    }
  };

  const filteredData = data && Array.isArray(data) 
    ? data.filter((item: any) => 
        JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
      )
    : data;

  const tabs = [
    { id: 'stats', label: 'Statistics', icon: Database },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'assessments', label: 'Assessments', icon: FileText },
    { id: 'moods', label: 'Moods', icon: Heart },
    { id: 'journals', label: 'Journals', icon: BookOpen },
    { id: 'posts', label: 'Posts', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-[#fdf0ec] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-purple-900">🗄️ Data Viewer & Admin Panel</h1>
              <p className="text-gray-600 mt-1">All your data stored locally - No Supabase needed!</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={loadData}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Import
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </div>

          {/* Search */}
          {activeTab !== 'stats' && (
            <input
              type="text"
              placeholder="Search data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activeTab === id
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeTab === 'stats' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data && Object.entries(data).map(([key, value]) => (
                <div key={key} className="bg-gradient-to-br from-purple-100 to-[#fce8e0] rounded-lg p-4">
                  <div className="text-sm text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-2xl font-bold text-purple-900 mt-1">
                    {key === 'dataSize' ? `${(value as number / 1024).toFixed(2)} KB` : String(value)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <pre className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-[600px] text-sm">
                {JSON.stringify(filteredData, null, 2)}
              </pre>
              {Array.isArray(filteredData) && (
                <div className="mt-4 text-center text-gray-600">
                  Showing {filteredData.length} record(s)
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}