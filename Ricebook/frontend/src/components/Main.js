import React from 'react';
import {
    Container,
    Grid,
    Paper,
    Box,
    Stack,
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    Avatar,
    IconButton,
    Divider,
    TextField,
    ListItem,
    ListItemAvatar,
    ListItemText,
    List,
    CardMedia,
    Input,
    Pagination,
    InputBase,
    Collapse,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Profile from './Profile';
import {
    requestArticles,
    getUsername,
    getHeadline,
    updateHeadline,
    getArticlesLength,
    getArticles,
    postArticle,
    getFollower,
    getFollowerAndHeadlines,
    getHeadlinesByFollowers,
    addFollower,
    deleteFollower,
    updateArticle,
    getAvatar,
} from '../util';

const ERR = 'error';
const WAR = 'warning';
const INF = 'info';
const SUC = 'success';


const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

class UserStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            headline: "",
            newStatus: "",
            avatar: "",
            refreshVar: false,
        }
    }

    componentDidMount() {
        getUsername((res) => {
            this.setState({ username: res.username });
        });
        getAvatar(null, (res) => {
            this.setState({ avatar: res.avatar });
        });
        getHeadline(null, (res) => {
            this.setState({ headline: res.headline });
        });
    };

    updateHeadline(newStatus) {
        updateHeadline(newStatus, (res) => {
            if ('Msg' in res) {
                this.props.showMsg(res['Msg'], ERR);
                return;
            }
            this.props.showMsg("New headline updated!", SUC);
            this.setState({ headline: res.headline });
            return;
        });
    }

    render() {
        const { username, headline, avatar, newStatus } = this.state;
        return (
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <Box
                        sx={{
                            // marginTop: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar
                            alt={username}
                            src={avatar}
                            sx={{ width: 70, height: 70 }}
                        />
                        <Typography sx={{ fontSize: 25, margin: 1 }} variant="h5" component="h5">
                            {username}
                        </Typography>
                    </Box>
                    <Divider />
                    <Grid container>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                sx={{ mt: 3, mb: 2, marginTop: 2 }}
                                onClick={() => {
                                    this.props.setProfileShow(true);
                                }}
                            >
                                Profile
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography sx={{ fontSize: 20, margin: 1 }} variant="h4"
                                component="h4">{headline}</Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <TextField
                                margin="dense"
                                name="newStatus"
                                label="New Status"
                                type="text"
                                id="newStatus"
                                size="small"
                                value={newStatus}
                                onChange={(event) =>
                                    this.setState({ newStatus: event.target.value })
                                }
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Button sx={{ marginTop: 1 }} onClick={() => {
                                this.updateHeadline(newStatus);
                            }}
                            >
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        );
    }

}

class FansBoard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            followers: [],
            searchName: "",
        }
    }

    componentDidMount() {
        getFollower(null, (res) => {
            if ('Msg' in res) {
                this.props.showMsg(res['Msg'], ERR);
                return;
            }
            getHeadlinesByFollowers(res.following, (res) => {
                this.setState({ followers: res.following });
            })
        });
    };

    addFollower = (user) => {
        addFollower(user, (res) => {
            if ('Msg' in res) {
                this.props.showMsg(res['Msg'], ERR);
                return;
            }
            getHeadlinesByFollowers(res.following, (res) => {
                if ('Msg' in res) {
                    this.props.showMsg(res['Msg'], ERR);
                    return;
                }
                this.setState({ followers: res.following });
                this.props.showMsg("Add " + user + " successfully!", SUC);
            });
            this.props.updateArticleList();
        });
    }

    deleteFollower = (user) => {
        deleteFollower(user, (res) => {
            if ('Msg' in res) {
                this.props.showMsg(res['Msg'], ERR);
                return;
            }
            getHeadlinesByFollowers(res.following, (res) => {
                if ('Msg' in res) {
                    this.props.showMsg(res['Msg'], ERR);
                    return;
                }
                this.setState({ followers: res.following });
                this.props.showMsg("Delete " + user + " successfully!", SUC);
            });
            this.props.updateArticleList();
        });
    }

    render() {
        const { followers, searchName } = this.state;
        let cards = null;
        if (followers != null && followers.length != 0) {
            cards = followers.map((item) => {
                return (
                    <Grid
                        direction="column"
                        margin={1}
                    >
                        <Card variant="outlined" square>
                            <ListItem
                                secondaryAction={
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => {
                                            this.deleteFollower(item.username);
                                            // this.props.setFollowing("Delete", index);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar alt={item.Avatar} sx={{ bgcolor: red[500] }} src={"https://cdn-icons-png.flaticon.com/512/168/168734.png"} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={item.username}
                                    secondary={
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {item.headline}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        </Card>
                    </Grid>
                );
            });
        }

        return (
            <Card sx={{ minWidth: 275 }}>
                <Stack spacing={2}>
                    <Typography sx={{ fontSize: 20, marginTop: 2 }} variant="h5" component="h5">Following</Typography>
                    <Box alignItems={"center"}>
                        <Paper
                            sx={{ p: '2px 4px', display: 'flex' }}
                        >
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Want to follow..."
                                value={searchName}
                                data-test-id="main-follow-input"
                                onChange={(event => {
                                    this.setState({ searchName: event.target.value })
                                })}
                            />
                            <IconButton
                                type="submit"
                                sx={{ p: '10px' }}
                                aria-label="search"
                                data-test-id="main-follow-button"
                                onClick={() => {
                                    // this.props.setFollowing("Add", searchName);
                                    this.addFollower(searchName);
                                }
                                }>
                                <SearchIcon />
                            </IconButton>
                        </Paper>
                    </Box>

                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>{cards}</List>
                </Stack>
            </Card>
        );
    }

}


class PostArticle extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            content: "",
            fd: null,
        }
    }

    componentDidMount() {
        this.setState({ fd: new FormData() });
    }

    render() {
        return (
            <Card>
                <Box>
                    <Grid container spaces={3}>
                        <Grid item xs={7} sx={{ padding: 2 }}>
                            <Box>
                                <TextField
                                    id="filled-multiline-static"
                                    multiline
                                    rows={10}
                                    fullWidth
                                    sx={{ bgcolor: "#e4f0ff" }}
                                    value={this.state.content}
                                    onChange={(event) => {
                                        this.setState({ content: event.target.value });
                                    }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={5} sx={{ padding: 2, textAlign: "left" }}>
                            <Typography sx={{ fontSize: 30, marginBottom: 5 }} variant="h4" component="h4">Write your
                                article!</Typography>
                            <Stack spacing={2}>
                                <label htmlFor="icon-button-file">
                                    <Input
                                        accept="image/*"
                                        id="icon-button-file"
                                        type="file"
                                        sx={{ display: 'none' }}
                                        onChange={(event) => {
                                            let pic = event.target.files[0];
                                            this.state.fd.append("image", pic);
                                        }}
                                    />
                                    <IconButton color="primary" aria-label="upload picture" component="span">
                                        <PhotoCamera />
                                    </IconButton>
                                </label>
                                <Button
                                    color="success"
                                    variant="contained"
                                    fullWidth
                                    onClick={() => this.setState({ content: "" })}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => {
                                        const { fd } = this.state;
                                        fd.append("text", this.state.content);
                                        postArticle(fd, (res) => {
                                            if ('Msg' in res) {
                                                this.props.showMsg(res['Msg'], ERR);
                                                return;
                                            }
                                            this.props.updateArticleList();
                                            this.props.showMsg("Post successfully", SUC);
                                            return;
                                        });
                                        this.setState({ content: "", fd: new FormData() });
                                    }}
                                >
                                    Post
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Card>
        );
    }
}

