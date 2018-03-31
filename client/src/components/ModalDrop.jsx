import React from 'react'
import { Button, Modal, Icon } from 'semantic-ui-react'

const style = {
    marginTop: '10%',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto'
}

const ModalAppUpload = ({ render, header }) =>

    <Modal closeOnDimmerClick={false} closeIcon style={style} trigger={
        <Button basic color= 'black' animated='fade'>
            <Button.Content hidden>Upload</Button.Content>
            <Button.Content visible>
                <Icon name='upload' />
            </Button.Content>
        </Button>
    }>
        <Modal.Header>{header}</Modal.Header>
        <Modal.Content>
            {render()}
        </Modal.Content>
    </Modal>
export default ModalAppUpload