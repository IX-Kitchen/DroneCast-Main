import React from 'react'
import { Embed, Modal, Image, Grid, Transition, Label, Segment } from 'semantic-ui-react'
import { API_ROOT } from '../api-config';

//const imageExtensions = ['jpg', 'gif', 'bmp', 'png'];
const videoExtensions = ['m4v', 'avi', 'mpg', 'mp4', 'webm']
const nameLength = 17
const modalStyle = {
    marginTop: '5%',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto'
}
const imageStyle = {
    width: '50%',
    margin: '0 auto'
}

const ContentList = ({ content, onClick, appid}) =>
    <Transition.Group
        as={Grid}
        duration={200}
        divided
        size='big'
        verticalAlign='middle'>
        <Grid container columns={3}>
            {content.map((item, index) => (
                <Grid.Column key={item}>
                    <Grid.Row>
                        <Segment compact basic>
                            <Label attached='bottom' size="medium">
                                {item.length < nameLength ? item : `${item.substr(0, nameLength)}...`}
                            </Label>
                            <Label as='a' attached='bottom right' size="medium" icon='delete' value={item} onClick={onClick} />
                            {videoExtensions.includes(item.split('.').pop()) ? (
                                <Modal style={modalStyle} basic size="small"
                                    trigger={<video width="150" height="84,4">
                                        <source src={`${API_ROOT}apps/${appid}/content/${item}`} />
                                    </video>}>
                                    <Modal.Header>{item}</Modal.Header>
                                    <Modal.Content>
                                        <Embed
                                            icon='video play'
                                            url={`${API_ROOT}apps/${appid}/content/${item}`} />
                                    </Modal.Content>
                                </Modal>
                            ) : (
                                    <Modal style={modalStyle} basic
                                        trigger={<Image rounded size="small"
                                            src={`${API_ROOT}apps/${appid}/content/${item}`} />}>
                                        <Modal.Header style={imageStyle}>{item}</Modal.Header>
                                        <Modal.Content style={imageStyle}>
                                            <Image rounded size="big"
                                                src={`${API_ROOT}apps/${appid}/content/${item}`} />
                                        </Modal.Content>
                                    </Modal>
                                )}
                        </Segment>
                    </Grid.Row>
                </Grid.Column>
            ))}
        </Grid>
    </Transition.Group>
export default ContentList
