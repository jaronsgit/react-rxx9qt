import React, { useContext, useState } from "react";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import LocationSearchingIcon from "@material-ui/icons/LocationSearching";
import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

import { useHistory } from "react-router-dom";
import { AppContext } from "./AppContextProvider";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "80%",
    "& > * + *": {
      marginTop: theme.spacing(3)
    }
  },
  autoComplete: {
    marginBottom: 10
  }
}));

function SearchSubgraphPatternTool(props) {
  const classes = useStyles();

  const { state, dispatch } = useContext(AppContext);
  const history = useHistory();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function getLabels(sentence) {
    if (state.selectedSentenceID !== null) {
      let graph = sentence;

      let labelOptions = [];

      graph.nodes.forEach((node) => {
        if (node.group !== "token") {
          labelOptions.push(node.label);
        }
      });
      //console.log(labelOptions); //debugging
      return labelOptions;
    } else {
      return [];
    }
  }

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="flex-start"
      style={{ width: "100%", border: "1px solid red" }}
      spacing={2}
    >
      <Grid item style={{ width: "100%" }}>
        <Typography>Search for a set of node labels:</Typography>
        <Autocomplete
          style={{ width: "100%" }}
          disabled={state.selectedSentenceID === null}
          multiple
          disableCloseOnSelect
          freeSolo
          id="tags-standard"
          options={getLabels(state.selectedSentenceVisualisation)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Select Node Labels or Enter Your Own"
            />
          )}
        />
      </Grid>
      <Grid item style={{ width: "100%" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {}}
          style={{ marginBottom: 10, marginTop: 10 }}
          disabled={state.selectedSentenceID === null}
        >
          Search for selected node labels
        </Button>
        <Divider variant="middle" />
      </Grid>

      <Grid item style={{ width: "100%" }}>
        <Typography>
          Or visually select a sub-graph pattern on the currently displayed
          graph:
        </Typography>
        <Button
          variant="contained"
          color="primary"
          endIcon={<LocationSearchingIcon />}
          onClick={() => setOpen(true)}
          style={{ marginBottom: 10, marginTop: 10 }}
          disabled={state.selectedSentenceID === null}
        >
          Select sub-graph pattern
        </Button>
      </Grid>
      <Dialog
        open={open}
        fullWidth={true}
        maxWidth="xl"
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Select a node on the graph:"}
        </DialogTitle>
        <DialogContent style={{ height: "80vh" }}>
          <div>select subgraph vis to go here</div>
        </DialogContent>
        <DialogActions>
          <Chip
            label={`Selected Nodes and Edges: still need to get this working`}
          />
          <Button onClick={() => {}} color="primary" autoFocus>
            Search
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default SearchSubgraphPatternTool;
