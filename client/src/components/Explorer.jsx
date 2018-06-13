import React from 'react'
import { Icon, Button, Grid, Transition, Portal, Segment, Header, Form, Confirm } from 'semantic-ui-react'

const style = {
    marginTop: '10%',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto'
}
export default class Explorer extends React.PureComponent {
    constructor() {
        super()
        this.state = {
            open: false,
            folder: '',
            name: '',
            selected: '',
            confirm: false
        }
        this.changeName = this.changeName.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.openInput = this.openInput.bind(this)
        this.showConfirm = this.showConfirm.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleConfirm = this.handleConfirm.bind(this)
    }
    changeName() {
        const { folder, name } = this.state
        this.props.changeCallback(folder, name)
        this.setState({ name: '' })
    }
    handleInputChange(event) {
        this.setState({ name: event.target.value });
    }
    openInput(event, { value }) {
        this.setState({
            folder: value
        })
    }
    showConfirm(event, { value }) {
        this.setState({ confirm: true, selected: value })
    }
    handleConfirm() {
        this.props.removeCallback(this.state.selected)
        this.setState({ confirm: false })
    }
    handleCancel() {
        this.setState({ confirm: false })
    }
    render() {
        const { folders, addCallback, handleClick } = this.props
        const { confirm } = this.state
        return (
            <div>
                <Confirm open={confirm} style={style}
                    onCancel={this.handleCancel} onConfirm={this.handleConfirm}
                    confirmButton="Delete"
                />
                <Button.Group>
                    <Button positive icon='plus' onClick={addCallback} />
                </Button.Group>
                <Transition.Group
                    as={Grid}
                    duration={200}
                    divided
                    size='huge'
                    verticalAlign='middle'>
                    <Grid container columns={3}>
                        {folders.map((item, index) => (
                            <Grid.Column key={item.name}>
                                <Grid.Row>
                                    <Button labelPosition='left' value={index} icon size="big" onClick={handleClick}>
                                        {item.name}
                                        <Icon name='folder' />
                                    </Button>
                                </Grid.Row>
                                <Grid.Row textAlign='center'>
                                    <Button size='mini' value={item.name} negative animated='fade'
                                        onClick={this.showConfirm}>
                                        <Button.Content visible>
                                            <Icon name='delete' />
                                        </Button.Content>
                                        <Button.Content hidden>
                                            Delete
                                        </Button.Content>
                                    </Button>
                                    <Portal trigger={
                                        <Button size='mini' value={item.name} color='black' basic
                                            animated='fade' onClick={this.openInput}>
                                            <Button.Content visible>
                                                <Icon name='edit' />
                                            </Button.Content>
                                            <Button.Content hidden>
                                                Name
                                            </Button.Content>
                                        </Button>}>
                                        <Segment style={{ left: '40%', position: 'fixed', top: '50%', zIndex: 1000 }}>
                                            <Header>New folder's name</Header>
                                            <Form onSubmit={this.changeName}>
                                                <Form.Input required label='Enter new Name' onChange={this.handleInputChange} />
                                                <Form.Button>Submit</Form.Button>
                                            </Form>
                                        </Segment>
                                    </Portal>
                                </Grid.Row>
                            </Grid.Column>
                        ))}
                    </Grid>
                </Transition.Group>
            </div>
        )
    }
}