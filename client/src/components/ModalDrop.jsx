import React from 'react'
import { Button, Modal, Icon } from 'semantic-ui-react'
import Dropzone from './Dropzone';

const ModalDrop = ({ index, appid, getData }) =>

    <Modal trigger={
        <Button icon labelPosition='left'>
            <Icon name='upload' />
            Upload content
                </Button>
    }>
        <Modal.Header>Upload Content</Modal.Header>
        <Modal.Content>
            <Dropzone
                index={index}
                appid={appid}
                getData={getData} />
        </Modal.Content>
    </Modal>
export default ModalDrop