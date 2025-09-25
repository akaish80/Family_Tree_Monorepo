type BottomBarProps = {
  onSave?: () => void;
  onPreview?: () => void;
  onReset?: () => void;
};

const BottomBar = ({ onSave, onPreview, onReset }: BottomBarProps) => (
  <div
    style={{
      position: 'fixed',
      left: 180,
      right: 240,
      bottom: 0,
      height: 64,
      background: 'rgba(255,255,255,0.97)',
      borderTop: '1px solid #e0e0e0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 32px',
      zIndex: 20,
      boxShadow: '0 -2px 8px rgba(0,0,0,0.04)',
    }}
  >
    <button
      style={{
        marginRight: 16,
        padding: '10px 24px',
        background: '#e53935',
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        fontWeight: 600,
        fontSize: 16,
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(229,57,53,0.08)'
      }}
      onClick={onReset || (() => window.location.reload())}
    >
      Reset
    </button>
    <button
      style={{
        padding: '10px 32px',
        background: '#764ba2',
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        fontWeight: 600,
        fontSize: 16,
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(118,75,162,0.08)'
      }}
      onClick={onSave}
    >
      Save
    </button>
    
    <button 
      style={{
        padding: '10px 32px',
        background: '#a25c4bff',
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        marginLeft: 16,
        fontWeight: 600,
        fontSize: 16,
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(118,75,162,0.08)'
      }}
      onClick={onPreview}
    >
      Preview
    </button>
  </div>
);

export default BottomBar;
