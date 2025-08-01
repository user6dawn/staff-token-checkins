import React, { useState, useEffect, useRef } from 'react';
import { supabase, type CheckIn, type Staff } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { format, startOfDay, endOfDay, parseISO } from 'date-fns';
import { Calendar, Users, Clock, UserCheck, Database, Plus, Search, Filter, Moon, LogOut, Building2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoadingCheckIns, setIsLoadingCheckIns] = useState(true);
  const [isLoadingStaff, setIsLoadingStaff] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'staff' | 'checkins'>('staff');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    lab: '',
    status: '',
    tag: ''
  });
  const filterRef = useRef<HTMLDivElement>(null);

  const fetchCheckIns = async (date: string) => {
    setIsLoadingCheckIns(true);
    try {
      const startDate = startOfDay(new Date(date));
      const endDate = endOfDay(new Date(date));

      // First, let's try to get all data from the table to see if it exists
      const { data: allData, error: allDataError } = await supabase
        .from('food_collections')
        .select('*')
        .limit(10);

      console.log('All data from food_collections:', allData);
      if (allDataError) {
        console.error('Error fetching all data:', allDataError);
      }

      // Now fetch the check-ins data for the specific date
      const { data: checkInsData, error: checkInsError } = await supabase
        .from('food_collections')
        .select('*')
        .gte('time_collected', startDate.toISOString())
        .lte('time_collected', endDate.toISOString())
        .order('time_collected', { ascending: false });

      if (checkInsError) {
        throw checkInsError;
      }

      console.log('Raw check-ins data:', checkInsData);
      console.log('Date being searched:', date);
      console.log('Start date (ISO):', startDate.toISOString());
      console.log('End date (ISO):', endDate.toISOString());
      console.log('Start date (local):', startDate.toString());
      console.log('End date (local):', endDate.toString());

      // If we have check-ins, fetch the corresponding staff data
      if (checkInsData && checkInsData.length > 0) {
        const staffIds = checkInsData.map(ci => ci.staffid);
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('*')
          .in('staffid', staffIds);

        if (staffError) {
          console.error('Error fetching staff data:', staffError);
        } else {
          console.log('Staff data:', staffData);
          
          // Combine the data
          const combinedData = checkInsData.map(checkIn => {
            const staffMember = staffData?.find(staff => staff.staffid === checkIn.staffid);
            return {
              ...checkIn,
              staff: staffMember ? [staffMember] : []
            };
          });
          
          console.log('Combined data:', combinedData);
          setCheckIns(combinedData);
          return;
        }
      }

      setCheckIns(checkInsData || []);
    } catch (err) {
      console.error('Error fetching check-ins:', err);
    } finally {
      setIsLoadingCheckIns(false);
    }
  };

  const fetchStaff = async () => {
    setIsLoadingStaff(true);
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('staffname', { ascending: true });

      if (error) {
        throw error;
      }

      setStaff(data || []);
    } catch (err) {
      console.error('Error fetching staff:', err);
    } finally {
      setIsLoadingStaff(false);
    }
  };

  useEffect(() => {
    fetchCheckIns(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    fetchStaff();
  }, []);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Set up real-time subscription for check-ins
    const subscription = supabase
      .channel('checkins')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'food_collections'
        },
        () => {
          fetchCheckIns(selectedDate);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedDate]);

  const totalStaff = staff.length;
  const checkedInToday = checkIns.length;
  const checkedInStaffIds = new Set(checkIns.map(ci => ci.staffid));
  const notCheckedIn = totalStaff - checkedInStaffIds.size;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Filter staff based on search term and filters
  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.staffname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.tag.toString().includes(searchTerm);
    
    const matchesLab = !filters.lab || member.lab.toLowerCase().includes(filters.lab.toLowerCase());
    const matchesTag = !filters.tag || member.tag.toString().includes(filters.tag);
    
    // For status filter, check if staff has checked in today
    const hasCheckedIn = checkedInStaffIds.has(member.staffid);
    const matchesStatus = !filters.status || 
      (filters.status === 'checked-in' && hasCheckedIn) ||
      (filters.status === 'not-checked-in' && !hasCheckedIn);
    
    return matchesSearch && matchesLab && matchesTag && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="bg-dark-900 border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src="/Innov8 Logo-01.png" 
                  alt="Innov8 Logo" 
                  className="w-fill h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Staff Food Token Managment</h1>
                <p className="text-primary-400 text-lg">Manage staff members and their check-ins for food tokens</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Staff</p>
                <p className="text-2xl font-bold text-primary-400">{totalStaff}</p>
              </div>
              <Users className="text-primary-500" size={24} />
            </div>
          </div>
          
          <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Tokens Collected Today</p>
                <p className="text-2xl font-bold text-primary-400">{checkedInToday}</p>
              </div>
              <UserCheck className="text-primary-500" size={24} />
            </div>
          </div>
          
          <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Not Collected</p>
                <p className="text-2xl font-bold text-orange-400">{notCheckedIn}</p>
              </div>
              <Clock className="text-orange-500" size={24} />
            </div>
          </div>
        </div>
        {/* Search and Controls */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-dark-800 rounded-lg p-1 border border-dark-700">
                <button
                  onClick={() => setActiveTab('staff')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'staff'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  All Staff ({totalStaff})
                </button>
                <button
                  onClick={() => setActiveTab('checkins')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'checkins'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Today's Check-ins ({checkedInToday})
                </button>
              </div>
              <div className="relative" ref={filterRef}>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-3 bg-dark-800 border border-dark-700 text-gray-300 rounded-lg hover:bg-dark-700 transition-colors"
                >
                  <Filter size={18} />
                  <span>Filters</span>
                </button>
                
                {showFilters && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-dark-900 border border-dark-700 rounded-lg shadow-lg z-50">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-medium">Filter Options</h3>
                        <button 
                          onClick={() => setFilters({ lab: '', status: '', tag: '' })}
                          className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                        >
                          Clear All
                        </button>
                      </div>
                      
                      {/* Lab Filter */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Lab</label>
                        <input
                          type="text"
                          placeholder="Filter by lab..."
                          value={filters.lab}
                          onChange={(e) => setFilters({ ...filters, lab: e.target.value })}
                          className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm"
                        />
                      </div>
                      
                      {/* Tag Filter */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Tag</label>
                        <input
                          type="text"
                          placeholder="Filter by tag..."
                          value={filters.tag}
                          onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
                          className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm"
                        />
                      </div>
                      
                      {/* Status Filter */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                        <select
                          value={filters.status}
                          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                          className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-md text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm"
                        >
                          <option value="">All Status</option>
                          <option value="checked-in">Checked In</option>
                          <option value="not-checked-in">Not Checked In</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Link
                to="/form"
                className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                <Plus size={18} />
                <span>Add Staff</span>
              </Link>
            </div>
          </div>
        </div>

      
        
        {/* Tables */}
        <div className="bg-dark-900 rounded-lg border border-dark-800 overflow-hidden">
          {/* Staff Table */}
          {activeTab === 'staff' && (
            <>
              {/* Staff Table Header */}
              <div className="bg-dark-800 px-6 py-4 border-b border-dark-700">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-300 uppercase tracking-wide">
                  
                  <div className="col-span-3">Name</div>
                  <div className="col-span-2">Tag</div>
                  <div className="col-span-3">Email</div>
                  <div className="col-span-2">Lab</div>
                  <div className="col-span-1">Status</div>
                </div>
              </div>

              {/* Staff Table Body */}
              <div className="divide-y divide-dark-800">
                {isLoadingStaff ? (
                  <div className="p-12 text-center">
                    <div className="inline-flex items-center space-x-2 text-gray-400">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                      <span>Loading staff...</span>
                    </div>
                  </div>
                ) : filteredStaff.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="bg-dark-800 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                      <Users size={32} className="text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No Staff Members Found</h3>
                    <p className="text-gray-400">
                      {searchTerm ? 'No staff members match your search criteria' : 'No staff members found in the system'}
                    </p>
                  </div>
                ) : (
                  filteredStaff.map((member) => {
                    const hasCheckedIn = checkedInStaffIds.has(member.staffid);
                    return (
                      <div key={member.staffid} className="px-6 py-4 hover:bg-dark-800 transition-colors">
                        <div className="grid grid-cols-12 gap-4 items-center">
                          {/* Profile Avatar */}
                          {/*} <div className="col-span-1">
                            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {member.staffname.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                          </div> */}
                          
                          {/* Name */}
                          <div className="col-span-3">
                            <div className="text-white font-medium">{member.staffname}</div>
                          </div>
                          
                          {/* Tag */}
                          <div className="col-span-2">
                            <span className="text-gray-300 font-mono text-sm">
                              {member.tag}
                            </span>
                          </div>
                          
                          {/* Email */}
                          <div className="col-span-3">
                            <span className="text-gray-400 text-sm">{member.email}</span>
                          </div>
                          
                          {/* Lab */}
                          <div className="col-span-2">
                            <span className="text-gray-400 text-sm">{member.lab}</span>
                          </div>
                          
                          {/* Status */}
                          <div className="col-span-1">
                            {hasCheckedIn ? (
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary-900 text-primary-300 rounded-full border border-primary-700">
                                Checked In
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-800 text-gray-400 rounded-full border border-gray-700">
                                Not Checked In
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

          {/* Check-ins Table */}
          {activeTab === 'checkins' && (
            <>
              {/* Check-ins Table Header */}
              <div className="bg-dark-800 px-6 py-4 border-b border-dark-700 flex items-center justify-between">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-300 uppercase tracking-wide flex-1">
                  
                  <div className="col-span-3 text-left">Name</div>
                  <div className="col-span-1 text-left">Tag</div>
                  <div className="col-span-2 text-left">Check-in Time</div>
                  <div className="col-span-2 text-left">Date</div>
                  <div className="col-span-2 text-left">Status</div>
                <div className="flex items-center space-x-2 ml-4">
                  <Calendar size={16} className="text-gray-400" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-dark-700 border border-dark-600 text-white text-sm rounded px-3 py-1 focus:outline-none focus:border-primary-500"
                  />
                </div>
                </div>

              </div>

              {/* Check-ins Table Body */}
              <div className="divide-y divide-dark-800">
                {isLoadingCheckIns ? (
                  <div className="p-12 text-center">
                    <div className="inline-flex items-center space-x-2 text-gray-400">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                      <span>Loading check-ins...</span>
                    </div>
                  </div>
                ) : checkIns.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="bg-dark-800 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                      <UserCheck size={32} className="text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No Check-ins Found</h3>
                    <p className="text-gray-400">
                      No staff members have checked in on {format(new Date(selectedDate), 'MMMM d, yyyy')}
                    </p>
                  </div>
                ) : (
                  checkIns.map((checkIn) => (
                    <div key={checkIn.id} className="px-6 py-4 hover:bg-dark-800 transition-colors">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/*  {/* Profile Avatar 
                        <div className="col-span-1">
                          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {checkIn.staff?.staffname.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                        </div> */}
                        
                        {/* Name */}
                        <div className="col-span-3 text-left">
                          <div className="text-white font-medium">{checkIn.staff?.[0]?.staffname}</div>
                        </div>
                        
                        {/* Tag */}
                        <div className="col-span-1 text-left">
                          <span className="text-gray-300 font-mono text-sm">
                            {checkIn.staff?.[0]?.tag}
                          </span>
                        </div>
                        
                        {/* Check-in Time */}
                        <div className="col-span-2 text-left">
                          <span className="text-primary-400 font-mono text-sm">
                            {format(parseISO(checkIn.time_collected), 'h:mm:ss a')}
                          </span>
                        </div>
                        
                        {/* Date */}
                        <div className="col-span-2 text-left">
                          <span className="text-gray-400 text-sm">
                            {format(parseISO(checkIn.time_collected), 'MMM d, yyyy')}
                          </span>
                        </div>
                        
                        {/* Status */}
                        <div className="col-span-1 text-left">
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary-900 text-primary-300 rounded-full border border-primary-700">
                            Collected
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}