import React from 'react'
import { Transition, Grid, Button } from 'semantic-ui-react'

const CodeFolders = ({ handleClick }) =>
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
                </Grid.Column>
                <Grid.Column>
                    <Button content='Phone' labelPosition='left' value={'Phone'} icon='external' size="big"
                        onClick={handleClick} />
                </Grid.Column>
            </Grid>
        </Transition.Group>
    </div >
export default CodeFolders
