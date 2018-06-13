import React from 'react'
import { Button, Form, Segment, Label } from 'semantic-ui-react'
import request from "superagent"
import { Redirect } from 'react-router-dom';
import { API_ROOT } from '../api-config';
import shortid from 'shortid'

export default class NewAppForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      availableDisplays: [],
      displays: [],
      redirect: false,
      ready: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event, data) {
    const { displays } = this.state
    let newDisplays = displays.slice()
    if (data) {
      if (data.checked) {
        newDisplays = [...newDisplays, data.label]
      } else {
        newDisplays = displays.filter(disp => disp !== data.label)
      }
      this.setState({ displays: newDisplays });
    } else {
      this.setState({ name: event.target.value });
    }
  }

  handleSubmit(event, data) {
    const newAppData = {
      folders: [
        {
          name: "Content",
          type: 'content',
          id: shortid.generate(),
          content: []
        }
      ]
    }
    const postData = {
      displays: this.state.displays,
      name: this.state.name,
      appData: newAppData
    }
    request
      .post(API_ROOT + 'apps/new')
      .send(postData)
      .then((response) => {
        this.setState({ redirect: true })
      })
      .catch((error) => {
        console.log(error)
      })
    event.preventDefault();
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

  render() {
    const { redirect, availableDisplays, ready } = this.state
    return (
      <div>
        <Form onSubmit={this.handleSubmit} size='big'>
          <Form.Field>
            <label>App Name</label>
            <input required placeholder='App Name' name='name' onChange={this.handleChange} />
          </Form.Field>
          <Form.Group grouped>
            <Segment basic loading={!ready}>
              {availableDisplays.length > 0 &&
                <Label pointing='below'>Select the displays for this app</Label>
              }
              {availableDisplays.map(item => (
                <Form.Checkbox key={item._id} label={item.name} onClick={this.handleChange} />
              ))}
            </Segment>

          </Form.Group>
          <Button type='submit' positive>Submit</Button>

        </Form>
        {redirect && (<Redirect to={''} />)}
      </div>
    )
  }
}