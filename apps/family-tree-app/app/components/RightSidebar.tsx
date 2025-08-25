type RightSidebarProps = {
  selectedNode: any;
  onEdit: () => void;
  onDelete: () => void;
};

const RightSidebar = ({ selectedNode, onEdit, onDelete }: RightSidebarProps) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      right: 0,
      height: '100vh',
      width: 240,
      background: 'rgba(255,255,255,0.97)',
      borderLeft: '1px solid #e0e0e0',
      boxShadow: '-2px 0 8px rgba(0,0,0,0.07)',
      zIndex: 10,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
    }}
  >
    <div style={{ width: '100%', padding: '0 18px' }}>
      <div style={{ fontWeight: 'bold', margin: '10px 0', color: '#764ba2', fontSize: 15, textAlign: 'right' }}>
        Node Actions
      </div>
      <button
        onClick={onEdit}
        disabled={!selectedNode || selectedNode.type === 'START' || selectedNode.type === 'END'}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: 10,
          background:
            selectedNode && selectedNode.type !== 'START' && selectedNode.type !== 'END'
              ? '#ffb300'
              : '#eee',
          color:
            selectedNode && selectedNode.type !== 'START' && selectedNode.type !== 'END'
              ? '#fff'
              : '#aaa',
          border: 'none',
          borderRadius: 6,
          fontWeight: 600,
          fontSize: 15,
          cursor:
            selectedNode && selectedNode.type !== 'START' && selectedNode.type !== 'END'
              ? 'pointer'
              : 'not-allowed',
          transition: 'background 0.2s',
        }}
      >
        ✏️ Edit Node
      </button>
      <button
        onClick={onDelete}
        disabled={!selectedNode || selectedNode.type === 'START' || selectedNode.type === 'END'}
        style={{
          width: '100%',
          padding: '10px',
          background:
            selectedNode && selectedNode.type !== 'START' && selectedNode.type !== 'END'
              ? '#e53935'
              : '#eee',
          color:
            selectedNode && selectedNode.type !== 'START' && selectedNode.type !== 'END'
              ? '#fff'
              : '#aaa',
          border: 'none',
          borderRadius: 6,
          fontWeight: 600,
          fontSize: 15,
          cursor:
            selectedNode && selectedNode.type !== 'START' && selectedNode.type !== 'END'
              ? 'pointer'
              : 'not-allowed',
          transition: 'background 0.2s',
        }}
      >
        🗑️ Delete Node
      </button>
      {selectedNode && (
        <div style={{ marginTop: 20, fontSize: 13, color: '#333', wordBreak: 'break-word' }}>
          <b>Selected Node:</b>
          <div>ID: {selectedNode.id}</div>
          <div>Label: {selectedNode.data?.label}</div>
        </div>
      )}
    </div>
  </div>
);

export default RightSidebar;
