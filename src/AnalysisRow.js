import React, { useState, useEffect, useContext } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import { AppContext, layoutGraph } from "./AppContextProvider.js";
import { Paper } from "@material-ui/core";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Paper,
  Typography
} from "@material-ui/core";

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";

import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: "100%",
    height: "100%",
    border: "1px solid red"
  },
  header: {
    display: "flex",
    alignItems: "center",
    height: 50,
    paddingLeft: theme.spacing(4),
    backgroundColor: theme.palette.background.default
  },
  body: {
    height: "200px",
    width: "100%",
    display: "block",
    backgroundColor: "beige"
  }
}));

function CompareTwoGraphsTool(props) {
  const classes = useStyles();
  const theme = useTheme();
  const { state, dispatch } = useContext(AppContext);

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel2a-content"
        id="compare-two-header"
      >
        <Typography className={classes.heading}>Compare Two Graphs</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid
          className={classes.root}
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={6} container>
            <Paper className={classes.body}>
              <Card className={classes.root}>
                <CardContent>
                  <Typography
                    className={classes.title}
                    color="textPrimary"
                    gutterBottom
                  >
                    What the tool does
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    well meaning and kindly.
                  </Typography>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.body}>
              <Card className={classes.root}>
                <CardContent>
                  <Typography
                    className={classes.title}
                    color="textPrimary"
                    gutterBottom
                  >
                    What the tool does
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    well meaning and kindly.
                  </Typography>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}

export default CompareTwoGraphsTool;
