import React from 'react'
import { Button, Modal, Icon } from 'semantic-ui-react'
import AppDropzone from './AppDropzone';

const ModalAppUpload = ({ appid, getData }) =>

    <Modal trigger={
        <Button basic color='black' animated='fade'>
            <Button.Content visible>
                <Icon name='upload' />
            </Button.Content>
            <Button.Content hidden>
                Upload
                    </Button.Content>
        </Button>
    }>
        <Modal.Header>Upload Content</Modal.Header>
        <Modal.Content>
            <AppDropzone
                appid={appid}
                getData={getData} />
        </Modal.Content>
    </Modal>
export default ModalAppUpload