class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: props.text,
            _id: props._id,
            author: props.author,
            avatar: ""
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ text: nextProps.text });
    }

    componentDidMount() {
        getAvatar(this.state.author, (res) => {
            this.setState({ avatar: res.avatar });
        });
    }

    render() {
        const { text, _id, author, avatar } = this.state;
        return (
            <ListItem
                disableGutters
                alignItems="flex-start"
                secondaryAction={
                    <>
                        <IconButton onClick={() => {
                            this.props.clickEditComment(text, _id);
                        }}>
                            <EditIcon />
                        </IconButton>
                    </>
                }
            >
                <ListItemAvatar>
                    <Avatar
                        src={avatar}
                    >
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    sx={{ "word-wrap": "break-word" }}
                    primary={author}
                    secondary={
                        <React.Fragment>
                            {text}
                        </React.Fragment>
                    }
                />
            </ListItem>
        );
    }
}

class Article extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dialogOpen: false,
            dialogTitle: "",
            dialogText: "",
            commantId: null,
            expanded: false,
            item: props.item,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.item._id != this.state.item._id) {
            this.setState({ item: nextProps.item });
        }
    }

    clickEditComment = (text, _id) => {
        this.setState({
            dialogTitle: "Edit comment",
            dialogOpen: true,
            dialogText: text,
            commentId: _id
        });
    }

    updateArticle = (id, text, commentId) => {
        updateArticle(id, text, commentId, (res) => {
            if ('Msg' in res) {
                this.props.showMsg(res['Msg'], ERR);
                return;
            }
            if (!commentId) { // Edit article
                this.props.showMsg("Article edit successfully!", SUC);
                this.setState((pre) => {
                    return { item: res.articles[0], dialogOpen: false };
                });
            } else {// comments
                this.props.showMsg("Comments edit successfully!", SUC);
                this.setState((pre) => {
                    return { item: res.articles[0], dialogOpen: false };
                });
            }
        });

    }

    render() {
        const { item, updateMsg, dialogOpen, dialogTitle, dialogText, commentId } = this.state;
        let comments = item.comments.map((comment) => {
            return (
                <>
                    <Divider light />
                    <Comment clickEditComment={this.clickEditComment} text={comment.text} _id={comment._id} author={comment.author} />
                </>
            );
        });
        return (
            <>
                <Grid item xs={4}>
                    <Card sx={{ maxWidth: 345 }}>
                        {
                            (item.picture != "") && (
                                <CardMedia
                                    component="img"
                                    height="140"
                                    // image="https://miro.medium.com/max/2000/1*HSisLuifMO6KbLfPOKtLow.jpeg"
                                    image={item.picture}
                                />
                            )
                        }
                        <CardContent sx={{ textAlign: "left" }}>

                            <Box sx={{
                                display: "-webkit-box",
                                boxOrient: "vertical",
                                lineClamp: 2,
                                wordBreak: "break-all",
                                overflow: "hidden"
                            }}
                                textOverflow="ellipsis"
                            >
                                <Typography sx={{ fontSize: 15 }} textOverflow={"ellipsis"} variant="body2" color="text.secondary">
                                    {item.body}
                                </Typography>
                            </Box>
                            <Typography sx={{ fontSize: 10, margin: 2 }} variant="h5" component="div">
                                Author: {item.author}
                            </Typography>
                            <Typography sx={{ fontSize: 10, margin: 2 }} variant="h5" component="div">
                                Post on: {item.date}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                size="small"
                                onClick={() => {
                                    this.setState({
                                        dialogTitle: "Edit Article",
                                        dialogOpen: true,
                                        dialogText: item.body,
                                        commentId: null
                                    });
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                size="small"
                                onClick={() => {
                                    this.setState({
                                        dialogTitle: "Add comment",
                                        dialogOpen: true,
                                        dialogText: "",
                                        commentId: -1
                                    });
                                }}
                            >
                                Comment
                            </Button>
                            <ExpandMore
                                expand={this.state.expanded}
                                onClick={() => {
                                    this.setState((pre) => { return { expanded: !pre.expanded } });
                                }}
                                aria-expanded={this.state.expanded}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon />
                            </ExpandMore>
                        </CardActions>
                        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                            <CardContent sx={{ textAlign: "left" }}>
                                <List sx={{ width: '100%' }}>
                                    {comments}
                                </List>
                            </CardContent>
                        </Collapse>
                    </Card>
                </Grid >
                <Dialog open={dialogOpen} onClose={() => { this.setState({ dialogOpen: false }) }}>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                        </DialogContentText>
                        <TextField
                            value={dialogText}
                            rows={(dialogTitle == "Edit Article") ? 5 : 1}
                            multiline={(dialogTitle == "Edit Article") ? true : false}
                            onChange={(event) => {
                                this.setState({ dialogText: event.target.value });
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { this.setState({ dialogOpen: false, commentId: null }) }}>Cancel</Button>
                        <Button onClick={() => {
                            this.updateArticle(item._id, dialogText, commentId);
                        }}>
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

class ArticlesControlled extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { page, tempArtitles, count, key, changePage, editKey, updateArticleList } = this.props;
        // const {key} = this.state;

        let articleCards = tempArtitles.map((item) => {
            return (
                <Article item={item} showMsg={this.props.showMsg} />
            );
        });
        return (
            <>
                <Card sx={{ padding: 3, marginBottom: 4 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Paper
                                fullWidth
                                sx={{ p: '2px 4px', display: 'flex' }}
                            >
                                <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    fullWidth
                                    placeholder="Search Keywords"
                                    inputProps={{ 'aria-label': 'search google maps' }}
                                    value={key}
                                    data-test-id="main-search-articles-input"
                                    onChange={(event) => {
                                        editKey(event.target.value);
                                    }}
                                />
                                <IconButton
                                    sx={{ p: '10px' }}
                                    aria-label="search"
                                    data-test-id="main-search-articles-button"
                                    onClick={() => {
                                        updateArticleList();
                                    }}
                                >
                                    <SearchIcon />
                                </IconButton>
                            </Paper>
                        </Grid>
                        {articleCards}
                    </Grid>
                    <Stack spacing={2} alignItems={"center"}>
                        <Typography>Page: {page}</Typography>
                        <Box>
                            <Pagination count={count} page={page} onChange={changePage} />
                        </Box>
                    </Stack>
                </Card>
            </>
        );
    }

}

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            profileShow: false,
            MsgFlag: false,
            type: 'success',
            Msg: "",
            refreshVar: false,

            // For articles
            key: "",
            tempArtitles: [],
            page: 1,
            count: 1
        };
    }

    componentDidMount() {
        const { key } = this.state;
        getArticlesLength(1, key, (res) => {
            this.setState({ count: Math.ceil(res.length / 3) });
        });
        getArticles(1, key, (res) => {
            this.setState({ tempArtitles: res.articles });
        });
    }

    refresh = () => {
        this.setState(pre => { return { refreshVar: !pre.refreshVar } });
    }

    showMsg = (Msg, type) => {
        this.setState({
            Msg: Msg,
            type: type,
            MsgFlag: true,
        });
    }

    editKey = (value) => {
        this.setState({ key: value });
    }

    changePage = (event, value) => {
        const { key } = this.state;
        this.setState({ page: value });
        getArticles(value, key, (res) => {
            this.setState({ tempArtitles: res.articles });
        });
    };

    updateArticleList = () => {
        const { key } = this.state;
        this.setState({ page: 1 });
        getArticlesLength(1, key, (res) => {
            this.setState({ count: Math.ceil(res.length / 3) });
        });
        getArticles(1, key, (res) => {
            this.setState({ tempArtitles: res.articles });
        });
    }

    setProfileShow = (flag) => {
        this.setState({ profileShow: flag });
    }

    render() {
        // const {following, showArticlesIndex, errorMsg} = this.state;
        const { Msg, type, MsgFlag, tempArtitles, page, count } = this.state;
        return (
            <>
                {
                    (!this.state.profileShow)
                        ? (
                            <>
                                <Container maxWidth={'lg'}>
                                    <Box sx={{ width: '100%' }}>
                                        <Grid
                                            container
                                            marginTop={3}
                                            rowSpacing={1}
                                            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                                        >
                                            <Grid item xs={3}>
                                                <UserStatus showMsg={this.showMsg} setProfileShow={this.setProfileShow} />
                                            </Grid>
                                            <Grid item xs={9}>
                                                <PostArticle showMsg={this.showMsg} updateArticleList={this.updateArticleList} />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <FansBoard showMsg={this.showMsg} updateArticleList={this.updateArticleList} />
                                            </Grid>
                                            <Grid item xs={9}>
                                                <ArticlesControlled
                                                    tempArtitles={tempArtitles}
                                                    count={count}
                                                    page={page}
                                                    changePage={this.changePage}
                                                    editKey={this.editKey}
                                                    updateArticleList={this.updateArticleList}
                                                    showMsg={this.showMsg}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Container>
                                <Snackbar open={MsgFlag} onClose={() => { this.setState({ MsgFlag: false }) }} autoHideDuration={4000}>
                                    <Alert severity={type} sx={{ width: '100%' }}>
                                        {Msg}
                                    </Alert>
                                </Snackbar>
                            </>
                        )
                        : <Profile setProfileShow={this.setProfileShow} />
                }
            </>
        );
    }
}

export default Main;