import react, { FC, useEffect, useState } from 'react';
import Attic from '../../globalComponents/Attic/Attic';
import './Error.css';

const Error: FC = () => {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [id, setId] = useState("");

    useEffect(() => {
        window.ErrorWindow.windowApi.onGetParams((event, data) => {
            setTitle(data.title);
            setText(data.text);
            setId(data.id);
        });
    }, []);

    return (
        <>
            <Attic windowName='error' title='Ошибка' id={id} />
            <div className='error-container'>
                <div >
                    <h1>{title} 🤔</h1>
                </div>
                <div className='error-container-text'>
                    {text}
                </div>
            </div>
        </>
    );
}

export default Error;