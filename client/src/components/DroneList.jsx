import React from 'react'
import { Label, Table, Button, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import request from 'superagent'

export default class AppList extends React.Component {
    constructor() {
        super();
        this.state = { drones: [] };
    }
    updateData() {
        request
            .get('http://' + window.location.hostname + ':8080/api/drones/list')
            .then((response) => {
                this.setState({ drones: response.body });
            })
            .catch((error) => {
                console.log(error)
                return [error]
            })
    }

    deleteDrone(id) {
        request
            .delete('http://' + window.location.hostname + ':8080/api/drones/delete/' + id)
            .then((response) => {
                this.updateData()
                console.log(response.body.response)
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
        const { drones } = this.state

        return (
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Drones</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {drones.map(item => (
                        <Table.Row key={item._id}>
                            <Table.Cell>
                                <Label ribbon>{item.name}</Label>
                            </Table.Cell>
                            <Table.Cell>
                                <Link to={"/myapp/" + item._id}>
                                    <Button icon><Icon name='edit' /></Button>
                                </Link>
                                <Button icon onClick={() => this.deleteDrone(item.name)}><Icon name='delete' /></Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        );
    }
}