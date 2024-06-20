import { FC, ReactElement, MouseEvent, ChangeEvent, useState } from 'react'
import Papa from 'papaparse';

import styles from './grid.module.scss'
// import useTranslations from 'i18n/useTranslations'
import { Button } from '../button/Button';

interface IGrid {
    grid: {cols: number, rows: number};
    mainColour: string;
    secondaryColour: string;
}

const Grid: FC<IGrid> = ({
  grid,
  mainColour = 'grey',
  secondaryColour = 'red',
}): ReactElement => {

//   const { t } = useTranslations()

  const [myGrid, setGrid] = useState(Array(grid.rows).fill(0).map(() => Array(grid.cols).fill(0)))

  const [inputCols, setCells] = useState(grid.cols);
  const [inputRows, setRows] = useState(grid.rows);
  
//   Toggle square in grid
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    const item = e.target as HTMLElement;
    
    if (item.dataset.pos === undefined || item.dataset.val === undefined) {
        console.log('Is this possible?', item.dataset.pos, item.dataset.val)
        return
    }

    const loc = item.dataset.pos.split(',', 2);
    const currentVal = parseInt(item.dataset.val);

    const newGrid = myGrid.map(rows => [ ...rows ]);
    newGrid[parseInt(loc[0])][parseInt(loc[1])] = (currentVal === 1) ? 0 : 1;
    setGrid(newGrid);

  };

//   Change grid size without losing existing pattern
  const updateGrid = () => {
    const newGrid = Array(inputRows).fill(0).map(() => Array(inputCols).fill(0))
    
    const rowLimit = Math.min(newGrid.length, myGrid.length)
    const colLimit = Math.min(newGrid[0].length, myGrid[0].length)

    for(let i = 0; i < rowLimit; i++) {
        for (let j=0; j < colLimit; j++) {
            if (myGrid[i][j] === 1) {
                newGrid[i][j] = 1;
            }
        }
    }

    setGrid(newGrid);
}

const [crochetPattern, setPattern] = useState<string[]>([]);

// Create Crochet pattern
    const createPattern = () => {
        const currentGrid = myGrid.map(rows => [ ...rows ]);
        const chainLength: String = (currentGrid[0].length * 3 + 1).toString();

        const pattern = []
        const chain = "Chain " + chainLength + " loosely. Now work into the second loop from the hook."
        pattern.push(chain)
        
        const closedSt = 'dc' // add str(stitchCounter) first when appending
        const openSt = 'ch2' // add one to stitchCounter first, then append closedSt, append openSt, reset stitchCounter
        const endSt = ' ch1 and turn' 

        for(let i = 0; i < currentGrid.length; i++) { // loop through rows
            const currentRow = []
            let stitchCounter = 0;
            for (let j=0; j < currentGrid[0].length; j++) { // now work out stitches per row
                if (currentGrid[i][j] === 0) {
                    stitchCounter += 3
                } else if (currentGrid[i][j] === 1) {
                    if (j === 0 && (i % 2 !== 0)) {
                        currentRow.push('ch5') // chain 5 if first stitch is open
                    } else {
                        stitchCounter += 1
                        if (i % 2 === 0) { // flipped rows, chain goes first
                            currentRow.unshift(stitchCounter.toString() + closedSt)
                            if (j !== currentGrid[0].length-1) {
                                currentRow.unshift(openSt)
                            }
                        } else {
                            currentRow.push(stitchCounter.toString() + closedSt)
                            currentRow.push(openSt)
                        }
                        stitchCounter = 0
                    }
                }
            }
            if (stitchCounter === 0) {
                if (i % 2 === 0) {
                    currentRow.unshift("ch5") // close last stitch if open
                } else {
                    currentRow.push("1dc") // close last stitch if open
                }
            } else {
                if (i % 2 === 0) {
                    currentRow.unshift(stitchCounter.toString() + closedSt)
                } else {
                    currentRow.push(stitchCounter.toString() + closedSt)
                }
            }
            currentRow.push(endSt)
            pattern.push(currentRow.join(' '))
        }
        setPattern(pattern)
    }

    const [showSetPattern, setSetPattern] = useState(false);
    const openPatternSet  = () => {
      setSetPattern(!showSetPattern);
    }

    const [csvPattern, setPatternFromText] = useState('');

    const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setPatternFromText(e.target.value);
    };

    const updateGridFromText  = () => {
      Papa.parse<[]>(csvPattern, {
        complete: (result) => {
          // Currently relies on "selected" squares (values in csv) being 1
          // TODO convert all values to 1
          if (result.data.length > 0) {
            const data: [][] = result.data
            setCells(data[0].length)
            setRows(data.length)
            setGrid(data)
          }
        },
        header: false,
        skipEmptyLines: true,
        dynamicTyping: true,
      });

    }

  return (
    <div>
      <table>
        <tbody>
            {myGrid.map((rows, index) => {
            return (
            <tr className={styles.row} key={index}>
                {rows.map((columns, cIndex) => {
                    return <td key={cIndex} data-pos={[index, cIndex]} data-val={columns || 0} className={styles.square} onClick={handleClick} style={{backgroundColor: columns === 1 ? secondaryColour : mainColour}} />
                })}
            </tr>
        )
      })}
        </tbody>

      </table>

      <div className={styles.gridControls}>
        <div className={styles.control}>
          <label htmlFor="cells">Cols</label>
          <input
            type="number"
            min={1}
            placeholder="Cols"
            id="cells"
            value={inputCols}
            onChange={(e) => setCells(parseInt(e.target.value))}
          />
        </div>

        <div className={styles.control}>
          <label htmlFor="rows">Rows</label>
          <input
            type="number"
            min={1}
            placeholder="Rows"
            id="rows"
            value={inputRows}
            onChange={(e) => setRows(parseInt(e.target.value))}
          />
        </div>
        <Button
          type='button'
          onClick={updateGrid}
        >
          Update Grid
        </Button>
        </div>
        <div className={styles.csvPattern}>
          <Button
            type='button'
            onClick={openPatternSet}>
              Set pattern from csv
          </Button>
          {showSetPattern && (
            <div className={styles.setPattern}>
              <label htmlFor="csvInput">Paste csv pattern here</label>
              <textarea id="csvInput" name="csvInput" rows={12} cols={26} value={csvPattern} onChange={handleTextareaChange}/>
              <Button
                type='button'
                onClick={updateGridFromText}>
                  Update pattern
              </Button>
            </div>

          )}
        </div>

      <Button
          type='button'
          onClick={createPattern}
      >
          Create Pattern
      </Button>
    
    <div>
        <ol type="1">
            {crochetPattern.map((instruction, index) => {
                return (
                    <li key={index}>
                        Row {index+1}. {instruction}
                    </li>
                )
            })}
        </ol>
    </div>
    </div>
  );
};

export { Grid };
