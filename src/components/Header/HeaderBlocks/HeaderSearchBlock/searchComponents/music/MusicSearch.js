import React, {useEffect} from 'react';
import Title from "../UI/Title/Title";

const MusicSearch = ({ query }) => {
    useEffect(() => {
        window.addEventListener('init-search', init);

        return () => {
            window.removeEventListener('init-search', init);
        }
    }, []);

    const init = function () {

    }

    return (
        <div>
            <Title>Музыка</Title>
            <div>{query}</div>
        </div>
    );
};

export default MusicSearch;