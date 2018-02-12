import React from 'react'
import { Icon, Button, Grid, Transition } from 'semantic-ui-react'

export default class Explorer extends React.Component {

    render() {
        const folders = this.props.folders ? this.props.folders.slice() : []

        return (
            <div>
                <Button.Group>
                    <Button disabled={folders.length === 1} icon='minus' onClick={this.props.removeCallback} />
                    <Button icon='plus' onClick={this.props.addCallback} />
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
                                    <Button labelPosition='left' icon size="big"
                                        onClick={() => this.props.handleClick(index)}>
                                        {item.name}
                                        <Icon name='folder' />
                                    </Button>
                                </Grid.Column>
                            ))}
                        </Grid>
                    </Transition.Group>
            </div>
        )
    }
}
