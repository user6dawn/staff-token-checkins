import React, { useState, useEffect } from 'react';
import { supabase, type CheckIn } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';

export function UserProfile() {
  const { currentUser } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateCheckIns, setSelectedDateCheckIns] = useState<CheckIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchCheckIns = async () => {
      setIsLoading(true);
      try {
        const startDate = startOfMonth(currentMonth);
        const endDate = endOfMonth(currentMonth);

        const { data, error } = await supabase
          .from('cafeRegister')
          .select('*')
          .eq('staffid', currentUser.staffid)
          .gte('timeCollected', startDate.toISOString())
          .lte('timeCollected', endDate.toISOString())
          .order('timeCollected', { ascending: false });

        if (error) {
          throw error;
        }

        setCheckIns(data || []);
      } catch (err) {
        console.error('Error fetching check-ins:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCheckIns();
  }, [currentUser, currentMonth]);

  const handleDateClick = (date: Date) => {
    const dayCheckIns = checkIns.filter(checkIn => 
      isSameDay(parseISO(checkIn.timeCollected), date)
    );
    
    if (dayCheckIns.length > 0) {
      setSelectedDate(date);
      setSelectedDateCheckIns(dayCheckIns);
    }
  };

  const hasCheckIn = (date: Date) => {
    return checkIns.some(checkIn => 
      isSameDay(parseISO(checkIn.timeCollected), date)
    );
  };

  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const previousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
    setSelectedDate(null);
  };

  const nextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
    setSelectedDate(null);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-light text-gray-900 mb-2">Your Profile</h1>
        <p className="text-gray-600">{currentUser.staffName} ({currentUser.tag})</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
              <Calendar size={20} />
              <span>Check-in Calendar</span>
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                ←
              </button>
              <span className="font-medium min-w-[120px] text-center">
                {format(currentMonth, 'MMMM yyyy')}
              </span>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                →
              </button>
            </div>
          </div>

          <div className="border border-gray-200">
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-700">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {monthDays.map(date => (
                <button
                  key={date.toISOString()}
                  onClick={() => handleDateClick(date)}
                  className={`
                    p-2 text-sm border-r border-b border-gray-200 h-12 
                    ${hasCheckIn(date) 
                      ? 'bg-gray-900 text-white hover:bg-gray-800' 
                      : 'hover:bg-gray-50'
                    }
                    ${selectedDate && isSameDay(date, selectedDate) 
                      ? 'ring-2 ring-gray-900 ring-inset' 
                      : ''
                    }
                    transition-colors
                  `}
                  disabled={!hasCheckIn(date)}
                >
                  {format(date, 'd')}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-900"></div>
                <span>Checked in</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border border-gray-300"></div>
                <span>No check-in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Date Details */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
            <Clock size={20} />
            <span>Check-in Times</span>
          </h2>

          {selectedDate ? (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">
                {format(selectedDate, 'MMMM d, yyyy')}
              </h3>
              <div className="space-y-2">
                {selectedDateCheckIns.map(checkIn => (
                  <div key={checkIn.registerID} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
                    <span className="text-gray-900">Check-in</span>
                    <span className="font-mono text-sm text-gray-600">
                      {format(parseISO(checkIn.timeCollected), 'h:mm:ss a')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">
              Click on a highlighted date to view check-in times
            </div>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-8 text-gray-500">Loading your check-in history...</div>
      )}
    </div>
  );
}