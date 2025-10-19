import { Handle, Position } from 'reactflow';

interface CanvasNodeData {
    label: string;
    canvasId: string;
    canvasName: string;
    configId: string;
    flowId: string;
}

const CanvasNode = ({ data }: { data: CanvasNodeData }) => {
    const handleCanvasClick = () => {
        // Open the canvas editor in a new tab
        const canvasUrl = `/canvas/editor/${data.configId}?flowId=${data.flowId}`;
        window.open(canvasUrl, '_blank');
    };
    
    return (
        <div 
            style={{
                padding: '14px',
                background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                border: '2px solid #9c27b0',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '600',
                textAlign: 'center',
                minWidth: '140px',
                maxWidth: '200px',
                color: '#7b1fa2',
                boxShadow: '0 4px 16px rgba(156, 39, 176, 0.2)',
                userSelect: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                position: 'relative',
            }}
            onClick={handleCanvasClick}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(156, 39, 176, 0.3)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(156, 39, 176, 0.2)';
            }}
            title={`Canvas: ${data.canvasName}\nClick to open in new tab`}
        >
            <Handle 
                type="target" 
                position={Position.Top} 
                id="canvas-target" 
                style={{ 
                    background: '#9c27b0',
                    border: '2px solid #ffffff',
                    width: '8px',
                    height: '8px',
                }} 
            />
            
            <div style={{ marginBottom: '6px', fontSize: '16px' }}>🎨</div>
            <div style={{ 
                fontWeight: 'bold', 
                marginBottom: '4px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
            }}>
                {data.canvasName}
            </div>
            <div style={{ 
                fontSize: '10px', 
                color: '#8e24aa',
                fontWeight: 'normal',
                opacity: 0.8,
            }}>
                Canvas Page
            </div>
            
            <Handle 
                type="source" 
                position={Position.Bottom} 
                id="canvas-source" 
                style={{ 
                    background: '#9c27b0',
                    border: '2px solid #ffffff',
                    width: '8px',
                    height: '8px',
                }} 
            />
        </div>
    );
};

export default CanvasNode;