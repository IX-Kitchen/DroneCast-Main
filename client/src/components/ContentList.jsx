import React from 'react'
import { Image, Grid, Transition } from 'semantic-ui-react'


export default class Explorer extends React.Component {

    render() {
        const content = this.props.content.slice()

        return (
            <div>
                <Transition.Group
                    as={Grid}
                    duration={200}
                    divided
                    size='big'
                    verticalAlign='middle'>
                    <Grid container columns={3}>
                        {content.map((item, index) => (
                            <Grid.Column key={item}>
                                <Image src='https://picsum.photos/200/?random' rounded />
                            </Grid.Column>
                        ))}
                    </Grid>
                </Transition.Group>
            </div>
        )
    }
}
