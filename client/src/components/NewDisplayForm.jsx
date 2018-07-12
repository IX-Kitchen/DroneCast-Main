import React from 'react'
import { Button, Form } from 'semantic-ui-react'
import request from "superagent"
import { API_ROOT } from '../api-config';

export default class NewAppForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  handleSubmit(event) {
    const { name } = this.state
    const {editDisplay} = this.props
    
    if (editDisplay !== undefined) {
      request
        .put(API_ROOT + 'displays/edit/' + editDisplay)
        .send({ name: name })
        .then((response) => {
          this.props.updateDisplays()
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      request
        .post(API_ROOT + 'displays/new')
        .send({ name: name })
        .then((response) => {
          this.props.updateDisplays()
        })
        .catch((error) => {
          console.log(error)
        })
    }
    event.preventDefault();
  }
  render() {
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Display Name</label>
            <input required placeholder='App Name' name='name' onChange={this.handleChange} />
          </Form.Field>
          <Button type='submit'>Submit</Button>
          <Button negative onClick={this.props.closePortal} children="Cancel"/>
        </Form>
      </React.Fragment>
    )
  }
}