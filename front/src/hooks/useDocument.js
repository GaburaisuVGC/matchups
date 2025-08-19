import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { decodeDocument, getPokemonImages } from '../services/apiService';

const useDocument = (source) => {
    const [documentData, setDocumentData] = useState(null);
    const [pokemonImages, setPokemonImages] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const fetchDocumentData = async () => {
            setLoading(true);
            setError(null);
            try {
                let fetchedData;
                if (source === 'api') {
                    if (!id) throw new Error("Document ID is missing for API source.");
                    fetchedData = await decodeDocument(id);
                } else if (source === 'local') {
                    const storedData = localStorage.getItem('storedData');
                    if (storedData) {
                        fetchedData = JSON.parse(storedData);
                    } else {
                        throw new Error('No local document found.');
                    }
                } else {
                    throw new Error('Invalid data source specified for useDocument hook.');
                }

                setDocumentData(fetchedData);

                if (fetchedData && fetchedData.paste) {
                    const images = await getPokemonImages(fetchedData.paste);
                    setPokemonImages(images);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDocumentData();
    }, [id, source]);

    // Return everything the component will need.
    // Also returning setDocumentData allows for optimistic updates or local modifications (like from Quick Edit).
    return { documentData, pokemonImages, error, loading, setDocumentData };
};

export default useDocument;
