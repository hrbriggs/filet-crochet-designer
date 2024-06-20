import { FC, useState, ReactElement } from 'react'

import { Grid } from '../../components/grid/Grid'
import { ColourPicker } from '../../components/colourPicker/colourPicker'

import styles from './crochet.module.scss'

const Crochet: FC = (): ReactElement => {

  const gridBase = {
    cols: 5,
    rows: 3
  };

  const [mColour, setMColour] = useState("#f0f");
  const [sColour, setSColour] = useState("#00f");

  return (
    <div>
      <div className='main'>
        <title>Crochet</title> 
        <h1>Filet crochet designer</h1>
        <div className={styles.crochetColours}>
          <div className={styles.colourPickers}>
            <h4>Yarn</h4>
            <ColourPicker
              colour={mColour}
              setColour={setMColour}
            />
          </div>
          <div className={styles.colourPickers}>
            <h4>Spaces</h4>
            <ColourPicker
              colour={sColour}
              setColour={setSColour}
            />
          </div>
        </div>
        <div className={styles.crochet}>
          <Grid
            grid={gridBase}
            mainColour={mColour}
            secondaryColour={sColour}
          />
        </div>
      </div>
    </div>
    
  )
}

export { Crochet }
