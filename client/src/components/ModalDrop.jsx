import React from 'react'
import { Button, Modal, Icon } from 'semantic-ui-react'
import Dropzone from './Dropzone';

const style = {
    marginTop: '10%',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto'
}

const ModalDrop = ({ index, appid, folderName, getData }) =>

    <Modal closeOnDimmerClick={false} closeIcon style={style} trigger={
        <Button basic color='black' animated='fade'>
            <Button.Content hidden>Upload</Button.Content>
            <Button.Content visible>
                <Icon name='upload' />
            </Button.Content>
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