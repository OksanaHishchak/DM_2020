import React from "react";

export default class AddNewDot extends React.Component {
    constructor(props) {
        super(props);
        this.onKeyPress = this.onKeyPress.bind(this);
    }

    onKeyPress = e => {
        if (e.key === 'Enter') {
            this.props.addNewDot(e.target.value);
            e.target.value = '';
        }
    };

    render() {
        return (
            <p>
                <span>New Name: </span>
                <input onKeyPress={this.onKeyPress}/>
            </p>
        );
    }
}