import React from "react";
import { connect } from "react-redux";
import hyperstore from "./store";

export interface Props {
  name: string;
}

class TestComponent extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div>
        <button
          data-testid="button"
          onClick={() => {
            hyperstore.user.update("name", "abc");
          }}
        >
          {this.props.name}
        </button>
      </div>
    );
  }
}

const MapStateToProps = store => {
  return {
    name: store[hyperstore.user.name]
  };
};

export default connect(MapStateToProps)(TestComponent);
