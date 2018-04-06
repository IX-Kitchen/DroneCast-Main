import React from 'react'
import { Label, Table, Button, Icon, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import request from 'superagent'
import { API_ROOT } from '../api-config';

export default class AppList extends React.Component {
    constructor() {
        super();
        this.state = { apps: [], ready: false };
        this.deleteApp = this.deleteApp.bind(this)
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
        this.updateData();
    }
    deleteApp(event, {value}) {
        this.setState({ ready: false })
        request
            .delete(API_ROOT + 'apps/delete/' + value)
            .then((response) => {
                this.updateData()
            })
            .catch((error) => {
                console.log(error)
                return [error]
            })
    }

    render() {
        const { apps, ready } = this.state
        return (
            <Segment color='teal' loading={!ready}>
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
                                    {apps[index].drones.map(item => (
                                        <Label basic color='blue' key={item}>{item}</Label>
                                    ))}
                                </Table.Cell>
                                <Table.Cell>
                                    <Link to={"/myapp/" + item._id + "/edit"}>
                                        <Button basic color='black' animated='fade'>
                                            <Button.Content visible>
                                                <Icon name='edit' />
                                            </Button.Content>
                                            <Button.Content hidden>
                                                Edit
                                            </Button.Content>
                                        </Button>
                                    </Link>
                                    <Link to={"/qr/" + item._id}>
                                        <Button basic color='black' animated='fade'>
                                            <Button.Content visible>
                                                <Icon name='qrcode' />
                                            </Button.Content>
                                            <Button.Content hidden>
                                                QR Code
                                            </Button.Content>
                                        </Button>
                                    </Link>
                                    <Button basic color='red' value={item._id} animated='fade' onClick={this.deleteApp}>
                                        <Button.Content visible>
                                            <Icon name='delete' />
                                        </Button.Content>
                                        <Button.Content hidden>
                                            Delete
                                        </Button.Content>
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