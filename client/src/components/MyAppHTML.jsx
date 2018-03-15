import React from 'react'
import { BACK_ROOT } from '../api-config';
import { Button, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom';

//Style
const iframeStyle = {
    border: 'none',
    height: '100%',
    width: '100%'
}

const divStyle = {
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
                <Link to="/">
                    <Button icon labelPosition='left'>
                        <Icon name='reply' />
                        Back
                            </Button>
                </Link>
                <iframe title='title' style={iframeStyle} src={url} ></iframe>
            </div>
        )
    }
}