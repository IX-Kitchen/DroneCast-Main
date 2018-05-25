import React from 'react'
import { Transition, Grid, Button, Icon } from 'semantic-ui-react'
import HTMLDrop from './HTMLDrop';
import ModalDrop from './ModalDrop'

const CodeFolders = ({ appid, folderId, currentIndex, handleClick, downloadClick }) =>
    <div>
        <Transition.Group
            as={Grid}
            duration={200}
            divided
            size='big'
            verticalAlign='middle'>
            <Grid container columns={2}>
                <Grid.Column>
                    <Button content='Display' labelPosition='left' value={'Display'} icon='external' size="big"
                        onClick={handleClick} />
                    <ModalDrop render={(header = 'Upload code') => (
                        <HTMLDrop
                            appid={appid}
                            folderName={'Display'}
                            folderId={folderId}
                            index={currentIndex} />
                    )} />
                    <Button basic color='black' animated='fade' value={'Display'} onClick={downloadClick}>
                        <Button.Content hidden>Download</Button.Content>
                        <Button.Content visible>
                            <Icon name='download' />
                        </Button.Content>
                    </Button>
                </Grid.Column>
                <Grid.Column>
                    <Button content='Phone' labelPosition='left' value={'Phone'} icon='external' size="big"
                        onClick={handleClick} />
                    <ModalDrop render={(header = 'Upload code') => (
                        <HTMLDrop
                            appid={appid}
                            folderName={'Phone'}
                            folderId={folderId}
                            index={currentIndex} />
                    )} />
                    <Button basic color='black' animated='fade' value={'Phone'} onClick={downloadClick}>
                        <Button.Content hidden>Download</Button.Content>
                        <Button.Content visible>
                            <Icon name='download' />
                        </Button.Content>
                    </Button>
                </Grid.Column>
            </Grid>
        </Transition.Group>
    </div>
export default CodeFolders
