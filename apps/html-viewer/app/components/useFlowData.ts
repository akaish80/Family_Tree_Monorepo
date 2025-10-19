import { useState, useEffect } from 'react';
import axios from 'axios';
import { FlowData } from './types';

export const useFlowData = (configId: string, flowId: string) => {
    const [flowData, setFlowData] = useState<FlowData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFlowData = async () => {
            if (!configId || !flowId) {
                setError('Configuration ID and Flow ID are required');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                
                // Fetch flow data via the html-viewer's API proxy
                const response = await axios.get(`/api/flows?flowId=${flowId}&configId=${configId}`);
                
                console.log('API response:', response.data);
                console.log('API response.data.flows:', response.data.flows);
                
                if (response?.data?.flows?.length > 0) {
                    setFlowData(response.data.flows[0]);
                    setError(null);
                    return response.data.flows[0];
                } else {
                    console.error('Flow configuration not found or malformed:', response.data);
                    setError('Flow configuration not found');
                    return null;
                }
            } catch (err: any) {
                console.error('Error fetching flow data:', err);
                if (err.response?.status === 404) {
                    setError('Flow configuration not found in the database');
                } else if (err.response?.status === 403) {
                    setError('Flow does not belong to the specified configuration');
                } else {
                    setError('Failed to fetch flow data. Make sure the family-tree-app is running on port 3000.');
                }
                return null;
            } finally {
                setLoading(false);
            }
        };

        fetchFlowData();
    }, [configId, flowId]);

    return { flowData, loading, error };
};