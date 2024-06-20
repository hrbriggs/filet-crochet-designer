import { HexColorPicker } from "react-colorful";
import { FC, ReactElement, useCallback, useState } from 'react';

import styles from './colourPicker.module.scss';
import { useOutsideClick } from "./useClickOutside";

interface IColour {
    colour: string
    setColour: (selectedColour: string) => void
}

const ColourPicker: FC<IColour> = ({
    colour,
    setColour
}): ReactElement => {

    // const popover = useRef();
    const [isOpen, toggle] = useState(false);
    const close = useCallback(() => toggle(false), []);
    // useOutsideClick(popover, close);

    const ref = useOutsideClick(() => {
        close();
      });

    return (
        <div className={styles.picker}>
            <div className={styles.swatch} style={{backgroundColor: colour}} onClick={()=> toggle(true)}/>
      
        {isOpen && (
            <div className={styles.popover} ref={ref}>
                <HexColorPicker color={colour} onChange={setColour} />
            </div>
        )}
        
        </div>
    )
}

export { ColourPicker }