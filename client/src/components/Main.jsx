import React from 'react'
import AppList from './AppList'
import DisplayList from './DisplayList'
import { Link } from 'react-router-dom'
import { Button, Menu, Segment } from 'semantic-ui-react'

export default class Main extends React.Component {
    constructor() {
        super();
        this.state = { activeItem: 'home' };
        this.handleItemClick = this.handleItemClick.bind(this);
    }

    handleItemClick(event, data) {
        const { name } = data
        this.setState({ activeItem: name })
    }

    render() {
        const { activeItem } = this.state
        let addButton, list
        switch (activeItem) {
            case "home":
                addButton = <Link to="/newapp">
                    <Button color='green'> Create New App </Button>
                </Link>
                list = <AppList />
                break
            case 'displays':
                addButton = <Link to="/newdisplay">
                    <Button color='green'> Create New Display </Button>
                </Link>
                list = <DisplayList />
                break
            default:
        }
        return (
            <div>
                <Menu pointing secondary>
                    <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick} />
                    <Menu.Item name='displays' active={activeItem === 'displays'} onClick={this.handleItemClick} />
                </Menu>
                <Segment color='blue'>
                    {addButton}
                    {list}
                </Segment>
            </div>
        );
    }
}