import React from 'react'
import { Label, Table, Button, Icon, Segment, Confirm, Modal } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import request from 'superagent'
import { API_ROOT } from '../api-config';
import QRCodeDisplay from './QRDisplay';

const style = {
    marginTop: '10%',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto'
}
export default class AppList extends React.Component {
    constructor() {
        super();
        this.state = { confirm: false, selected: '' };
        this.deleteApp = this.deleteApp.bind(this)
        this.showConfirm = this.showConfirm.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleConfirm = this.handleConfirm.bind(this)
    }
    updateData() {
        request
            .get(API_ROOT + 'apps/list')
            .then((response) => {
                this.setState({ apps: response.body, ready: true });
            })
            .catch((error) => {
                console.log(error)
                return [error]
            })
    }
    componentDidMount() {
        //this.updateData();
    }
    deleteApp(appid) {
        this.setState({ ready: false })
        request
            .delete(API_ROOT + 'apps/delete/' + appid)
            .then((response) => {
                this.updateData()
            })
            .catch((error) => {
                console.log(error)
                return [error]
            })
    }
    showConfirm(event, { value }) {
        this.setState({ confirm: true, selected: value })
    }
    handleConfirm() {
        this.props.deleteApp(this.state.selected)
        this.setState({ confirm: false })
    }
    handleCancel() {
        this.setState({ confirm: false })
    }

    render() {
        const { confirm } = this.state
        const { apps, ready } = this.props
        return (
            <Segment color='red' loading={!ready || apps === null}>
                <Confirm open={confirm} style={style}
                    onCancel={this.handleCancel} onConfirm={this.handleConfirm}
                    confirmButton="Delete"
                />
                <Table basic='very'>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Apps</Table.HeaderCell>
                            <Table.HeaderCell>Bound displays</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {apps.map((item, index) => (
                            <Table.Row key={item._id}>
                                <Table.Cell>
                                    <Label color='brown' ribbon>{item.name}</Label>
                                </Table.Cell>
                                <Table.Cell>
                                    {apps[index].displays.map(item => (
                                        <Label basic key={item}>{item}</Label>
                                    ))}
                                </Table.Cell>
                                <Table.Cell>
                                    <Link to={"/myapp/" + item._id + "/edit"}>
                                        <Button basic color='black' animated='fade'>
                                            <Button.Content visible content={<Icon name='edit' />}/>
                                            <Button.Content hidden content='Edit'/>
                                        </Button>
                                    </Link>
                                    <Modal header={item.name} closeIcon trigger={
                                        <Button basic color='black' animated='fade'>
                                            <Button.Content visible content={<Icon name='qrcode' />} />
                                            <Button.Content hidden content="QR Code" />
                                        </Button>
                                    }
                                        content={<QRCodeDisplay app={item} />} />
                                    <Button basic color='red' value={item._id} animated='fade' onClick={this.showConfirm}>
                                        <Button.Content visible content={<Icon name='delete' />}/>
                                        <Button.Content hidden content='Delete'/>
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </Segment>
        );
    }
}