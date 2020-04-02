import React from "react";

export default class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.deleteDot = this.deleteDot.bind(this);
        this.changeCoordinateX = this.changeCoordinateX.bind(this);
        this.changeCoordinateY = this.changeCoordinateY.bind(this);
    }

    onChange = e => this.props.onChangeName(this.props.dot.key, e.target.value);

    changeCoordinateX = e => {this.props.changeCoordinate(this.props.dot.key, e.target.value, this.props.dot.y);};

    changeCoordinateY = e => this.props.changeCoordinate(this.props.dot.key, this.props.dot.x, e.target.value);

    deleteDot = () => this.props.deleteDot(this.props.dot.key);

    render() {

        const divStyle = {
            border: '1px solid ' + this.props.dot.color,
            height: '50px',
        };
        return (
            <div style={divStyle}>
                <div>
                    <span style={{color: this.props.dot.color}}>{this.props.dot.key}) Name: </span>
                    <input style={{width:100}} value={this.props.dot.name} onChange={this.onChange}/>
                </div>
                <div>
                    <input style={{width:50}} onChange={this.changeCoordinateX} type="number" value={this.props.dot.x}/>
                    <input style={{width:50}} onChange={this.changeCoordinateY} type="number" value={this.props.dot.y}/>
                    <button onClick={this.deleteDot}>delete</button>
                </div>
            </div>
        );
    }
}