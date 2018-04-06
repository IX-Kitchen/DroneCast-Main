import React from 'react'
import AppList from './AppList'
import DroneList from './DroneList'
import { Link } from 'react-router-dom'
import { Button, Menu, Segment } from 'semantic-ui-react'

export default class Main extends React.Component {
    constructor() {
        super();
        this.state = { activeItem: 'apps' };
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
            case "apps":
                addButton = <Link to="/newapp">
                    <Button color='green'> Create New App </Button>
                </Link>
                list = <AppList />
                break
            case 'displays':
                addButton = <Link to="/newdrone">
                    <Button color='green'> Create New Display </Button>
                </Link>
                list = <DroneList />
                break
            default:
            }
        return (
            <div>
                <Menu tabular>
                    <Menu.Item name='apps' active={activeItem === 'apps'} onClick={this.handleItemClick} />
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