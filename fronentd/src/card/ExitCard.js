import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ExitCard = ({ onRemoveSuccess, onRemoveError, onCardSelect }) => {
    const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);

    const token = useSelector(state => state.auth.token);

    useEffect(() => {
        if (token) {
            getSavedCards();
        } else {
            console.error('No token available');
        }
    }, [token]);

    const getSavedCards = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/stripe/get-cards', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCards(res.data.data);
        } catch (error) {
            console.error('Error fetching saved cards:', error);
        }
    };

    const handleRemoveCard = async () => {
        if (!selectedCard) return;

        try {
            await axios.post(
                'http://localhost:8000/api/stripe/remove-card',
                { card_id: selectedCard.id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setCards(cards.filter(card => card.id !== selectedCard.id));
            setSelectedCard(null);
            if (onRemoveSuccess) onRemoveSuccess();
        } catch (error) {
            console.error('Error removing card:', error);
            if (onRemoveError) onRemoveError(error);
        }
    };

    const handleCardSelection = (card) => {
        setSelectedCard(card);
        onCardSelect(card);
    };

    return (
        <div className="container mx-auto mt-6 p-4 bg-white rounded-md shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Cards</h2>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 text-left">Select</th>
                        <th className="p-2 text-left">Type</th>
                        <th className="p-2 text-left">Ending</th>
                    </tr>
                </thead>
                <tbody>
                    {cards.length ? (
                        cards.map((card) => (
                            <tr key={card.id} className="hover:bg-gray-50">
                                <td className="p-2">
                                    <input
                                        type="radio"
                                        name="selectedCard"
                                        checked={selectedCard?.id === card.id || false} // Ensure `checked` is always controlled
                                        onChange={() => handleCardSelection(card)}
                                        className="form-radio h-4 w-4 text-blue-500"
                                    />
                                </td>
                                <td className="p-2">{card.brand}</td>
                                <td className="p-2">**** **** **** {card.last4}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="p-2 text-center text-gray-500">No cards available</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="mt-4 flex justify-between">
                <button
                    onClick={handleRemoveCard}
                    className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                    disabled={!selectedCard}
                >
                    Remove
                </button>
                <button
                    onClick={() => setSelectedCard(null)}
                    className="bg-gray-500 text-white py-1 px-4 rounded hover:bg-gray-600 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default ExitCard;
