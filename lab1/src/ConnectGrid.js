import React from "react";
import Square from "./Scuare";

export default class ConnectGrid extends React.Component {
    constructor(props) {
        super(props);
        this.updateConnect = this.updateConnect.bind(this);
        this.changeColor = this.changeColor.bind(this);
    }

    updateConnect = (key1, key2, w) => this.props.updateConnect(key1, key2, w);
    changeColor = (key1, key2, color) => this.props.changeColor(key1, key2, color);

    renderSquare(y, x, w) {
        return (
            <Square
                updateConnect={this.updateConnect}
                y={y} x={x} w={w} l={this.props.l}
                showDotName={this.props.showDotName}
                changeColor={this.changeColor}
                // onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {

        const d = {
            display: 'flex',
            flexDirection: 'row'
        };
        return (
            <div>
                {this.props.grid.map((e, y) => <div style={d}>{e.map((d, x) => this.renderSquare(y, x, d.w))}</div>)}
            </div>
        );
    }
}