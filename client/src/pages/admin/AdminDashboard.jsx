function AdminDashboard() {
  const metrics = [
    { label: 'Total Users', value: '0', icon: '👥', color: 'blue' },
    { label: 'Active Users', value: '0', icon: '✅', color: 'green' },
    { label: 'Videos Processed', value: '0', icon: '🎬', color: 'purple' },
    { label: 'Total Revenue', value: '$0', icon: '💰', color: 'yellow' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
              </div>
              <div className="text-4xl">{metric.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">User Growth</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart will be displayed here
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Overview</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart will be displayed here
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
