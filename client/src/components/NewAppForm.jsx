import React from 'react'
import { Button, Form, Segment, Label } from 'semantic-ui-react'
import request from "superagent"
import { API_ROOT } from '../api-config';
import shortid from 'shortid'

export default class NewAppForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      displays: []
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

  handleSubmit(event) {
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
        this.props.updateApps()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  render() {
    const { availableDisplays } = this.props
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit} size='big'>
          <Form.Field>
            <label>App Name</label>
            <input required placeholder='App Name' name='name' onChange={this.handleChange} />
          </Form.Field>
          <Form.Group grouped>
            <Segment basic>
              {availableDisplays.length > 0 &&
                <Label pointing='below'>Select the displays for this app</Label>
              }
              {availableDisplays.map(item => (
                <Form.Checkbox key={item._id} label={item.name} onClick={this.handleChange} />
              ))}
            </Segment>
          </Form.Group>
          <Button type='submit' positive>Submit</Button>
          <Button negative onClick={this.props.closePortal} children="Cancel" />
        </Form>
      </React.Fragment>
    )
  }
}