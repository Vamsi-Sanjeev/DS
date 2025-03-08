import { createClient } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface RiskData {
  id: string;
  timestamp: string;
  financial_risk: number;
  cyber_risk: number;
  reputation_risk: number;
  created_at: string;
  user_id: string;
}

export interface PredictionData {
  id: string;
  timestamp: string;
  financial_risk: number;
  cyber_risk: number;
  reputation_risk: number;
  created_at: string;
  user_id: string;
}

export interface EmployeeData {
  id: string;
  timestamp: string;
  workload: number;
  satisfaction: number;
  resignation_risk: number;
  department: string;
  created_at: string;
  user_id: string;
}

export interface SimulationQuestion {
  id: string;
  question: string;
  context: string;
  options: {
    id: string;
    text: string;
    score: number;
    feedback: string;
  }[];
  correct_option: string;
  feedback: string;
  created_at: string;
}

export interface UserResponse {
  id: string;
  user_id: string;
  question_id: string;
  selected_option: string;
  score: number;
  created_at: string;
}

// Helper function to handle Supabase errors
const handleSupabaseError = (error: any): never => {
  console.error('Supabase error:', error);
  throw new Error(error.message || 'An error occurred while connecting to the database');
};

// Data fetching functions with real-time updates
export async function getRiskData(): Promise<RiskData[]> {
  const { data, error } = await supabase
    .from('risk_data')
    .select('*')
    .order('timestamp', { ascending: true });

  if (error) handleSupabaseError(error);
  return data || [];
}

export async function getPredictionData(): Promise<PredictionData[]> {
  const { data, error } = await supabase
    .from('prediction_data')
    .select('*')
    .order('timestamp', { ascending: true });

  if (error) handleSupabaseError(error);
  return data || [];
}

export async function getEmployeeData(): Promise<EmployeeData[]> {
  const { data, error } = await supabase
    .from('employee_data')
    .select('*')
    .order('timestamp', { ascending: true });

  if (error) handleSupabaseError(error);
  return data || [];
}

