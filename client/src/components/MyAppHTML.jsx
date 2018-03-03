import React from 'react'
import { BACK_ROOT } from '../api-config';

//Style
const iframeStyle = {
    border: 'none',
    height: '100%',
    width: '100%'
}

const divStyle = {
    border: 'none',
    height: '100%',
    width: '100%'
}

export default class MyAppHTML extends React.Component {

    shouldComponentUpdate() {
        return false;
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        const url = `${BACK_ROOT}/${this.props.match.params.id}`
        return (
            <div style={divStyle}>
                <iframe title='title' style={iframeStyle} src={url} ></iframe>
            </div>
        )
    }
}