import React, { useState, useEffect, useContext } from "react";
//import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import { AppContext } from "./AppContextProvider";

/*const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));*/

export default function SelectComponent({ options }) {
  //const classes = useStyles();
  //const [age, setAge] = React.useState('');
  const { state, dispatch } = useContext(AppContext);
  const [option, setOption] = React.useState(options[0]);
  console.log(options);

  return (
    <div>
      <FormControl>
        <InputLabel id="demo-simple-select-label">Sentence</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={option}
          onChange={(event) => {
            setOption(event.target.value);
            console.log(event.target.value.id);
            dispatch({
              type: "SET_SENTENCE_VISUALISATION",
              payload: { selectedSentenceID: event.target.value.id }
            });
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.id} value={option}>
              {option.id}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
