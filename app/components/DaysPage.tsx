"use client";

import { useEffect, useState } from 'react';
import { DayCard } from './DayCard';
import { Loader2, Plus } from 'lucide-react';
import Link from 'next/link';

export function DaysPage() {
  const [days, setDays] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Failed to fetch data');
        const result = await response.json();
        setDays(result.days || []);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading your entries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-xl p-8 text-center">
        <p className="text-red-600 font-medium mb-2">Error loading data</p>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Days</h1>
        <Link href="/home" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          New Entry
        </Link>
      </div>

      {days.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-16 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No entries yet</h3>
          <p className="text-gray-500 mb-6">Start tracking your time by creating your first entry.</p>
          <Link href="/home" className="text-blue-600 font-semibold hover:text-blue-700">
            Create entry now →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {days.map((dayData, idx) => (
            <DayCard
              key={dayData.id || idx}
              data={dayData}
            />
          ))}
        </div>
      )}
    </div>
  );
}