import React from "react";
import {
    Alert,
    Avatar,
    Button,
    Box,
    Card,
    Container,
    Grid,
    Snackbar,
    Input,
    IconButton,
    TextField,
    Typography,
    CircularProgress
} from "@mui/material/";

import PhotoCamera from '@mui/icons-material/PhotoCamera';
import {
    getUsername,
    getDisplayName,
    getEmail,
    getPhone,
    getZipcode,
    getDob,
    updateDisplayName,
    updateEmail,
    updatePhone,
    updateZipcode,
    updateDob,
    updatePassword,
    getAvatar,
    updateAvatar
} from "../util";


class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // user: JSON.parse(localStorage["user"]),
            confirmPwd: "",
            avatar: "",
            pwd: "",
            username: "",
            displayname: "",
            email: "",
            phone: "",
            zipcode: "",
            dob: "",
            checkRes: [4, 4, 4, 4, 4],
            checkMsg: ["", "", "", "", ""],
            open: false,
            waitUpload: false,
        }
    }

    componentDidMount() {
        getUsername((res) => {
            this.setState({ username: res.username });
        });
        getAvatar(null, (res) => {
            this.setState({ avatar: res.avatar });
        });
        getDisplayName(null, (res) => {
            this.setState({ displayname: res.displayname });
        });
        getEmail(null, (res) => {
            this.setState({ email: res.email });
        });
        getPhone(null, (res) => {
            this.setState({ phone: res.phone });
        });
        getZipcode(null, (res) => {
            this.setState({ zipcode: res.zipcode });
        });
        getDob(null, (res) => {
            this.setState({ dob: res.dob });
        })
    }

    uploadPic = (event) => {
        let pic = event.target.files[0];
        let fd = new FormData();
        fd.append("image", pic);
        updateAvatar(fd, (res) => {
            this.setState({ avatar: res.avatar });
        }, (status) => {
            this.setState({ waitUpload: status });
        });

    }

    handleSubmit = (event) => {
        const { checkRes } = this.state;
        let res = 0;
        for (let i = 0; i < checkRes.length; i++) {
            res += checkRes[i];
        }
        if (res == 20) {
            // this.props.updateUser(user);
            const {
                pwd,
                confirmPwd,
                username,
                displayname,
                email,
                phone,
                zipcode,
                dob,
                checkRes,
                checkMsg,
                open,
            } = this.state;
            updateDisplayName(null, displayname, (res) => { });
            // updateAvatar();
            updateEmail(null, email, (res) => { });
            updateZipcode(zipcode, (res) => { });
            updatePhone(phone, (res) => { });
            updateDob(dob, (res) => { });
            if (pwd.length != 0) {
                updatePassword(pwd, (res) => { });
            }
            this.setState({ open: true });
        }
    }

    render() {
        const {
            pwd,
            confirmPwd,
            username,
            displayname,
            avatar,
            email,
            phone,
            zipcode,
            dob,
            checkRes,
            checkMsg,
            open,
            waitUpload,
        } = this.state;

        return (
            <>
                <Container component="main" maxWidth="md">
                    <Card sx={{ padding: 4, margin: 2 }}>
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
                                Profile
                            </Typography>
                            {
                                waitUpload ?
                                    (
                                        <Box sx={{ display: 'flex' }}>
                                            <CircularProgress />
                                        </Box>
                                    ) : (
                                        <Avatar
                                            alt={displayname}
                                            // src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
                                            src={avatar}
                                            sx={{ width: 150, height: 150 }}
                                        />
                                    )
                            }

                            <label htmlFor="icon-button-file">
                                <Input
                                    accept="image/*"
                                    id="icon-button-file"
                                    type="file"
                                    sx={{ display: 'none' }}
                                    onChange={this.uploadPic}
                                />
                                <IconButton color="primary" aria-label="upload picture" component="span">
                                    <PhotoCamera />
                                </IconButton>
                            </label>
                            <Box component="form" noValidate sx={{ mt: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            // autoComplete="given-name"
                                            name="accountName"
                                            disabled
                                            fullWidth
                                            id="accountName"
                                            label="Account Name"
                                            autoFocus
                                            value={username}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            // required
                                            fullWidth
                                            id="displayName"
                                            label="Display Name(Optional)"
                                            name="displayName"
                                            value={displayname}
                                            onChange={(event) => {
                                                this.setState({
                                                    displayname: event.target.value
                                                });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            error={checkRes[0] != 4 && checkRes[0] != 0}
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            autoComplete="email"
                                            value={email}
                                            helperText={checkMsg[0]}
                                            onChange={(event) => {
                                                let tempValue = event.target.value;
                                                const check = new RegExp("[^\\W_]+@[^\\W_]+\\.[^\\W_]+");
                                                if (!check.test(tempValue)) {
                                                    checkRes[0] = 1;
                                                    checkMsg[0] = "Email form incorrect!";
                                                } else {
                                                    checkRes[0] = 4;
                                                    checkMsg[0] = "";
                                                }
                                                this.setState({
                                                    email: tempValue,
                                                });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            error={checkRes[1] != 4 && checkRes[1] != 0}
                                            id="phone"
                                            label="Phone Number"
                                            name="phone"
                                            value={phone}
                                            helperText={checkMsg[1]}
                                            onChange={(event) => {
                                                let tempValue = event.target.value;
                                                const check = new RegExp("^\\d{3}-\\d{3}-\\d{4}$");
                                                if (!check.test(tempValue)) {
                                                    checkRes[1] = 1;
                                                    checkMsg[1] = "Format like 123-123-1234!";
                                                } else {
                                                    checkRes[1] = 4;
                                                    checkMsg[1] = "";
                                                }
                                                this.setState({
                                                    phone: tempValue,
                                                });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            error={checkRes[2] != 4 && checkRes[2] != 0}
                                            id="zipcode"
                                            label="Zipcode"
                                            name="zipcode"
                                            inputProps={{ pattern: "\d{5}" }}
                                            value={zipcode}
                                            helperText={checkMsg[2]}
                                            onChange={(event) => {
                                                let tempValue = event.target.value;
                                                const check = new RegExp("^\\d{5}\$");
                                                if (!check.test(tempValue)) {
                                                    checkRes[2] = 1;
                                                    checkMsg[2] = "5 digits for a zipcode";
                                                } else {
                                                    checkRes[2] = 4;
                                                    checkMsg[2] = "";
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
                                            error={checkRes[3] != 4 && checkRes[3] != 0}
                                            name="birthday"
                                            // label="birthday"
                                            type="date"
                                            id="birthday"
                                            value={dob}
                                            helperText={"Birthday(Over 18 years old)"}
                                            onChange={(event) => {
                                                let tempValue = event.target.value.split("-");
                                                let currDate = new Date();
                                                checkRes[3] = 4;
                                                checkMsg[3] = "";
                                                if (tempValue[0] > currDate.getFullYear() - 18) {
                                                    checkRes[3] = 1;
                                                    checkMsg[3] = "User should be over 18!";
                                                } else if (tempValue[0] == currDate.getFullYear() - 18) {
                                                    if (tempValue[1] > currDate.getMonth() + 1) {
                                                        checkRes[3] = 1;
                                                        checkMsg[3] = "User should be over 18!";
                                                    } else if (tempValue[1] == currDate.getMonth() + 1) {
                                                        if (tempValue[2] > currDate.getDate()) {
                                                            checkRes[3] = 1;
                                                            checkMsg[3] = "User should be over 18!";
                                                        }
                                                    }
                                                }
                                                this.setState({
                                                    dob: tempValue[0] + "-" + tempValue[1] + "-" + tempValue[2]
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
                                            value={pwd}
                                            onChange={(event) => {
                                                let tempValue = event.target.value
                                                checkRes[4] = 4;
                                                checkMsg[4] = "";
                                                if (tempValue !== confirmPwd) {
                                                    checkRes[4] = 1;
                                                    checkMsg[4] = "Two passwords are different";
                                                }
                                                this.setState({
                                                    pwd: tempValue,
                                                });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            error={checkRes[4] != 4 && checkRes[4] != 0}
                                            name="confirmPassword"
                                            label="Confirm Password"
                                            type="password"
                                            id="confirmPassword"
                                            // autoComplete="new-password"
                                            value={confirmPwd}
                                            helperText={checkMsg[4]}
                                            onChange={(event) => {
                                                let tempValue = event.target.value
                                                checkRes[4] = 4;
                                                checkMsg[4] = "";
                                                if (tempValue !== pwd) {
                                                    checkRes[4] = 1;
                                                    checkMsg[4] = "Two passwords are different";
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
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                        onClick={this.handleSubmit}
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                        onClick={() => {
                                            this.props.setProfileShow(false);
                                        }}
                                    >
                                        Back
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Card>
                </Container>
                <Snackbar open={open} onClose={() => { this.setState({ open: false }) }} autoHideDuration={4000}>
                    <Alert severity="success" sx={{ width: '100%' }}>
                        Update successfully!
                    </Alert>
                </Snackbar>
            </>
        );
    }

}
export default Profile;