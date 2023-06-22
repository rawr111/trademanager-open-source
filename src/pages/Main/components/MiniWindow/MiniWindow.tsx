import react, { FC } from 'react';
import { observer } from 'mobx-react';

interface MiniWindowInterface {
    title: string;
    width: string;
    height: string;
    maxHeight?: string;
    content: JSX.Element;
    onClose: () => void;
}

const MiniWindow: FC<MiniWindowInterface> = observer((props) => {
    return (
        <div className='darkBackground' onClick={(event) => {
            const target = event.target as HTMLDivElement;
            if (target.className === 'darkBackground' || target.className === 'form-cross') props.onClose();
        }}>
            <div className='form table-settings' style={{ width: props.width, height: props.height }}>
                <div className='form-caption'><div>{props.title}</div><div className='form-cross'></div></div>
                <div className='form-content' style={{ height: `calc(${props.height} - 40px)`, maxHeight: `calc(${props.maxHeight} - 40px)`, overflow: 'auto', minHeight: '200px' }}>
                    {props.content}
                </div>
            </div>
        </div>
    );
});


export default MiniWindow;