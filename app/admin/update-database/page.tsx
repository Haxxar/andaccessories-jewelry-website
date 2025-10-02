'use client';

import React, { useState } from 'react';
import Head from 'next/head';

export default function UpdateDatabasePage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const triggerUpdate = async () => {
    setIsUpdating(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/webhook/update-database', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer default-secret', // Using default secret
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Update failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsUpdating(false);
    }
  };

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/cron/status');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Status check failed');
    }
  };

  return (
    <>
      <Head>
        <title>Update Database - &Accessories Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-yellow-100">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Database Update Center
              </h1>
              <p className="text-gray-600">
                Manually trigger product feed updates and check database status
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-r from-yellow-100 to-pink-100 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Update Database
                </h2>
                <p className="text-gray-600 mb-4">
                  Fetch latest product feeds and update your Supabase database.
                </p>
                <button
                  onClick={triggerUpdate}
                  disabled={isUpdating}
                  className="w-full bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-500 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    'Update Database Now'
                  )}
                </button>
              </div>

              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Check Status
                </h2>
                <p className="text-gray-600 mb-4">
                  View current database status and last update information.
                </p>
                <button
                  onClick={checkStatus}
                  className="w-full bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
                >
                  Check Status
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-700 font-medium">Error:</span>
                </div>
                <p className="text-red-600 mt-1">{error}</p>
              </div>
            )}

            {result && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4">
                  {result.success ? '✅ Success!' : '❌ Failed'}
                </h3>
                
                <div className="space-y-4">
                  {result.message && (
                    <p className="text-green-700">{result.message}</p>
                  )}
                  
                  {result.data && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Supabase Status</h4>
                        <div className="space-y-1 text-sm">
                          <p><strong>Total Products:</strong> {result.data.supabase?.totalProducts || 'N/A'}</p>
                          <p><strong>Last Update:</strong> {result.data.supabase?.lastUpdate || 'N/A'}</p>
                          <p><strong>Hours Since Update:</strong> {result.data.supabase?.timeSinceUpdateHours || 'N/A'}</p>
                          <p><strong>Recent Update:</strong> {result.data.supabase?.hasRecentUpdate ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Environment</h4>
                        <div className="space-y-1 text-sm">
                          <p><strong>Cron Secret:</strong> {result.data.environment?.cronSecretSet ? '✅ Set' : '❌ Missing'}</p>
                          <p><strong>Supabase URL:</strong> {result.data.environment?.supabaseUrlSet ? '✅ Set' : '❌ Missing'}</p>
                          <p><strong>Supabase Key:</strong> {result.data.environment?.supabaseKeySet ? '✅ Set' : '❌ Missing'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {result.supabaseResult && (
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Update Results</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Products Inserted</p>
                          <p className="text-2xl font-bold text-green-600">{result.supabaseResult.inserted}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Products Deleted</p>
                          <p className="text-2xl font-bold text-blue-600">{result.supabaseResult.deleted}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Errors</p>
                          <p className="text-2xl font-bold text-red-600">{result.supabaseResult.errors}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {result.duration && (
                    <p className="text-sm text-gray-600">
                      <strong>Duration:</strong> {result.duration}ms
                    </p>
                  )}
                  
                  {result.timestamp && (
                    <p className="text-sm text-gray-600">
                      <strong>Timestamp:</strong> {new Date(result.timestamp).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Alternative Methods</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Manual API Call:</strong> <code>GET /api/cron/update-feeds-manual</code></p>
                <p><strong>Webhook:</strong> <code>POST /api/webhook/update-database</code></p>
                <p><strong>Status Check:</strong> <code>GET /api/cron/status</code></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
