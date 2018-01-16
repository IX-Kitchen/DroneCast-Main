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
            .get('http://localhost:8080/api/list')
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

    render() {
        const { apps } = this.state

        return (
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>App</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {apps.map(item => (
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
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        );
    }
}