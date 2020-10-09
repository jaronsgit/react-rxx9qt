import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Tooltip, Typography } from "@material-ui/core";

import { cloneDeep } from "lodash";

import { AppContext } from "./AppContextProvider";
import LongestPathGraph from "./LongestPathGraph";

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});

function createData(test, result) {
  return { test, result };
}

export default function FormalTestsResultsDisplay(props) {
  const theme = useTheme();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false); //State of dialog
  const [rowClicked, setRowClicked] = React.useState(null);
  const [activeStep, setActiveStep] = React.useState(0);
  const { state, dispatch } = React.useContext(AppContext);
  const [
    longestPathVisualisation,
    setLongestPathVisualisation
  ] = React.useState(null);

  const response = state.testResults;

  let newRows = [];

  for (const [test, result] of Object.entries(response)) {
    //console.log(`${test}: ${result}`);
    newRows.push(createData(test, result));
  }

  const handleClickOpen = (event, test) => {
    console.log(test);
    if (test !== "Connected") {
      setRowClicked(test);
      setOpen(true);
      setActiveStep(0);

      if (test === "LongestPathDirected") {
        let currentStandardVisualisation = cloneDeep(
          state.selectedSentenceVisualisation
        );
        console.log(currentStandardVisualisation);
        let newNodes = currentStandardVisualisation.nodes.map((node) => ({
          ...node,
          group: response.LongestPathDirected[activeStep].includes(node.id)
            ? "longestPath"
            : node.group
        }));
        console.log(newNodes);
        setLongestPathVisualisation({
          ...currentStandardVisualisation,
          nodes: newNodes
        });
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  let dialogElement;

  if (rowClicked === "Planar") {
    dialogElement = <Paper> planar vis </Paper>;
  } else if (rowClicked === "LongestPathDirected") {
    dialogElement = (
      <LongestPathGraph
        type={rowClicked}
        longestPathVisualisation={longestPathVisualisation}
      />
    );
  } else if (rowClicked === "LongestPathUndirected") {
    dialogElement = (
      <LongestPathGraph
        type={rowClicked}
        longestPathVisualisation={longestPathVisualisation}
      />
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Test</TableCell>
            <TableCell align="right">Result</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {newRows.map((row) => (
            <TableRow
              hover
              key={row.test}
              onClick={(event) => handleClickOpen(event, row.test)}
            >
              <TableCell component="th" scope="row">
                {row.test}
              </TableCell>
              <TableCell align="right">{JSON.stringify(row.result)}</TableCell>
              <TableCell>
                {row.test !== "Connected" && (
                  <Button variant="outlined" color="primary">
                    Visualise
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleClose}
        aria-labelledby="longest-path-visualisation-title"
      >
        <DialogTitle id="longest-path-visualisation-title">
          {rowClicked} Visualisation
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogElement}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}
