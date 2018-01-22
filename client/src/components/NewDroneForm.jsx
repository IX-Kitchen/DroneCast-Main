import React from 'react'
import { Button, Form } from 'semantic-ui-react'
import request from "superagent"
import { Redirect } from 'react-router-dom';

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
    request
      .post('http://'+window.location.hostname+':8080/api/drones/new')
      .send(this.state)
      .then((response) => {
        this.setState({ redirect: true })
      })
      .catch((error) => {
        console.log(error)
      })
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