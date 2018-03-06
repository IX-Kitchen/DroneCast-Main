import React from 'react'
import { Button, Form } from 'semantic-ui-react'
import request from "superagent"
import { Redirect } from 'react-router-dom';
import { API_ROOT } from '../api-config';

export default class NewAppForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      redirect: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  handleSubmit(event) {
    const { name } = this.state
    const { id } = this.props.match.params
    if (id) {
      request
        .put(API_ROOT + 'drones/edit/' + id)
        .send({ name: name })
        .then((response) => {
          this.setState({ redirect: true })
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      request
        .post(API_ROOT + 'drones/new')
        .send({ name: name })
        .then((response) => {
          this.setState({ redirect: true })
        })
        .catch((error) => {
          console.log(error)
        })
    }
    event.preventDefault();
  }
  render() {
    const { redirect } = this.state
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Drone Name</label>
            <input placeholder='App Name' name='name' onChange={this.handleChange} />
          </Form.Field>
          <Button type='submit'>Submit</Button>

        </Form>
        {redirect && (<Redirect to={''} />)}
      </div>
    )
  }
}