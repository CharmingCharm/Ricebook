import React from 'react';
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    IconButton
} from '@mui/material/';
import Login from './components/Login';
import Main from './components/Main';
import './App.css';
import { getUsername, logout } from './util';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loginState: false,
        };
    }

    componentDidMount() {
        getUsername((res) => {
            if(res.username) {
                this.setState({ loginState: true });
            } else {
                this.setState({ loginState: false });
            }
        });
    }

    logout = () => {
        logout();
        this.setState({ loginState: false });
    }

    login = () => {
        this.setState({ loginState: true });
    }

    render() {
        const { loginState } = this.state;
        return (
            <div className="App">
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}
                            >
                            </IconButton>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                Rice Book
                            </Typography>
                            {
                                loginState && 
                                <Button
                                    data-test-id="logout-button"
                                    color="inherit"
                                    onClick={() => {this.logout()}}
                                >Log out</Button>
                            }
                        </Toolbar>
                    </AppBar>
                </Box>
                {
                    (!loginState)
                        ? <Login login={this.login} />
                        : <Main />
                }
            </div>
        );
    }
}
export default App;
