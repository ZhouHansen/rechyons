import React from "react";
import { connect } from "react-redux";
import superstore from "./store";

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
            superstore.user.update("name", "abc");
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
    name: store[superstore.user.name]
  };
};

export default connect(MapStateToProps)(TestComponent);
