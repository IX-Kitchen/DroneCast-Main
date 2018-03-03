import React from 'react'
import { Button, Modal, Icon } from 'semantic-ui-react'
import Dropzone from './Dropzone';

export default class ModalDrop extends React.Component {

    render() {
        return (
            <Modal trigger={<Button icon labelPosition='left'>
                <Icon name='upload' />
                Upload content
                </Button>}>
                <Modal.Header>Upload Content</Modal.Header>
                <Modal.Content>
                    <Dropzone
                        index={this.props.index}
                        appid={this.props.appid}
                        getData={this.props.getData} />
                </Modal.Content>
            </Modal>
        )
    }
}