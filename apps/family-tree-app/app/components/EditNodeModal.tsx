import React from 'react';

interface DecisionCondition {
    nextNodeLabel: string;
    expression: string;
}

interface EditNodeModalProps {
    open: boolean;
    editType: string | null;
    editTitle: string;
    setEditTitle: (v: string) => void;
    editHtml: string;
    setEditHtml: (v: string) => void;
    editConditions: DecisionCondition[];
    setEditConditions: (v: DecisionCondition[]) => void;
    onClose: () => void;
    onSave: () => void;
}

const EditNodeModal: React.FC<EditNodeModalProps> = ({
    open,
    editType,
    editTitle,
    setEditTitle,
    editHtml,
    setEditHtml,
    editConditions,
    setEditConditions,
    onClose,
    onSave,
}) => {
    if (!open) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.35)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(2px)',
            }}
        >
            <div
                style={{
                     background: '#fff',
                    padding: '36px 32px 28px 32px',
                    borderRadius: 16,
                    minWidth: 400, // Increased from 340
                    maxWidth: 600, // Increased from 480
                    width: '100%',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 18,
                    border: '1.5px solid #e0e0e0',
                    position: 'relative',
                    animation: 'modalPopIn 0.18s cubic-bezier(.4,2,.6,1)',
               }}
            >
                <h3 style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: 20,
                    color: '#5e35b1',
                    letterSpacing: 0.2,
                    textAlign: 'left',
                }}>
                    Edit {editType === 'VIEW' ? 'View Node' : 'Decision Node'}
                </h3>
                <label style={{ fontWeight: 500, color: '#333', fontSize: 15 }}>
                    Title:
                    <input
                        type="text"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        style={{
                            marginTop: 6,
                            padding: 10,
                            fontSize: 16,
                            borderRadius: 7,
                            border: '1.5px solid #bdbdbd',
                            width: '100%',
                            marginBottom: 2,
                            outline: 'none',
                            transition: 'border 0.2s',
                        }}
                    />
                </label>
                {editType === 'VIEW' && (
                    <label style={{ fontWeight: 500, color: '#333', fontSize: 15 }}>
                        HTML Content:
                        <textarea
                            value={editHtml}
                            onChange={e => setEditHtml(e.target.value)}
                            rows={4}
                            style={{
                                marginTop: 6,
                                padding: 10,
                                fontSize: 15,
                                borderRadius: 7,
                                border: '1.5px solid #bdbdbd',
                                width: '100%',
                                resize: 'vertical',
                                outline: 'none',
                                minHeight: 60,
                            }}
                        />
                    </label>
                )}
                {editType === 'DECISION' && (
                    <div>
                        <label style={{ fontWeight: 500, color: '#333', fontSize: 15 }}>Conditions:</label>
                        {editConditions.map((cond, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center' }}>
                                <input
                                    type="text"
                                    value={cond.nextNodeLabel}
                                    onChange={e => {
                                        const updated = [...editConditions];
                                        updated[idx] = { ...updated[idx], nextNodeLabel: e.target.value };
                                        setEditConditions(updated);
                                    }}
                                    style={{
                                        flex: 1.2,
                                        padding: 8,
                                        borderRadius: 6,
                                        border: '1.5px solid #bdbdbd',
                                        fontSize: 15,
                                        outline: 'none',
                                    }}
                                    placeholder="Target Node Name"
                                />
                                <input
                                    type="text"
                                    value={cond.expression}
                                    onChange={e => {
                                        const updated = [...editConditions];
                                        updated[idx] = { ...updated[idx], expression: e.target.value };
                                        setEditConditions(updated);
                                    }}
                                    style={{
                                        flex: 2,
                                        padding: 8,
                                        borderRadius: 6,
                                        border: '1.5px solid #bdbdbd',
                                        fontSize: 15,
                                        outline: 'none',
                                    }}
                                    placeholder="Condition/Expression"
                                />
                                <button
                                    onClick={() => setEditConditions(editConditions.filter((_, i) => i !== idx))}
                                    style={{
                                        background: '#f5f5f5',
                                        border: 'none',
                                        borderRadius: 5,
                                        cursor: 'pointer',
                                        padding: '4px 10px',
                                        color: '#b71c1c',
                                        fontSize: 18,
                                        transition: 'background 0.15s',
                                    }}
                                    disabled={editConditions.length === 1}
                                    title="Remove condition"
                                >🗑️</button>
                            </div>
                        ))}
                        <button
                            onClick={() => setEditConditions([...editConditions, { nextNodeLabel: '', expression: '' }])}
                            style={{
                                marginTop: 2,
                                padding: '6px 14px',
                                borderRadius: 6,
                                border: '1.5px solid #bdbdbd',
                                background: '#fafafa',
                                cursor: 'pointer',
                                color: '#333',
                                fontWeight: 500,
                                fontSize: 14,
                                transition: 'background 0.15s',
                            }}
                        >+ Add Condition</button>
                    </div>
                )}
                <div style={{ display: 'flex', gap: 14, justifyContent: 'flex-end', marginTop: 10 }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '9px 22px',
                            borderRadius: 7,
                            border: 'none',
                            background: '#eee',
                            color: '#333',
                            fontWeight: 500,
                            cursor: 'pointer',
                            fontSize: 15,
                            transition: 'background 0.15s',
                        }}
                    >Cancel</button>
                    <button
                        onClick={onSave}
                        style={{
                            padding: '9px 22px',
                            borderRadius: 7,
                            border: 'none',
                            background: '#5e35b1',
                            color: '#fff',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: 15,
                            boxShadow: '0 2px 8px rgba(94,53,177,0.08)',
                            transition: 'background 0.15s',
                            opacity: !editTitle.trim() ? 0.7 : 1,
                        }}
                        disabled={!editTitle.trim()}
                    >Save</button>
                </div>
            </div>
            {/* Modal pop-in animation */}
            <style>
                {`
                @keyframes modalPopIn {
                    0% { transform: scale(0.92) translateY(30px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                `}
            </style>
        </div>
    );
};

export default EditNodeModal;