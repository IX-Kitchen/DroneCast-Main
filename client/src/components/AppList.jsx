import React from 'react'
import { Label, Table, Button, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import request from 'superagent'

export default class AppList extends React.Component {
    constructor() {
        super();
        this.state = { apps: [] };
    }
    updateData() {
        request
            .get('http://' + window.location.hostname + ':8080/api/apps/list')
            .then((response) => {
                this.setState({ apps: response.body });
            })
            .catch((error) => {
                console.log(error)
                return [error]
            })
    }
    componentDidMount() {
        this.updateData();
    }
    deleteApp(id) {
        request
            .delete('http://' + window.location.hostname + ':8080/api/apps/delete/' + id)
            .then((response) => {
                this.updateData()
                console.log(response.body.response)
            })
            .catch((error) => {
                console.log(error)
                return [error]
            })
    }

    render() {
        const { apps } = this.state
        return (
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Apps</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                        <Table.HeaderCell>Bound drones</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {apps.map((item, index) => (
                        <Table.Row key={item._id}>
                            <Table.Cell>
                                <Label ribbon>{item.name}</Label>
                            </Table.Cell>
                            <Table.Cell>
                                <Link to={"/myapp/" + item._id}>
                                    <Button icon><Icon name='edit' /></Button>
                                </Link>
                                <Link to={"/qr/" + item._id}>
                                    <Button icon><Icon name='qrcode' /></Button>
                                </Link>
                                <Button icon onClick={() => this.deleteApp(item._id)}><Icon name='delete' /></Button>
                            </Table.Cell>
                            <Table.Cell>
                                {apps[index].drones.map(item => (
                                    <Label key={item}>{item}</Label>
                                ))}
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        );
    }
}