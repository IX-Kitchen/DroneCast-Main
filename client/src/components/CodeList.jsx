import React from 'react'
import { List } from 'semantic-ui-react'
import ModalAppUpload from './ModalAppUpload'

const CodeList = ({ code, appid, getData, folderName, index }) =>
    <div>
        <List>
            <List.Item>
                <List.Icon name='folder' />
                <List.Content>
                    <List.Header>
                        Phone
                        <ModalAppUpload
                            appid={appid} getData={getData}
                            folder='phone'
                            index={index}
                            folderName={folderName} />
                    </List.Header>
                    <List.List>
                        {code.phone.map(item => (
                            <List.Item key={item}>
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
                    <List.Header>
                        Drone
                        <ModalAppUpload
                            appid={appid} getData={getData}
                            folder='drone'
                            index={index}
                            folderName={folderName} />
                    </List.Header>

                    <List.List>
                        {code.drone.map(item => (
                            <List.Item key={item}>
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
