import React from 'react'
import { Label, Table, Button, Icon, Segment, Modal, Form } from 'semantic-ui-react'
import { API_ROOT } from '../api-config';
import request from "superagent"

const style = {
    marginTop: '10%',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto'
}

export default class DisplaysEdition extends React.Component {
    constructor() {
        super();
        this.state = {
            ready: false,
            availableDisplays: [],
            modalOpen: false,
            selectedDisplays: []
        };
        this.handleOpenModal = this.handleOpenModal.bind(this)
        this.handleClose = this.handleClose.bind(this)
    }

    componentDidMount() {
        request
            .get(API_ROOT + 'displays/list')
            .then((response) => {
                this.setState({ availableDisplays: response.body, ready: true });
            })
            .catch((error) => {
                console.log(error)
                return [error]
            })
    }

    handleOpenModal() {
        this.setState({ modalOpen: true });
    }

    handleClose() {
        this.setState({ modalOpen: false })
    }

    handleSubmit = () => {
        this.props.handleUpdateDisplays(this.state.selectedDisplays)
        this.setState({ modalOpen: false })
    }

    handleChange = (event, data) => {
        console.log('data', data)
        const { selectedDisplays } = this.state
        let newDisplays = selectedDisplays.slice()
        console.log(data)
        if (data.checked) {
            newDisplays = [...newDisplays, data.label]
        } else {
            newDisplays = selectedDisplays.filter(disp => disp !== data.label)
        }
        this.setState({ selectedDisplays: newDisplays });
    }

    render() {
        const { displays, handleRemoveDisplay } = this.props
        const { availableDisplays, ready, modalOpen } = this.state
        console.log(this.state)

        return (
            <div>
                <Button basic color='green' onClick={this.handleOpenModal}>
                    Add display to app
                    </Button>
                <Modal style={style} closeIcon onClose={this.handleClose}
                    open={modalOpen}>
                    <Modal.Header>Select one from the available displays</Modal.Header>
                    <Modal.Content>
                        <Form loading={!ready}>
                            <Form.Group grouped>
                                {availableDisplays.map(item => (
                                    <Form.Checkbox key={item._id} label={item.name} onChange={this.handleChange} />
                                ))}
                            </Form.Group>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='green' onClick={this.handleSubmit} inverted>
                            <Icon name='checkmark' /> Submit
                        </Button>
                    </Modal.Actions>
                </Modal>
                <Segment color='teal'>
                    <Table basic='very'>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Displays</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {displays.map(item => (
                                <Table.Row key={item}>
                                    <Table.Cell>
                                        <Label color='brown' ribbon>{item}</Label>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button basic id={item}
                                            color='red' animated='fade' onClick={handleRemoveDisplay}>
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
            </div>
        );
    }
}