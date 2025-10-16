'use client';

import React, { useState } from 'react';
import Head from 'next/head';

export default function UpdateDatabasePage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const testConnection = async () => {
    try {
      setDebugInfo('Testing basic API connection...');
      const response = await fetch('/api/test-simple');
      const data = await response.json();
      setDebugInfo(`Basic API test: ${JSON.stringify(data)}\n\nTesting database connections...`);
      
      const dbResponse = await fetch('/api/test-database');
      const dbData = await dbResponse.json();
      setDebugInfo(prev => prev + `\nDatabase test: ${JSON.stringify(dbData, null, 2)}`);
    } catch (err) {
      setDebugInfo(`Connection test failed: ${err}`);
    }
  };

  const triggerUpdate = async () => {
    setIsUpdating(true);
    setError(null);
    setResult(null);
    setDebugInfo('Starting update...');

    try {
      // First test the connection
      setDebugInfo('Testing API connection...');
      const testResponse = await fetch('/api/test-simple');
      if (!testResponse.ok) {
        throw new Error(`Test connection failed: ${testResponse.status}`);
      }
      setDebugInfo('API connection test passed');

      // Now try the simple endpoint first
      setDebugInfo('Calling simple update endpoint...');
      const response = await fetch('/api/cron/update-feeds-simple', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setDebugInfo(`Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        setDebugInfo(`Error response: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
      }

      const responseText = await response.text();
      setDebugInfo(`Raw response: ${responseText.substring(0, 200)}...`);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        setDebugInfo(`JSON parse error: ${parseError}, raw response: ${responseText}`);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
      }

      if (data.success) {
        setResult(data);
        setDebugInfo('Update completed successfully');
      } else {
        setError(data.error || 'Update failed');
        setDebugInfo(`Update failed: ${data.error}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error';
      setError(errorMessage);
      setDebugInfo(`Error: ${errorMessage}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/cron/status');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Status check failed');
    }
  };

  const testSimpleUpdate = async () => {
    try {
      setDebugInfo('Testing simple update endpoint...');
      const response = await fetch('/api/cron/update-feeds-simple');
      
      if (!response.ok) {
        const errorText = await response.text();
        setDebugInfo(`Simple update failed: ${response.status} - ${errorText}`);
        setError(`Simple update failed: ${response.status}`);
        return;
      }
      
      const data = await response.json();
      setResult(data);
      setDebugInfo(`Simple update successful: ${JSON.stringify(data, null, 2)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simple update test failed');
      setDebugInfo(`Simple update error: ${err}`);
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

              <div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Test Connection
                </h2>
                <p className="text-gray-600 mb-4">
                  Test if the API endpoints are working correctly.
                </p>
                <button
                  onClick={testConnection}
                  className="w-full bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
                >
                  Test API
                </button>
              </div>

              <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Simple Update Test
                </h2>
                <p className="text-gray-600 mb-4">
                  Test Supabase connection without full update.
                </p>
                <button
                  onClick={testSimpleUpdate}
                  className="w-full bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
                >
                  Test Simple
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

            {debugInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-blue-700 font-medium">Debug Info:</span>
                </div>
                <p className="text-blue-600 mt-1 text-sm font-mono whitespace-pre-wrap">{debugInfo}</p>
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
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2">Debug Information</h4>
                <div className="space-y-1 text-xs text-gray-500">
                  <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
                  <p><strong>API Base:</strong> {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</p>
                  <p><strong>User Agent:</strong> {typeof window !== 'undefined' ? window.navigator.userAgent.substring(0, 50) + '...' : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
