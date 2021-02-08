import * as React from 'react';
import {
  makeStyles,
  createStyles,
  withStyles,
  Theme,
} from '@material-ui/core/styles';
import { ExampleHoc } from './_ExampleHoc';
import Button from '@material-ui/core/Button';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import MuiTableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

import { animate } from './util/animate';
import { KDWorker } from '../module/KDWorker';

const TableCell = withStyles({
  root: {
    borderBottom: 'none',
  },
})(MuiTableCell);

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    controls: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    button: {
      flex: 1,
    },
    leftButton: {
      marginRight: theme.spacing(2),
    },
  });
});

export const KDWorkerExample = (): React.ReactElement => {
  const classes = useStyles();

  const [output, setOutput] = React.useState('ready');
  const [working, setWorking] = React.useState(false);

  const text = React.useMemo(() => {
    return {
      title: 'KDWorker Example',
      id: 'kdworker-example',
      description:
        'In this example, code that would normally block the UI is run in a web worker using KDWorker. Since the process is run in a background thread, the "Animate" button will continue working.',
      codeExample: ` 
      KDWorker((x) => {
          /** 
           * Doing something that would 
           * noticeably block the UI if
           * done synchronously.
           */
          const blockwith = (fn) => {
            return (loops) => {
              if (typeof fn !== 'function') return;
              const blockers = new Array(1000000).fill(fn);
              while (loops--) blockers.forEach((f) => f());
            };
          };

          blockwith(Date.now)(x);

          return "done";
        })(50)
          .then((results) => {
            console.log(results);
          })
          .catch(console.log);
      `,
    };
  }, []);

  const EventTable = React.useMemo(() => {
    const footnote = 'First "Run Worker", then click "Animate".';
    return (
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell align='center'>{output}</TableCell>
            </TableRow>
            {working && (
              <TableRow>
                <LinearProgress />
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Typography variant={'caption'}>{footnote}</Typography>
      </TableContainer>
    );
  }, [output, working]);

  const Controls = React.useMemo(() => {
    const LeftButton = () => {
      const onclick = () => {
        setOutput('working for about 6 seconds...');
        setWorking(true);

        KDWorker((x) => {
          /**
           * Set this to true to test the `catch`
           * event when an error is thrown.
           */
          const doErrorTest = false;

          /**
           * So we can time how long this takes.
           */
          const start = Date.now();

          /**
           * Doing something that takes about 5 seconds.
           */
          const blockwith = (fn) => {
            return (loops) => {
              if (typeof fn !== 'function') return;
              const blockers = new Array(1000000).fill(fn);
              while (loops--) blockers.forEach((f) => f());
            };
          };

          if (doErrorTest) {
            blockwith(Math.random)(x);
            throw new Error();
          } else {
            blockwith(Date.now)(x);
          }

          return `worker done after ${Date.now() - start}ms`;
        })(50)
          .then((results) => {
            setOutput(results as string);
            setWorking(false);
          })
          .catch(console.log);
      };

      return (
        <Button
          onClick={onclick}
          className={`${classes.button} ${classes.leftButton}`}
          variant='outlined'
          disableElevation
        >
          Run Worker
        </Button>
      );
    };

    const RightButton = () => {
      const ref = React.useRef(null);

      const onclick = () => {
        const node = ref?.current;
        if (node) animate(node, 'jello');
      };

      return (
        <Button
          ref={ref}
          onClick={onclick}
          className={classes.button}
          variant='outlined'
          disableElevation
        >
          Animate
        </Button>
      );
    };

    return (
      <div>
        <div className={classes.controls}>
          <LeftButton />
          <RightButton />
        </div>
        {EventTable}
      </div>
    );
  }, [classes.controls, classes.button, classes.leftButton, EventTable]);

  return (
    <ExampleHoc
      id={text.id}
      title={text.title}
      description={text.description}
      codeExample={text.codeExample}
      controls={Controls}
    />
  );
};
