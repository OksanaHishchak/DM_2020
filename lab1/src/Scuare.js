import React from "react";

export default class Square extends React.Component {
    constructor(props) {
        super(props);
        this.updateConnect = this.updateConnect.bind(this);
        this.changeColor = this.changeColor.bind(this);
    }

    updateConnect = e => this.props.updateConnect(this.props.y,(this.props.l - 1 - this.props.x) , e.target.value) ;

    changeColor = e => e.type === 'mouseout' ? this.props.changeColor(this.props.y,(this.props.l - 1 - this.props.x), 'black') : this.props.changeColor(this.props.y,(this.props.l - 1 - this.props.x), 'red');

    render() {
        const divStyle = {
            background: '#fff',
            border: '1px solid #999',
            float: 'left',
            fontSize: '20px',
            fontWeight: 'bold',
            lineHeight: '24px',
            height: '50px',
            marginRight: '-1px',
            marginTop: '-1px',
            padding: '0',
            textAlign: 'center',
            width: '50px',
        };

        const inputStyle = {
            width: '48px',
            textAlign: 'center'
        };

        if (this.props.y - (this.props.l - 1 - this.props.x) !== 0) {
            return (
                <div style={divStyle} onMouseOut={this.changeColor} onMouseMove={this.changeColor}>
                    <span> {this.props.y + '|' + (this.props.l - 1 - this.props.x)} </span>
                    <input style={inputStyle} value={this.props.w} onChange={this.updateConnect} type="number"/>
                </div>
            );
        } else {
            return (
                <div style={divStyle} onMouseOut={this.changeColor} onMouseMove={this.changeColor}>
                    <span> {this.props.y + '|' + (this.props.l - 1 - this.props.x)} </span>
                </div>
            );
        }

    }
}