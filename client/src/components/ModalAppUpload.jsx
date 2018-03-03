import React from 'react'
import { Button, Modal, Icon } from 'semantic-ui-react'
import AppDropzone from './AppDropzone';

export default class ModalAppUpload extends React.Component {

    render() {
        return (
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
                        appid={this.props.appid}
                        getData={this.props.getData} />
                </Modal.Content>
            </Modal>
        )
    }
}