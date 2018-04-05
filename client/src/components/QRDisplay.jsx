import React from 'react'
import { Segment, Button, Icon, Header } from 'semantic-ui-react'
import QRCode from 'qrcode.react'
import request from 'superagent'
import { Link } from 'react-router-dom'
import { API_ROOT } from '../api-config';

export default class QRCodeDisplay extends React.Component {

    constructor() {
        super()
        this.state = {
            ready: false,
            appName: ''
        }
    }

    updateData() {
        request
            .get(API_ROOT + 'apps/find/' + this.props.match.params.id)
            .then((response) => {
                const { body } = response
                this.setState({ appName: body.name, ready: true });
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
        const qrdata = `${API_ROOT}apps/${this.props.match.params.id}/qr`
        const { ready, appName } = this.state
        return (
            <div>
                <Link to="/">
                    <Button icon labelPosition='left'>
                        <Icon name='reply' /> Back
                    </Button>
                </Link>
                <Header textAlign='center' as='h2'>{appName}</Header>
                <Segment loading={!ready} style={{ left: '40%', position: 'fixed', top: '25%', zIndex: 1000 }}>
                    {ready && <QRCode size={256} value={qrdata} />}
                </Segment>
            </div>
        )
    }
}