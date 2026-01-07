import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Copy, Check, LogIn } from 'lucide-react';
import { getActiveFamilyId, joinFamily } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';

function FamilySettings() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [familyId, setFamilyId] = useState('');
    const [newFamilyId, setNewFamilyId] = useState('');
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const id = getActiveFamilyId();
        if (id) {
            setFamilyId(id);
        }
    }, [user]);

    const handleCopy = () => {
        navigator.clipboard.writeText(familyId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleJoin = async (e) => {
        e.preventDefault();
        if (!newFamilyId.trim()) return;

        if (window.confirm('¿Estás seguro de que quieres unirte a esta familia? Dejarás de ver tus perfiles actuales.')) {
            setLoading(true);
            try {
                await joinFamily(newFamilyId.trim());
                alert('¡Te has unido a la familia con éxito!');
                navigate('/');
            } catch (error) {
                alert('Error al unirse a la familia: ' + error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    if (!user) {
        return (
            <div className="container" style={{ textAlign: 'center', paddingTop: '3rem' }}>
                <h2>Inicia sesión para gestionar tu familia</h2>
                <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    Volver al Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <button onClick={() => navigate('/')} className="btn btn-secondary" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <ArrowLeft size={20} />
                Volver
            </button>

            <h1 style={{ marginBottom: 'var(--spacing-xl)', fontSize: 'var(--font-size-3xl)' }}>
                Configuración de Familia
            </h1>

            <div className="grid" style={{ gridTemplateColumns: '1fr', gap: 'var(--spacing-xl)' }}>
                {/* My Family Code */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                        <Users size={24} className="text-primary" />
                        <h3 style={{ margin: 0 }}>Tu Código de Familia</h3>
                    </div>

                    <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-md)' }}>
                        Comparte este código con otros familiares para que puedan ver y gestionar los mismos perfiles.
                    </p>

                    <div style={{
                        display: 'flex',
                        gap: 'var(--spacing-sm)',
                        background: 'var(--bg-secondary)',
                        padding: 'var(--spacing-md)',
                        borderRadius: 'var(--border-radius-sm)',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <code style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--color-info)' }}>
                            {familyId || 'Cargando...'}
                        </code>
                        <button onClick={handleCopy} className="btn btn-sm btn-secondary" disabled={!familyId}>
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            {copied ? 'Copiado' : 'Copiar'}
                        </button>
                    </div>
                </div>

                {/* Join Family */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                        <LogIn size={24} className="text-success" />
                        <h3 style={{ margin: 0 }}>Unirse a otra Familia</h3>
                    </div>

                    <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-md)' }}>
                        Introduce el código de familia de otra persona para acceder a sus perfiles.
                    </p>

                    <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Pega el código aquí..."
                                value={newFamilyId}
                                onChange={(e) => setNewFamilyId(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading || !newFamilyId.trim()}>
                            {loading ? 'Uniéndose...' : 'Unirse a Familia'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default FamilySettings;
