import { useState } from 'react';

const InputNode = ({ data, id }: { data: any, id: string }) => {
    const [inputValue, setInputValue] = useState('');
    const [isEditing, setIsEditing] = useState(true);
    const [savedName, setSavedName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSave = async () => {
        if (inputValue.trim()) {
            setIsSaving(true);
            setSaveStatus('idle');

            try {
                const response = await fetch('/api/family-tree', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: 'add',
                        node: {
                            id: `dynamic-${Date.now()}`,
                            name: inputValue.trim()
                        }
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    setSavedName(inputValue.trim());
                    setIsEditing(false);
                    setSaveStatus('success');

                    if (data.onNodeSaved) {
                        data.onNodeSaved({
                            id: `dynamic-${Date.now()}`,
                            name: inputValue.trim()
                        });
                    }

                    setTimeout(() => {
                        setInputValue('');
                        setIsEditing(true);
                        setSavedName('');
                        setSaveStatus('idle');
                    }, 2000);
                } else {
                    setSaveStatus('error');
                }
            } catch (error) {
                console.error('Error saving node:', error);
                setSaveStatus('error');
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleEdit = () => {
        setInputValue(savedName);
        setIsEditing(true);
    };

    return (
        <div style={{
            padding: '12px',
            background: '#fff8e1',
            border: '2px solid #ff9800',
            borderRadius: '12px',
            minWidth: '200px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
            <div style={{
                fontSize: '12px',
                color: '#e65100',
                fontWeight: 'bold',
                marginBottom: '8px',
                textAlign: 'center',
            }}>
                ➕ Add New Member
            </div>

            {isEditing ? (
                <div>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter name..."
                        disabled={isSaving}
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ffb74d',
                            borderRadius: '6px',
                            fontSize: '14px',
                            marginBottom: '8px',
                            outline: 'none',
                            opacity: isSaving ? 0.7 : 1,
                        }}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !isSaving) {
                                handleSave();
                            }
                        }}
                    />
                    <button
                        onClick={handleSave}
                        disabled={!inputValue.trim() || isSaving}
                        style={{
                            width: '100%',
                            padding: '8px',
                            background: isSaving ? '#ffa726' : (inputValue.trim() ? '#ff9800' : '#ccc'),
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            cursor: (!inputValue.trim() || isSaving) ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {isSaving ? '⏳ Saving...' : '💾 Save'}
                    </button>

                    {saveStatus === 'error' && (
                        <div style={{
                            marginTop: '8px',
                            padding: '6px',
                            backgroundColor: '#ffebee',
                            color: '#d32f2f',
                            borderRadius: '4px',
                            fontSize: '12px',
                            textAlign: 'center',
                        }}>
                            ❌ Failed to save. Try again.
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    {saveStatus === 'success' ? (
                        <div style={{
                            padding: '12px',
                            background: 'linear-gradient(135deg, #e8f5e8, #c8e6c9)',
                            borderRadius: '8px',
                            marginBottom: '8px',
                            textAlign: 'center',
                            border: '2px solid #4caf50',
                        }}>
                            <div style={{
                                fontSize: '20px',
                                marginBottom: '4px',
                            }}>
                                ✅
                            </div>
                            <div style={{
                                fontWeight: 'bold',
                                color: '#2e7d32',
                                fontSize: '14px',
                                marginBottom: '4px',
                            }}>
                                {savedName}
                            </div>
                            <div style={{
                                fontSize: '12px',
                                color: '#4caf50',
                            }}>
                                Added successfully!
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            padding: '8px',
                            background: '#f3e5f5',
                            borderRadius: '6px',
                            marginBottom: '8px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            color: '#4a148c',
                        }}>
                            {savedName}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default InputNode;