// Subscribe to real-time updates
export function subscribeToPredictionData(callback: (data: PredictionData[]) => void) {
  const subscription = supabase
    .channel('prediction_data_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'prediction_data'
      },
      async () => {
        // Fetch updated data when changes occur
        const { data, error } = await supabase
          .from('prediction_data')
          .select('*')
          .order('timestamp', { ascending: true });

        if (!error && data) {
          callback(data);
        }
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

export function subscribeToRiskData(callback: (data: RiskData[]) => void) {
  const subscription = supabase
    .channel('risk_data_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'risk_data'
      },
      async () => {
        // Fetch updated data when changes occur
        const { data, error } = await supabase
          .from('risk_data')
          .select('*')
          .order('timestamp', { ascending: true });

        if (!error && data) {
          callback(data);
        }
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

export function subscribeToEmployeeData(callback: (data: EmployeeData[]) => void) {
  const subscription = supabase
    .channel('employee_data_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'employee_data'
      },
      async () => {
        // Fetch updated data when changes occur
        const { data, error } = await supabase
          .from('employee_data')
          .select('*')
          .order('timestamp', { ascending: true });

        if (!error && data) {
          callback(data);
        }
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

// Upload prediction data
export async function uploadPredictionData(file: File): Promise<PredictionData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const csvText = event.target?.result as string;
        if (!csvText) throw new Error('Failed to read file content');

        const rows = csvText.split('\n').map(row => row.trim()).filter(row => row.length > 0);
        if (rows.length < 2) throw new Error('CSV file must contain headers and at least one data row');

        const headers = rows[0].split(',').map(header => header.trim().toLowerCase());
        const requiredHeaders = ['timestamp', 'financial_risk', 'cyber_risk', 'reputation_risk'];
        
        const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
        if (missingHeaders.length > 0) {
          throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
        }

        const predictionDataEntries = rows.slice(1).map(row => {
          const values = row.split(',').map(value => value.trim());
          const entry = {
            timestamp: new Date(values[headers.indexOf('timestamp')]).toISOString(),
            financial_risk: parseFloat(values[headers.indexOf('financial_risk')]),
            cyber_risk: parseFloat(values[headers.indexOf('cyber_risk')]),
            reputation_risk: parseFloat(values[headers.indexOf('reputation_risk')])
          };

          if (
            isNaN(entry.financial_risk) || entry.financial_risk < 0 || entry.financial_risk > 100 ||
            isNaN(entry.cyber_risk) || entry.cyber_risk < 0 || entry.cyber_risk > 100 ||
            isNaN(entry.reputation_risk) || entry.reputation_risk < 0 || entry.reputation_risk > 100
          ) {
            throw new Error('Risk values must be numbers between 0 and 100');
          }

          return entry;
        });

        const { data, error } = await supabase
          .from('prediction_data')
          .insert(predictionDataEntries)
          .select();

        if (error) handleSupabaseError(error);
        resolve(data || []);
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Failed to process file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

// File upload functions with proper error handling
export async function uploadRiskData(file: File): Promise<RiskData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const csvText = event.target?.result as string;
        if (!csvText) throw new Error('Failed to read file content');

        const rows = csvText.split('\n').map(row => row.trim()).filter(row => row.length > 0);
        if (rows.length < 2) throw new Error('CSV file must contain headers and at least one data row');

        const headers = rows[0].split(',').map(header => header.trim().toLowerCase());
        const requiredHeaders = ['timestamp', 'financial_risk', 'cyber_risk', 'reputation_risk'];
        
        const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
        if (missingHeaders.length > 0) {
          throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
        }

        const riskDataEntries = rows.slice(1).map(row => {
          const values = row.split(',').map(value => value.trim());
          const entry = {
            timestamp: new Date(values[headers.indexOf('timestamp')]).toISOString(),
            financial_risk: parseFloat(values[headers.indexOf('financial_risk')]),
            cyber_risk: parseFloat(values[headers.indexOf('cyber_risk')]),
            reputation_risk: parseFloat(values[headers.indexOf('reputation_risk')])
          };

          if (
            isNaN(entry.financial_risk) || entry.financial_risk < 0 || entry.financial_risk > 100 ||
            isNaN(entry.cyber_risk) || entry.cyber_risk < 0 || entry.cyber_risk > 100 ||
            isNaN(entry.reputation_risk) || entry.reputation_risk < 0 || entry.reputation_risk > 100
          ) {
            throw new Error('Risk values must be numbers between 0 and 100');
          }

          return entry;
        });

        const { data, error } = await supabase
          .from('risk_data')
          .insert(riskDataEntries)
          .select();

        if (error) handleSupabaseError(error);
        resolve(data || []);
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Failed to process file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export async function uploadEmployeeData(file: File): Promise<EmployeeData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const csvText = event.target?.result as string;
        if (!csvText) throw new Error('Failed to read file content');

        const rows = csvText.split('\n').map(row => row.trim()).filter(row => row.length > 0);
        if (rows.length < 2) throw new Error('CSV file must contain headers and at least one data row');

        const headers = rows[0].split(',').map(header => header.trim().toLowerCase());
        const requiredHeaders = ['timestamp', 'workload', 'satisfaction', 'department'];
        
        const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
        if (missingHeaders.length > 0) {
          throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
        }

        const employeeDataEntries = rows.slice(1).map(row => {
          const values = row.split(',').map(value => value.trim());
          const workload = parseFloat(values[headers.indexOf('workload')]);
          const satisfaction = parseFloat(values[headers.indexOf('satisfaction')]);
          
          if (
            isNaN(workload) || workload < 0 || workload > 100 ||
            isNaN(satisfaction) || satisfaction < 0 || satisfaction > 100
          ) {
            throw new Error('Workload and satisfaction must be numbers between 0 and 100');
          }

          return {
            timestamp: new Date(values[headers.indexOf('timestamp')]).toISOString(),
            workload,
            satisfaction,
            department: values[headers.indexOf('department')],
            resignation_risk: calculateResignationRisk(workload, satisfaction)
          };
        });

        const { data, error } = await supabase
          .from('employee_data')
          .insert(employeeDataEntries)
          .select();

        if (error) handleSupabaseError(error);
        resolve(data || []);
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Failed to process file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

function calculateResignationRisk(workload: number, satisfaction: number): number {
  const workloadFactor = workload / 100;
  const satisfactionFactor = 1 - (satisfaction / 100);
  const risk = ((workloadFactor * 0.4) + (satisfactionFactor * 0.6)) * 100;
  return Math.min(Math.max(Math.round(risk), 0), 100);
}