import React from 'react'
import { Button, Modal, Icon } from 'semantic-ui-react'
import Dropzone from './Dropzone';

const style = {
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto'
}

const ModalDrop = ({ index, appid, folderName, getData }) =>

    <Modal style={style} trigger={
        <Button icon labelPosition='left'>
            <Icon name='upload' />
            Upload content
                </Button>
    }>
        <Modal.Header>Upload Content</Modal.Header>
        <Modal.Content>
            <Dropzone
                index={index}
                folderName={folderName}
                appid={appid}
                getData={getData} />
        </Modal.Content>
    </Modal>
export default ModalDrop