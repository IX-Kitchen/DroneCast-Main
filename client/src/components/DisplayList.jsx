import React from 'react'
import { Label, Table, Button, Icon, Segment } from 'semantic-ui-react'

const DisplayList = ({ displays, deleteDisplay, ready, handleEditDisplay }) =>

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
              <Button basic color='black' animated='fade' id={item._id} onClick={handleEditDisplay}>
                <Button.Content visible>
                  <Icon name='edit' />
                </Button.Content>
                <Button.Content hidden>
                  Edit
                    </Button.Content>
              </Button>
              <Button basic id={item.name} color='red' animated='fade' onClick={deleteDisplay}>
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
  
  export default DisplayList