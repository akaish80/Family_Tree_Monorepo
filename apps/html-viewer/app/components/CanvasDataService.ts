import axios from 'axios';

export class CanvasDataService {
    static async fetchCanvasData(configId: string, flowId: string) {
        try {
            console.log('Fetching canvas data for:', { configId, flowId });
            
            const response = await axios.get(`/api/canvas?configId=${configId}&flowId=${flowId}`);
            
            if (response.data && response.data.pageElement) {
                console.log('Canvas data fetched successfully:', response.data);
                const resp = JSON.parse(response.data.pageElement);
                return resp;
            } else {
                console.log('No canvas data found');
                return null;
            }
        } catch (err: any) {
            console.error('Error fetching canvas data:', err);
            if (err.response?.status === 404) {
                console.log('Canvas not found - this is normal for new canvases');
                return null;
            }
            throw new Error('Failed to fetch canvas data');
        }
    }
}