import React from 'react'
import { Transition, Grid, Button } from 'semantic-ui-react'
import HTMLDrop from './HTMLDrop';
import ModalDrop from './ModalDrop'

const CodeFolders = ({id, currentFolderName, currentIndex, handleClick }) =>
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
                        onClick={handleClick}/>
                        <ModalDrop render={(header = 'Upload code') => (
                                <HTMLDrop
                                    appid={id}
                                    folder={'Display'}
                                    folderName={currentFolderName}
                                    index={currentIndex}/>
                            )} />
                </Grid.Column>
                <Grid.Column>
                    <Button content='Phone' labelPosition='left' value={'Phone'} icon='external' size="big"
                        onClick={handleClick} />
                        <ModalDrop render={(header = 'Upload code') => (
                                <HTMLDrop
                                    appid={id}
                                    folder={'Phone'}
                                    folderName={currentFolderName}
                                    index={currentIndex}/>
                            )} />
                </Grid.Column>
            </Grid>
        </Transition.Group>
    </div >
export default CodeFolders
