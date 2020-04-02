import React from 'react';

class TestReader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: ''
        };
        this.onChange = this.onChange.bind(this);
    }

    onChange = (e) => {
        let reader = new FileReader();
        reader.readAsText(e.target.files[0]);
        reader.onload = (e) => this.props.uploadDots(e.target.result);
    };

    render() {
        return (
            <p>
                <input type="file" name="file" onChange={this.onChange}/>
            </p>
        );
    }
}

export default TestReader;