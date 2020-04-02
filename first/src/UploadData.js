import React from 'react';

class UploadData extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange = (e) => {
        let reader = new FileReader();
        reader.readAsText(e.target.files[0]);
        reader.onload = (e) => this.props.uploadData(JSON.parse(e.target.result));
    };

    render() {
        return (
            <p>
                <input type="file" name="file" onChange={this.onChange}/>
            </p>
        );
    }
}

export default UploadData;