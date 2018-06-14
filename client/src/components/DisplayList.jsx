import React from 'react'
import { Label, Table, Button, Icon, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import request from 'superagent'
import { API_ROOT } from '../api-config';

export default class DisplayList extends React.Component {
    constructor() {
        super();
        this.state = { displays: [], ready: false };
        this.deleteDisplay = this.deleteDisplay.bind(this)
    }
    updateData() {
        request
            .get(API_ROOT + 'displays/list')
            .then((response) => {
                this.setState({ displays: response.body, ready: true });
            })
            .catch((error) => {
                console.log(error)
                return [error]
            })
    }

    deleteDisplay(proxy, { id }) {
        this.setState({ ready: false })
        request
            .delete(API_ROOT + 'displays/delete/' + id)
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
        const { displays, ready } = this.state

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
                        {displays.map(item => (
                            <Table.Row key={item._id}>
                                <Table.Cell>
                                    <Label color='brown' ribbon>{item.name}</Label>
                                </Table.Cell>
                                <Table.Cell>
                                    <Link to={"/newdisplay/" + item._id}>
                                        <Button basic color='black' animated='fade'>
                                            <Button.Content visible>
                                                <Icon name='edit' />
                                            </Button.Content>
                                            <Button.Content hidden>
                                                Edit
                                            </Button.Content>
                                        </Button>
                                    </Link>
                                    <Button basic id={item.name} color='red' animated='fade' onClick={this.deleteDisplay}>
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