import React from 'react'
import { List } from 'semantic-ui-react'

const CodeList = ({ code }) =>
    <div>
        <List>
            <List.Item>
                <List.Icon name='folder' />
                <List.Content>
                    <List.Header>Phone</List.Header>
                    <List.Description>Source files for phone client</List.Description>
                    <List.List>
                        {code.phone.map(item => (
                            <List.Item>
                                <List.Icon name='file' />
                                <List.Content>
                                    <List.Header>{item}</List.Header>
                                </List.Content>
                            </List.Item>
                        ))}
                    </List.List>
                </List.Content>
            </List.Item>
            <List.Item>
                <List.Icon name='folder' />
                <List.Content>
                    <List.Header>Drone</List.Header>
                    <List.Description>Source files for drone client</List.Description>
                    <List.List>
                        {code.drone.map(item => (
                            <List.Item>
                                <List.Icon name='file' />
                                <List.Content>
                                    <List.Header>{item}</List.Header>
                                </List.Content>
                            </List.Item>
                        ))}
                    </List.List>
                </List.Content>
            </List.Item>
        </List>
    </div>
export default CodeList
