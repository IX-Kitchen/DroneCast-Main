import React from 'react'
import { Button, Modal, Icon } from 'semantic-ui-react'
import AppDropzone from './AppDropzone';

const style = {
    marginTop: '10%',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto'
}

const ModalAppUpload = ({ appid, getData, folder, folderName, index }) =>

    <Modal closeOnDimmerClick={false} closeIcon style={style} trigger={
        <Button size='mini' basic color='black'>
            <Icon name='upload' />
        </Button>
    }>
        <Modal.Header>Upload Content</Modal.Header>
        <Modal.Content>
            <AppDropzone
                appid={appid}
                folder={folder}
                folderName={folderName}
                index={index}
                getData={getData} />
        </Modal.Content>
    </Modal>
export default ModalAppUpload