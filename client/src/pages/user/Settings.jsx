import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from '../../utils/toast';

function Settings() {
  const { user, logout, logoutAll } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogoutAll = async () => {
    if (window.confirm('Are you sure you want to logout from all devices?')) {
      try {
        await logoutAll();
        toast.success('Logged out from all devices');
      } catch {
        toast.error('Error logging out');
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        {['profile', 'password', 'accounts', 'notifications'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-4 font-medium capitalize transition ${
              activeTab === tab
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                defaultValue={user?.name}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                defaultValue={user?.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Update Password
            </button>
          </form>
        </div>
      )}

      {/* Connected Accounts Tab */}
      {activeTab === 'accounts' && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Connected Accounts</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📱</span>
                <div>
                  <p className="font-medium text-gray-900">TikTok</p>
                  <p className="text-sm text-gray-500">Not connected</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                Connect
              </button>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📷</span>
                <div>
                  <p className="font-medium text-gray-900">Instagram</p>
                  <p className="text-sm text-gray-500">Not connected</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                Connect
              </button>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">▶️</span>
                <div>
                  <p className="font-medium text-gray-900">YouTube</p>
                  <p className="text-sm text-gray-500">Not connected</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                Connect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Settings</h2>
          <div className="space-y-4">
            {[
              { label: 'Email notifications', description: 'Receive email updates about your clips' },
              { label: 'Processing complete', description: 'Get notified when video processing is done' },
              { label: 'Scheduled posts', description: 'Reminders about upcoming scheduled posts' },
              { label: 'Marketing emails', description: 'Receive tips and product updates' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Danger Zone */}
      <div className="bg-white rounded-xl shadow p-6 mt-6 border-2 border-red-200">
        <h2 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>
        <div className="space-y-3">
          <button
            onClick={handleLogoutAll}
            className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-left"
          >
            Logout from all devices
          </button>
          <button className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-left">
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
