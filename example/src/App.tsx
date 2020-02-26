import React, { useState } from "react";
import { hyperstore } from "./store";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import "./App.css";

export interface Props {
  username: string;
}

export interface State {
  username: string;
}

let App: React.FC<Props> = function(props) {
  const [username, setUsername] = useState(props.username);

  return (
    <div className="App">
      <header className="App-header">
        <p>my name: {props.username}</p>
        <TextField
          onChange={event => {
            setUsername(event.target.value);
          }}
          value={username}
          required
          placeholder="new name"
          label="new name"
          error={false}
        />
        <Button
          variant="outlined"
          color="primary"
          disabled={false}
          startIcon={<AddIcon />}
          onClick={() => {
            hyperstore.user.update({ name: username });
          }}
        >
          change name
        </Button>
      </header>
    </div>
  );
};

const MapStateToProps = store => {
  return {
    username: store[hyperstore.user.name]
  };
};

export default connect(MapStateToProps)(App);
