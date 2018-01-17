import React from 'react'
import AppList from './AppList'
import DroneList from './DroneList'
import { Link } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

export default class Main extends React.Component {

    render() {
        return (
            <div>
                <Link to="/newapp">
                    <Button> Create New App </Button>
                </Link>
                <Link to="/newdrone">
                    <Button> Create New Drone </Button>
                </Link>
                <AppList />
                <DroneList/>
            </div>
        );
    }
}