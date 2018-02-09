import React from 'react'
import { Segment, Button, Icon, Header } from 'semantic-ui-react'
import QRCode from 'qrcode.react'
import request from 'superagent'
import { Link } from 'react-router-dom'
import { API_ROOT, SOCKET_PORT, SOCKET_ROOT } from '../api-config';

export default class QRCodeDisplay extends React.Component {

    constructor() {
        super()
        this.state = {}
    }

    updateData() {
        request
            .get(API_ROOT + 'apps/find/' + this.props.match.params.id)
            .then((response) => {
                const { body } = response
                this.setState(body);
            })
            .catch((error) => {
                console.log(error)
                return [error]
            })
    }

    componentDidMount() {
        this.updateData()
    }

    render() {
        const qrdata = { appdata: API_ROOT + 'apps/find/' + this.props.match.params.id }
        qrdata['socketUrl'] = SOCKET_ROOT
        qrdata['socketPort'] = SOCKET_PORT
        return (
            <div>
                <Link to="/">
                    <Button icon labelPosition='left'>
                        <Icon name='reply' /> Back
                    </Button>
                </Link>
                <Header textAlign='center' as='h2'>{this.state.appid}</Header>
                <Segment style={{ left: '40%', position: 'fixed', top: '25%', zIndex: 1000 }}>
                    {this.state.appdata && <QRCode size={256} value={JSON.stringify(qrdata)} />}
                </Segment>
            </div>
        )
    }
}