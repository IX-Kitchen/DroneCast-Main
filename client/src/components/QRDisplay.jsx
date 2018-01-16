import React from 'react'
import { Segment, Button, Icon, Header } from 'semantic-ui-react'
import QRCode from 'qrcode.react'
import request from 'superagent'
import { Link } from 'react-router-dom'

export default class QRCodeDisplay extends React.Component {

    constructor() {
        super()
        this.state = {
            appid: "",
            appdata: null
        }
    }

    updateData() {
        request
            .get('http://localhost:8080/api/find/' + this.props.match.params.id)
            .then((response) => {
                const body = response.body
                const data =
                    {
                        appid: body.name,
                        appdata: body.appdata
                    }
                this.setState(data);
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
        return (
            <div>
                <Link to="/">
                    <Button icon labelPosition='left' onClick={this.handleBackClick}>
                        <Icon name='reply' /> Back
                    </Button>
                </Link>
                <Header textAlign='center' as='h2'>{this.state.appid}</Header>
                <Segment style={{ left: '40%', position: 'fixed', top: '25%', zIndex: 1000 }}>
                    {this.state.appdata && <QRCode size={256} value={JSON.stringify(this.state.appdata)} />}
                </Segment>
            </div>
        )
    }
}