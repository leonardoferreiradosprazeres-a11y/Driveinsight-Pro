import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ScanSimulator from './components/ScanSimulator';
import FloatingCard from './components/FloatingCard';
import SettingsForm from './components/SettingsForm';
import HistoryTable from './components/HistoryTable';
import Dashboard from './components/Dashboard';
import TripDetailsModal from './components/TripDetailsModal';
import { DEFAULT_SETTINGS, UserSettings, Trip, OcrResult } from './types';
import { calculateTripMetrics } from './services/calculationService';
import processImageWithGemini from './services/geminiService';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('driveinsight_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });
  
  const [history, setHistory] = useState<Trip[]>(() => {
      const saved = localStorage.getItem('driveinsight_history');
      return saved ? JSON.parse(saved) : [];
  });

  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [selectedHistoryTrip, setSelectedHistoryTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem('driveinsight_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('driveinsight_history', JSON.stringify(history));
  }, [history]);

  const handleSettingsSave = (newSettings: UserSettings) => {
    setSettings(newSettings);
    // If there is a current trip, recalculate it with new settings
    if (currentTrip) {
        const metrics = calculateTripMetrics(currentTrip, newSettings);
        setCurrentTrip({ ...currentTrip, ...metrics });
    }
  };

  const handleImageSelected = async (base64Data: string) => {
    setLoading(true);
    setCurrentTrip(null);
    setIsSaved(false);

    try {
      // 1. OCR with Gemini
      const ocrResult: OcrResult = await processImageWithGemini(base64Data);
      
      // 2. Calculate Metrics
      const metrics = calculateTripMetrics(ocrResult, settings);
      
      // 3. Create Trip Object
      const newTrip: Trip = {
        id: uuidv4(),
        timestamp: Date.now(),
        ...ocrResult,
        ...metrics
      };
      
      setCurrentTrip(newTrip);
    } catch (error) {
      alert("Falha ao analisar a imagem. Tente novamente com um print mais claro do Uber/99.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const saveCurrentTrip = () => {
    if (currentTrip && !isSaved) {
      setHistory(prev => [currentTrip, ...prev]);
      setIsSaved(true);
      setActiveTab('history');
    }
  };

  const clearHistory = () => {
      if(window.confirm('Tem certeza que deseja apagar TODO o histórico? Esta ação não pode ser desfeita.')) {
          setHistory([]);
      }
  };
  
  const deleteTrip = (id: string) => {
      setHistory(prev => prev.filter(t => t.id !== id));
      // Ensure modal closes if the deleted trip was the one selected
      if (selectedHistoryTrip && selectedHistoryTrip.id === id) {
        setSelectedHistoryTrip(null);
      }
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} settings={settings}>
      
      {activeTab === 'dashboard' && (
        <Dashboard history={history} />
      )}

      {activeTab === 'scan' && (
        <div className="h-full relative">
          <ScanSimulator 
            onImageSelected={handleImageSelected} 
            loading={loading} 
          />
          
          {currentTrip && (
            <FloatingCard 
              trip={currentTrip} 
              onClose={() => setCurrentTrip(null)}
              onSave={saveCurrentTrip}
              isSaved={isSaved}
            />
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <>
          <HistoryTable 
             trips={history} 
             onClear={clearHistory} 
             onSelectTrip={setSelectedHistoryTrip}
          />
          {selectedHistoryTrip && (
            <TripDetailsModal 
                trip={selectedHistoryTrip}
                onClose={() => setSelectedHistoryTrip(null)}
                onDelete={deleteTrip}
            />
          )}
        </>
      )}

      {activeTab === 'settings' && (
        <SettingsForm 
          settings={settings} 
          onSave={handleSettingsSave} 
          onReset={() => setSettings(DEFAULT_SETTINGS)} 
        />
      )}

    </Layout>
  );
};

export default App;