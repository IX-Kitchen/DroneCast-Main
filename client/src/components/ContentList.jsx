import React from 'react'
import { Image, Grid, Transition } from 'semantic-ui-react'
import { API_ROOT } from '../api-config';


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
                                <Image rounded size="small"
                                    src={API_ROOT + 'content/' + item} />
                            </Grid.Column>
                        ))}
                    </Grid>
                </Transition.Group>
            </div>
        )
    }
}
