import React from 'react'
import AppList from './AppList'
import { Link } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

export default class Main extends React.Component {

    render() {
        return (
            <div>
                <Link to="/newapp">
                    <Button> Create New App </Button>
                </Link>
                <AppList />
            </div>
        );
    }
}