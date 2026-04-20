import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiActivity, FiDatabase, FiSettings } from 'react-icons/fi';
import API from '../api';
import { useTheme } from '../context/ThemeContext';

const Admin = () => {
  const { isDark } = useTheme();
  const [stats, setStats] = useState({ users: 0, tests: 0, careers: 35 });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const { data } = await API.get('/admin/stats');
        setStats(data.stats);
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        // Fallback to empty state if API fails
        setStats({ users: 0, tests: 0, careers: 22 });
        setUsers([]);
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className={`min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black uppercase tracking-widest mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-emerald-500">
            Admin Control Panel
          </h1>
          <p className={`text-lg font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            System overview and user management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className={`p-6 rounded-2xl border backdrop-blur-md ${isDark ? 'bg-slate-900/50 border-blue-500/20' : 'bg-white border-blue-200 shadow-sm'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Total Users</p>
                <h3 className="text-4xl font-black mt-2">{stats.users}</h3>
              </div>
              <div className="p-4 bg-blue-500/10 rounded-xl text-blue-500 text-2xl">
                <FiUsers />
              </div>
            </div>
          </div>
          
          <div className={`p-6 rounded-2xl border backdrop-blur-md ${isDark ? 'bg-slate-900/50 border-purple-500/20' : 'bg-white border-purple-200 shadow-sm'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Tests Completed</p>
                <h3 className="text-4xl font-black mt-2">{stats.tests}</h3>
              </div>
              <div className="p-4 bg-purple-500/10 rounded-xl text-purple-500 text-2xl">
                <FiActivity />
              </div>
            </div>
          </div>
          
          <div className={`p-6 rounded-2xl border backdrop-blur-md ${isDark ? 'bg-slate-900/50 border-emerald-500/20' : 'bg-white border-emerald-200 shadow-sm'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Careers Indexed</p>
                <h3 className="text-4xl font-black mt-2">{stats.careers}</h3>
              </div>
              <div className="p-4 bg-emerald-500/10 rounded-xl text-emerald-500 text-2xl">
                <FiDatabase />
              </div>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl border backdrop-blur-md overflow-hidden ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className={`p-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'} flex justify-between items-center`}>
            <h3 className="text-xl font-bold uppercase tracking-widest">Recent Users</h3>
            <button className="flex items-center gap-2 text-sm font-bold text-blue-500 hover:text-blue-400">
              <FiSettings /> Manage
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={isDark ? 'bg-slate-900/80 text-slate-400' : 'bg-slate-50 text-slate-600'}>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest">Name</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest">Email</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest">Tests Taken</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="font-mono text-sm">
                {users.map(u => (
                  <tr key={u._id} className={`border-b last:border-0 ${isDark ? 'border-slate-800/50 hover:bg-slate-800/30' : 'border-slate-100 hover:bg-slate-50'}`}>
                    <td className="p-4 font-bold">{u.name}</td>
                    <td className="p-4 text-slate-500">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                        {u.testsTaken} Completed
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-red-500 hover:text-red-400 font-bold uppercase text-xs tracking-wider">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
