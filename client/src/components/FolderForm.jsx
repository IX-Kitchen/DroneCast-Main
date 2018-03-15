import React from 'react'
import { Button, Form } from 'semantic-ui-react'

export default class FolderForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            type: 'content',
        };
        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleTypeChange = this.handleTypeChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleTypeChange(e, { value }) {
        this.setState({ type: value });
    }

    handleNameChange(event) {
        this.setState({ name: event.target.value });
    }

    handleSubmit(event) {
        const {name, type } = this.state
        
        this.props.addCallback(name, type)
        
        event.preventDefault();
    }
    render() {
        const {type} = this.state
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Field>
                        <label>Folder Name</label>
                        <input required placeholder='App Name' onChange={this.handleNameChange} />
                    </Form.Field>
                    <Form.Group inline>
                        <label>Size</label>
                        <Form.Radio label='Content' value='content' checked={type === 'content'} onChange={this.handleTypeChange} />
                        <Form.Radio label='Code' value='code' checked={type === 'code'} onChange={this.handleTypeChange} />
                    </Form.Group>
                    <Button type='submit'>Submit</Button>

                </Form>
            </div>
        )
    }
}