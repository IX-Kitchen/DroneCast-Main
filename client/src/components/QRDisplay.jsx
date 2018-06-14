import React from 'react'
import { Segment, Header } from 'semantic-ui-react'
import QRCode from 'qrcode.react'
import request from 'superagent'
import { API_ROOT } from '../api-config';

const style = {
    margin: '0 auto',
    height: 'auto',
    width: '100%'
}
const divStyle = {
     margin: '0 auto',
     width: '30%'
}
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
            <div style={divStyle}>
                <Header textAlign='center' as='h2'>{appName}</Header>
                <Segment basic loading={!ready} style={style}>
                    {ready && <QRCode style={style} size={256} value={qrdata} />}
                </Segment>
            </div>
        )
    }
}