import React from 'react'
import { Label, Table, Button, Icon, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import request from 'superagent'
import { API_ROOT } from '../api-config';

export default class AppList extends React.Component {
    constructor() {
        super();
        this.state = { drones: [], ready: false };
        this.deleteDrone = this.deleteDrone.bind(this)
    }
    updateData() {
        request
            .get(API_ROOT + 'drones/list')
            .then((response) => {
                this.setState({ drones: response.body, ready: true });
            })
            .catch((error) => {
                console.log(error)
                return [error]
            })
    }

    deleteDrone(proxy,{id}) {
        console.log(arguments)
        this.setState({ ready: false })
        request
            .delete(API_ROOT + 'drones/delete/' + id)
            .then((response) => {
                this.updateData()
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
        const { drones, ready } = this.state

        return (
            <Segment color='teal' loading={!ready}>
                <Table basic='very'>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Displays</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {drones.map(item => (
                            <Table.Row key={item._id}>
                                <Table.Cell>
                                    <Label color='brown' ribbon>{item.name}</Label>
                                </Table.Cell>
                                <Table.Cell>
                                    <Link to={"/newdrone/" + item._id}>
                                        <Button basic color='black' animated='fade'>
                                            <Button.Content visible>
                                                <Icon name='edit' />
                                            </Button.Content>
                                            <Button.Content hidden>
                                                Edit
                                            </Button.Content>
                                        </Button>
                                    </Link>
                                    <Button basic id={item.name} color='red' animated='fade' onClick={this.deleteDrone}>
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