import React from 'react'
import { Icon, Button, Grid, Transition } from 'semantic-ui-react'

const Explorer = ({ folders, removeCallback, addCallback, handleClick }) =>
    <div>
        <Button.Group>
            <Button positive icon='plus' onClick={addCallback} />
        </Button.Group>
        <Transition.Group
            as={Grid}
            duration={200}
            divided
            size='huge'
            verticalAlign='middle'>
            <Grid container columns={3}>
                {folders.map((item, index) => (
                    <Grid.Column key={item.name}>
                        <Button labelPosition='left' icon size="big" onClick={handleClick}>
                            {item.name}
                            <Icon name='folder' />
                        </Button>
                        <Button size='mini' value={item.name} negative animated='fade' onClick={removeCallback}>
                            <Button.Content visible>
                                <Icon name='delete' />
                            </Button.Content>
                            <Button.Content hidden>
                                Delete
                                </Button.Content>
                        </Button>
                    </Grid.Column>
                ))}
            </Grid>
        </Transition.Group>
    </div>
export default Explorer