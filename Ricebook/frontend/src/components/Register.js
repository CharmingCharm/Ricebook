import React from 'react';
import { register } from '../util';
import {
    Avatar,
    Alert,
    Button,
    Box,
    Container,
    Grid,
    Snackbar,
    TextField,
    Typography
} from '@mui/material/';

class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            birthday: "",
            aName: "",
            dName: "",
            email: "",
            phone: "",
            zipcode: "",
            password: "",
            confirmPwd: "",
            checkRes: [0, 0, 0, 0, 0, 0],
            checkMsg: ["", "", "", "", "", ""],
            open: false,
            Msg: "",
            flag: 'success',
        }
    }

    handleSubmit = (event) => {
        const { birthday,aName,dName,email,phone,zipcode,password,checkRes } = this.state;
        let res = 0;
        for (let i = 0; i < checkRes.length; i++) {
            res += checkRes[i];
        }
        if (res == 24) {
            register(aName, dName, password, email, phone, birthday, zipcode, (res) => {
                if(res.result == "success") {
                    this.setState({ flag: 'success', Msg: res.username + " is registered successfully", open: true });
                } else {
                    this.setState({ flag: 'error', Msg: res.Msg, open: true });
                }
            });
        }
    };

    render() {
        const { birthday,
            aName,
            dName,
            email,
            phone,
            zipcode,
            password,
            confirmPwd,
            checkRes,
            checkMsg,
            open,
            Msg,
            flag
        } = this.state;
        return (
            <>
                <Container component="main" maxWidth="md">
                    <Box
                        sx={{
                            marginTop: 4,
                            marginBottom: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            Sign up
                        </Typography>
                        <Box component="form" noValidate onSubmit={this.handleSubmit} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="accountName"
                                        required
                                        fullWidth
                                        error={checkRes[0] != 4 && checkRes[0] != 0}
                                        id="accountName"
                                        label="Account Name"
                                        autoFocus
                                        value={aName}
                                        helperText={checkMsg[0]}
                                        onChange={(event) => {
                                            let tempValue = event.target.value;
                                            const check = new RegExp("^[a-zA-Z]{1}\w*");
                                            if (!check.test(tempValue)) {
                                                if (tempValue[0] >= '0' && tempValue[0] <= '9') {
                                                    checkRes[0] = 1;
                                                    checkMsg[0] = "First character should be a letter!";
                                                } else {
                                                    checkRes[0] = 2;
                                                    checkMsg[0] = "Only letters and numbers!";
                                                }
                                            } else {
                                                checkRes[0] = 4;
                                                checkMsg[0] = "";
                                            }
                                            this.setState({
                                                aName: tempValue
                                            });
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="displayName"
                                        label="Display Name(Optional)"
                                        name="displayName"
                                        value={dName}
                                        onChange={(event) => {
                                            this.setState({
                                                dName: event.target.value
                                            });
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        error={checkRes[1] != 4 && checkRes[1] != 0}
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        value={email}
                                        helperText={checkMsg[1]}
                                        onChange={(event) => {
                                            let tempValue = event.target.value;
                                            const check = new RegExp("[^\\W_]+@[^\\W_]+\\.[^\\W_]+");
                                            if (!check.test(tempValue)) {
                                                checkRes[1] = 1;
                                                checkMsg[1] = "Email form incorrect!";
                                            } else {
                                                checkRes[1] = 4;
                                                checkMsg[1] = "";
                                            }
                                            this.setState({
                                                email: tempValue
                                            });
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        error={checkRes[2] != 4 && checkRes[2] != 0}
                                        id="phone"
                                        label="Phone Number"
                                        name="phone"
                                        value={phone}
                                        helperText={checkMsg[2]}
                                        onChange={(event) => {
                                            let tempValue = event.target.value;
                                            const check = new RegExp("^\\d{3}-\\d{3}-\\d{4}$");
                                            if (!check.test(tempValue)) {
                                                checkRes[2] = 1;
                                                checkMsg[2] = "Format like 123-123-1234!";
                                            } else {
                                                checkRes[2] = 4;
                                                checkMsg[2] = "";
                                            }
                                            this.setState({
                                                phone: tempValue
                                            });
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        error={checkRes[3] != 4 && checkRes[3] != 0}
                                        id="zipcode"
                                        label="Zipcode"
                                        name="zipcode"
                                        // autoComplete="phone"
                                        inputProps={{ pattern: "\d{5}" }}
                                        value={zipcode}
                                        helperText={checkMsg[3]}
                                        onChange={(event) => {
                                            let tempValue = event.target.value;
                                            const check = new RegExp("^\\d{5}\$");
                                            if (!check.test(tempValue)) {
                                                checkRes[3] = 1;
                                                checkMsg[3] = "5 digits for a zipcode";
                                            } else {
                                                checkRes[3] = 4;
                                                checkMsg[3] = "";
                                            }
                                            this.setState({
                                                zipcode: tempValue
                                            });
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        error={checkRes[4] != 4 && checkRes[4] != 0}
                                        name="birthday"
                                        type="date"
                                        id="birthday"
                                        value={birthday}
                                        helperText={"Birthday(Over 18 years old)"}
                                        onChange={(event) => {
                                            let tempValue = event.target.value.split("-");
                                            let currDate = new Date();
                                            checkRes[4] = 4;
                                            checkMsg[4] = "";
                                            if (tempValue[0] > currDate.getFullYear() - 18) {
                                                checkRes[4] = 1;
                                                checkMsg[4] = "User should be over 18!";
                                            } else if (tempValue[0] == currDate.getFullYear() - 18) {
                                                if (birthday[1] > currDate.getMonth() + 1) {
                                                    checkRes[4] = 1;
                                                    checkMsg[4] = "User should be over 18!";
                                                } else if (tempValue[1] == currDate.getMonth() + 1) {
                                                    if (tempValue[2] > currDate.getDate()) {
                                                        checkRes[4] = 1;
                                                        checkMsg[4] = "User should be over 18!";
                                                    }
                                                }
                                            }
                                            this.setState({
                                                birthday: tempValue[0] + "-" + tempValue[1] + "-" + tempValue[2]
                                            });
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="new-password"
                                        value={password}
                                        onChange={(event) => {
                                            let tempValue = event.target.value
                                            checkRes[5] = 4;
                                            checkMsg[5] = "";
                                            if (tempValue !== password) {
                                                checkRes[5] = 1;
                                                checkMsg[5] = "Two passwords are different";
                                            }
                                            this.setState({
                                                password: tempValue
                                            });
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        error={checkRes[5] != 4 && checkRes[5] != 0}
                                        name="confirmPassword"
                                        label="Confirm Password"
                                        type="password"
                                        id="confirmPassword"
                                        // autoComplete="new-password"
                                        value={confirmPwd}
                                        helperText={checkMsg[5]}
                                        onChange={(event) => {
                                            let tempValue = event.target.value
                                            checkRes[5] = 4;
                                            checkMsg[5] = "";
                                            if (tempValue !== password) {
                                                checkRes[5] = 1;
                                                checkMsg[5] = "Two passwords are different";
                                            }
                                            this.setState({
                                                confirmPwd: tempValue
                                            });
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sx={{ alignItems: 'center' }}>

                            </Grid>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <Button
                                    // type="submit"
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    onClick={this.handleSubmit}
                                >
                                    Sign Up
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Container>
                <Snackbar open={open} onClose={() => this.setState({open: false})} autoHideDuration={4000}>
                    <Alert severity={flag} sx={{ width: '100%' }}>
                        { Msg }
                    </Alert>
                </Snackbar>
            </>
        );
    }

}

export default Register;