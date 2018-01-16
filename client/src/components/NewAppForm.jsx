import React from 'react'
import { Button, Form } from 'semantic-ui-react'
import request from "superagent"
import { Link } from 'react-router-dom'
import Redirect from 'react-router-dom/Redirect';

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
      .post('http://localhost:8080/api/new')
      .send(this.state)
      .then((response) => {
        console.log(response.body);

      })
      .catch((error) => {
        console.log(error)
      })
    event.preventDefault();
    this.setState({ redirect: true })
  }
  render() {
    const { redirect } = this.state
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>First Name</label>
            <input placeholder='App Name' name='name' onChange={this.handleChange} />
          </Form.Field>
          <Button type='submit'>Submit</Button>
          
        </Form>
        {redirect && (<Redirect to={''} />)}
      </div>
    )
  }
}