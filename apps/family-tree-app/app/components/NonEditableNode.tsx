import { Handle, Position } from 'reactflow';

const NonEditableNode = ({ data }: { data: any }) => {
    const isStartNode = data.label === 'START';
    const isEndNode = data.label === 'END' || data.label === 'End';
    
    return (
        <div style={{
            padding: '12px',
            background: isStartNode ? '#e1f5fe' : isEndNode ? '#ffebee' : '#e1f5fe',
            border: isStartNode ? '2px solid #01579b' : isEndNode ? '2px solid #d32f2f' : '2px solid #01579b',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            textAlign: 'center',
            minWidth: '120px',
            color: isStartNode ? '#01579b' : isEndNode ? '#d32f2f' : '#01579b',
            boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
            userSelect: 'none',
        }}>
            {isStartNode && (
                <Handle type="source" position={Position.Bottom} id="start-source" style={{ background: '#01579b' }} />
            )}
            {isEndNode && (
                <Handle type="target" position={Position.Top} id="end-target" style={{ background: '#d32f2f' }} />
            )}
            {data.label}
        </div>
    );
};

export default NonEditableNode;
