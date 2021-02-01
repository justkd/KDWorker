import * as React from 'react';
import {
  makeStyles,
  createStyles,
  useTheme,
  Theme,
} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      fontSize: 20,
    },
    paper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      flexGrow: 1,
      marginTop: theme.spacing(5),
      marginBottom: theme.spacing(5),
      padding: theme.spacing(2),
      [theme.breakpoints.down('sm')]: {
        margin: theme.spacing(2),
      },
    },
    headerContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
        alignItems: 'center',
      },
    },
    controls: {
      marginTop: theme.spacing(1),
      width: '100%',
    },
    controlsDivider: {
      marginTop: theme.spacing(3),
      width: '100%',
    },
    title: {
      flexGrow: 1,
      [theme.breakpoints.up('xs')]: {
        marginRight: theme.spacing(5),
      },
    },
    description: {
      width: '65%',
      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
    },
    inputContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      flexGrow: 0,
      marginTop: 10,
      marginBottom: 10,
      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
    },
    extraInputs: {
      flexGrow: 1,
      marginLeft: 50,
      [theme.breakpoints.down('xs')]: {
        flexGrow: 0,
        marginLeft: 0,
      },
    },
    code: {
      fontFamily: 'Courier New',
      fontSize: '1rem',
      lineHeight: '1rem',
      margin: theme.spacing(2),
      backgroundColor: 'WhiteSmoke',
      width: '100%',
      [theme.breakpoints.down('sm')]: {
        fontSize: '0.85rem',
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: '0.5rem',
      },
    },
    accordion: {
      backgroundColor: 'WhiteSmoke',
      width: '100%',
      marginBottom: 5,
    },
  });
});

export const ExampleHoc = ({
  title,
  description,
  codeExample,
  moreExamples,
  moreExamplesTitle,
  controls,
  controlsBeforeMoreExamples,
  moreControls,
  id,
}: {
  title: string;
  description?: string;
  codeExample?: string;
  moreExamples?: string;
  moreExamplesTitle?: string;
  controls?: React.ReactElement;
  controlsBeforeMoreExamples?: boolean;
  moreControls?: React.ReactElement;
  id?: string;
}): React.ReactElement => {
  const classes = useStyles();
  const theme = useTheme();
  const mediaQueryXs = useMediaQuery(theme.breakpoints.down('xs'));

  const Header = React.useMemo(() => {
    return (
      <React.Fragment>
        <Typography className={classes.title} variant={'h6'}>
          {title}
        </Typography>
        {description && (
          <Typography className={classes.description} variant={'body2'}>
            {description}
          </Typography>
        )}
      </React.Fragment>
    );
  }, [classes.title, classes.description, title, description]);

  const CodeExample = React.useMemo(() => {
    return <pre className={classes.code}>{codeExample}</pre>;
  }, [classes.code, codeExample]);

  const MoreExamples = React.useMemo(() => {
    const title = moreExamplesTitle ? moreExamplesTitle : '/* More Examples */';
    return (
      <Accordion elevation={0} className={classes.accordion}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <pre className={classes.code} style={{ margin: 0 }}>
            {title}
          </pre>
        </AccordionSummary>
        <AccordionDetails style={{ width: '100%', padding: 0 }}>
          <pre className={classes.code} style={{ margin: 0 }}>
            {moreExamples}
          </pre>
        </AccordionDetails>
      </Accordion>
    );
  }, [classes.code, classes.accordion, moreExamples, moreExamplesTitle]);

  const Content = React.useMemo(() => {
    return (
      <React.Fragment>
        {codeExample && CodeExample}
        {!controlsBeforeMoreExamples && moreExamples && MoreExamples}
        {controls && <div className={classes.controls}>{controls}</div>}
        {controlsBeforeMoreExamples && moreExamples && (
          <div className={classes.controlsDivider}>{MoreExamples}</div>
        )}
        {moreControls && <div className={classes.controls}>{moreControls}</div>}
      </React.Fragment>
    );
  }, [
    CodeExample,
    MoreExamples,
    classes.controls,
    classes.controlsDivider,
    codeExample,
    controls,
    controlsBeforeMoreExamples,
    moreControls,
    moreExamples,
  ]);

  return (
    <div id={id} className={classes.root}>
      <Paper className={classes.paper} elevation={3}>
        {mediaQueryXs ? (
          <div className={classes.header}>
            {Header}
            {Content}
          </div>
        ) : (
          <div className={classes.headerContainer}>
            <div className={classes.header}>{Header}</div>
            {Content}
          </div>
        )}
      </Paper>
    </div>
  );
};
