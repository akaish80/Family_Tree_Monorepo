import { Handle, Position } from 'reactflow';

const NonEditableNode = ({ data }: { data: any }) => (
    <div style={{
        padding: '12px',
        background: '#e1f5fe',
        border: '2px solid #01579b',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: 'bold',
        textAlign: 'center',
        minWidth: '120px',
        color: '#01579b',
        boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
        userSelect: 'none',
    }}>
        {data.label === 'START' && (
            <Handle type="source" position={Position.Bottom} id="a" style={{ background: '#01579b' }} />
        )}
        {data.label === 'End' && (
            <Handle type="target" position={Position.Top} id="b" style={{ background: '#7b1fa2' }} />
        )}
        {data.label}
    </div>
);

export default NonEditableNode;
