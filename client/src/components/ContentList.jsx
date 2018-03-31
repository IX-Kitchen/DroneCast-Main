import React from 'react'
import { Embed, Image, Grid, Transition } from 'semantic-ui-react'
import { API_ROOT } from '../api-config';

//const imageExtensions = ['jpg', 'gif', 'bmp', 'png'];
const videoExtensions = ['m4v', 'avi', 'mpg', 'mp4', 'webm']

const ContentList = ({ content }) =>
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
                        {videoExtensions.includes(item.split('.').pop()) ? (
                            <Embed
                                icon='video play outline'
                                url={`${API_ROOT}content/${item}`} />
                        ) : (
                                <Image rounded size="small"
                                    src={`${API_ROOT}content/${item}`} />
                            )}
                    </Grid.Column>
                ))}
            </Grid>
        </Transition.Group>
    </div>
export default ContentList
