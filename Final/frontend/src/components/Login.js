import * as React from 'react';
import {
    Button,
    CssBaseline,
    TextField,
    FormControlLabel,
    Checkbox,
    Link,
    Grid,
    Box,
    Typography,
    Container,
    Card,
    Dialog,
    Snackbar,
    Alert
} from '@mui/material/';
import Register from './Register';
import { login } from '../util';


class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            inputAName: "",
            inputPassword: "",
            feedbackOpen: false,
        };
    }

    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleInputAName = (event) => {
        this.setState({inputAName: event.target.value});
    };

    handlePasswordInput = (event) => {
        this.setState({inputPassword: event.target.value});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    handleSubmit = (event) => {
        const {inputAName, inputPassword} = this.state;
        login(inputAName, inputPassword, (res) => {
            if(res.result == 'success') {
                this.props.login();
            } else {
                this.setState({feedbackOpen: true});
            }
        });
    };

    render() {
        const {open,inputAName,inputPassword,feedbackOpen} = this.state;
        return (
            <>
                <Container component="main" maxWidth="xs">
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Card sx={{ minWidth: 500 }}>
                            <Container sx={{ padding: 5, width: 400 }}>
                                <Typography component="h1" variant="h5">
                                    Sign in
                                </Typography>
                                <Box component="form" onSubmit={this.handleSubmit} noValidate sx={{ mt: 1 }}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="aName"
                                        label="Account Name"
                                        name="aName"
                                        data-test-id="login-username"
                                        autoFocus
                                        value={inputAName}
                                        onChange={this.handleInputAName}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        data-test-id="login-password"
                                        value={inputPassword}
                                        onChange={this.handlePasswordInput}
                                    />
                                    <FormControlLabel
                                        control={<Checkbox value="remember" color="primary" />}
                                        label="Remember me"
                                    />
    
                                    <Grid container>
                                        <Grid item xs={12} sm={6}>
                                            <Button
                                                variant="contained"
                                                sx={{ mt: 3, mb: 2 }}
                                                onClick={this.handleSubmit}
                                                data-test-id="login-button"
                                                id="login-button"
                                            >
                                                Sign In
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Button
                                                sx={{ mt: 3, mb: 2 }}
                                                data-test-id="login-register"
                                                onClick={this.handleClickOpen}
                                            >
                                                Sign Up
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Container>
                        </Card>
                    </Box>
                </Container>
                <Dialog
                    open={open}
                    onClose={this.handleClose}
                >
                    <Register register={this.props.register} checkUser={this.props.checkUser} />
                </Dialog>
                <Snackbar open={feedbackOpen} onClose={() => {this.setState({feedbackOpen: false})}} autoHideDuration={4000}>
                    <Alert severity="error" sx={{ width: '100%' }}>
                        Wrong account name or password!
                    </Alert>
                </Snackbar>
            </>
        );
    }
    
}

export default Login;