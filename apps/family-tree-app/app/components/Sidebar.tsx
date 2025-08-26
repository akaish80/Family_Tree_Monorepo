// Sidebar panel for draggable nodes (always visible)
const Sidebar = () => (
    <div
        style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100vh',
            width: 180,
            background: 'rgba(255,255,255,0.97)',
            borderRight: '1px solid #e0e0e0',
            boxShadow: '2px 0 8px rgba(0,0,0,0.07)',
            zIndex: 10,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
        }}
    >
        <div style={{ fontWeight: 'bold', margin: '10px 0 10px 16px', color: '#764ba2', fontSize: 15 }}>
            Drag Nodes
        </div>
        <div
            draggable
            onDragStart={e => {
                e.dataTransfer.setData('application/reactflow', 'view');
                e.dataTransfer.effectAllowed = 'move';
            }}
            style={{
                margin: '0 0 0 16px',
                padding: '10px 18px',
                background: '#e3f2fd',
                border: '2px solid #1976d2',
                borderRadius: 8,
                cursor: 'grab',
                fontWeight: 500,
                color: '#1565c0',
                marginBottom: 12,
                userSelect: 'none',
            }}
        >
            👁️ View
        </div>
        <div
            draggable
            onDragStart={e => {
                e.dataTransfer.setData('application/reactflow', 'DECISION');
                e.dataTransfer.effectAllowed = 'move';
            }}
            style={{
                margin: '0 0 0 16px',
                padding: '10px 18px',
                background: '#fff3e0',
                border: '2px solid #ff9800',
                borderRadius: 8,
                cursor: 'grab',
                fontWeight: 500,
                color: '#ef6c00',
                marginBottom: 12,
                userSelect: 'none',
            }}
        >
            🔀 Decision
        </div>
    </div>
);

export default Sidebar;