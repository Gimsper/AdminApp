import { createItem } from '@/actions/item';
import { useEffect, useState } from 'react';

import { getCategories } from '@/actions/category';

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onItemAdded: (newItem: any) => any;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onItemAdded }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [categories, setCategories] = useState<{ categoryId: string; name: string }[]>([]);
    const [category, setCategory] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const exec = async () => {
            const response = await getCategories();
            if (response.data) {
                setCategories(response.data);
            }
        }
        exec();
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const item = {
                name,
                price,
                categoryId: category,
            };

            const response = await createItem(item);
            if (response.data) {
                setError('Item agregado exitosamente');
            }

            setName('');
            setCategory(0);
            onItemAdded(item);
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al agregar el item');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>Agregar Item</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nombre:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Precio:</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={price}
                            onChange={e => setPrice(Number(e.target.value))}
                            required
                        />
                    </div>
                    <div>
                        <label>Categoría:</label>
                        <select
                            value={category}
                            onChange={e => setCategory(Number(e.target.value))}
                            required
                        >
                            <option value="">Selecciona una categoría</option>
                            {categories.map(cat => (
                                <option key={cat.categoryId} value={cat.categoryId}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {error && <div className="error">{error}</div>}
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} disabled={loading}>
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Agregando...' : 'Agregar'}
                        </button>
                    </div>
                </form>
            </div>
            <style>{`
                .modal-backdrop {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .modal {
                    background: #fff;
                    padding: 2rem;
                    border-radius: 8px;
                    min-width: 300px;
                }
                .modal-actions {
                    margin-top: 1rem;
                    display: flex;
                    gap: 1rem;
                    justify-content: flex-end;
                }
                .error {
                    color: red;
                    margin-top: 0.5rem;
                }
            `}</style>
        </div>
    );
};

export default AddItemModal;