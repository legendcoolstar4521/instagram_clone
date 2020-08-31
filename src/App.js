import React, { useState, useEffect } from 'react';
import './App.css';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { db, auth } from './firebase';
import firebase from 'firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faComment, faCompass, faHeart, faUser, faUpload } from '@fortawesome/free-solid-svg-icons';
import Dropdown from './components/Dropdown/Dropdown';
import SearchBar from './components/UI/SearchBar/SearchBar';
import logo from './Assets/Images/instagram-logo.png';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Modal from './components/Modal/Modal';
import Home from './containers/Home/Home';
import Explore from './containers/Explore/Explore';
import Profile from './containers/Profile/Profile';
import Upload from './containers/Upload/Upload';
function App(props) {
  const [opened, setOpened] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(true);
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [dropDownType, setDropDownType] = useState(null);
  const [usernames,setUsernames] = useState([]);
  const defaultUser = {
    username: username,
    followers: "not set",
    following: "not set",
    notifications:"not set",
    posts:"not set",
    saved:"not set",
    reels:"not set"
  }
  const authCheckState = () => {
    const token = localStorage.getItem('isLoggedIn');
    if (!token) {
      setLoggedIn(false)
    }
    else {
      setLoggedIn(true);
      setOpenSignIn(false);
      setOpened(false);
    }
  }
  useEffect(() => {
    authCheckState()
  }, [])
  useEffect(() => {
    if (user) {
      authCheckState()
    }
  }, [user])
  useEffect(()=>{
    db.ref().child(`accounts`).on("value",snapshot=>{
      let data = snapshot? snapshot.val() :null
      if(!data||data==='not set'){
        return;
      }
      let values = Object.values(data)
      setUsernames(values)
    })
  },[])
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        /*user had logged in */
        setUser(authUser);
      }
      else {
        /*user had logged out */
        console.log("logged out")
        setUser(null);
      }
    })
    return () => {
      unsubscribe();
    }
  }, [user, username])
  const signUp = () => {
    if(usernames.includes(username)){
      alert("this user is already registered");
      return;
    }
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(function () {
        return firebase.auth().createUserWithEmailAndPassword(email, password)
          .then((authUser) => {
            if (authUser) {
              db.ref().child(`users/${authUser.user.uid}`).set(defaultUser).then(res => {
                db.ref().child(`accounts/${authUser.user.uid}`).set(username);
              });
            }
            localStorage.setItem('isLoggedIn', true);
            setOpened(false);
            setOpenSignIn(false);
            return authUser.user.updateProfile({
              displayName: username
            })
          })
      })
      .catch((error) => alert(error.message));
  }
  const signIn = () => {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(function () {
        return firebase.auth().signInWithEmailAndPassword(email, password).then(response => {
          localStorage.setItem('isLoggedIn', true)
        });
      }).then(res => {
        setEmail('');
        setPassword('');
        setOpened(false);
        setOpenSignIn(false);
        return;
      })
      .catch((error) => alert(error.message));
  }
  const dropDownHandler = (type) => {
    setDropDownType(type);
    setOpenDropdown(prevState => !prevState);
  }
  const changeAuthMode = (type) => {
    if (type === 'signIn') {
      setOpened(false);
      setOpenSignIn(true);
    }
    else {
      setOpened(true);
      setOpenSignIn(false);
    }
  }
  return (
    <div className="app" >
      {loggedIn ?
        <div>
          <div className="app_header">
            <img
              className="app_headerImage"
              src={logo}
              alt="" />
            <div className="app_header_SearchBar">
              <SearchBar uid={user ? user.uid : null} />
            </div>
            <div className="app_header_iconSet">
              <div onClick={() => props.history.push(props.match.url)}>
                <FontAwesomeIcon icon={faHome} className="app_header_Icon" />
              </div>
              <div >
                <FontAwesomeIcon icon={faComment} className="app_header_Icon" />
              </div>
              <div onClick={() => props.history.push(props.match.url + 'explore')}>
                <FontAwesomeIcon icon={faCompass} className="app_header_Icon" />
              </div>
              <div onClick={() => props.history.push(props.match.url + 'upload')}>
                <FontAwesomeIcon icon={faUpload} className="app_header_Icon" />
              </div>
              <FontAwesomeIcon onClick={() => dropDownHandler("notification")} icon={faHeart} className="app_header_Icon" />
              <FontAwesomeIcon onClick={() => dropDownHandler("user")} icon={faUser} className="app_header_Icon" />
              {openDropdown ?
                <Dropdown
                  setOpenDropdown={setOpenDropdown}
                  setLoggedIn={setLoggedIn}
                  setOpenSignIn={setOpenSignIn}
                  setOpened={setOpened}
                  type={dropDownType ? dropDownType : ''}
                  uid={user ? user.uid : null}
                  loggedIn={loggedIn}
                  username={user?user.displayName:null} /> : null}

            </div>
          </div></div> : null}
      {user ?
        <Switch>
          <Redirect from="/Home" to="/" />
          <Route path="/upload" >
            <Upload uid={user.uid} loggedIn={loggedIn} username={user.displayName} />
          </Route>
          <Route path="/explore" >
            <Explore uid={user.uid} loggedIn={loggedIn} username={user.displayName} />
          </Route>
          <Route path="/" exact >
            <Home uid={user.uid} loggedIn={loggedIn} username={user.displayName} />
          </Route>
          <Route path="/p/:id/:displayName">
            <Profile uid={user.uid} loggedIn={loggedIn} user={user} username={user.displayName} />
          </Route>
        </Switch> : null}

      {/**Sign Up modal */}
      <Modal setOpened={setOpened} open={opened} >
        <form className="app_signUp" onSubmit={(e) => e.preventDefault()}>
          <center>
            <img
              className="app_headerImage"
              src={logo}
              alt="" />
          </center>
          <Input onChange={(e) => setUsername(e.target.value)} type="text" placeholder="username" value={username} />
          <Input onChange={(e) => setEmail(e.target.value)} type="text" placeholder="email" value={email} />
          <Input onChange={(e) => setPassword(e.target.value)} type="text" placeholder="password" value={password} />
          <Button onClick={() => signUp()}>Sign Up</Button>
          <Button onClick={() => changeAuthMode('signIn')}>Sign In Instead...</Button>
        </form>
      </Modal>

      {/**Sign In modal */}
      <Modal setOpened={setOpenSignIn} open={openSignIn} >
        <form className="app_signUp" onSubmit={(e) => e.preventDefault()}>
          <center>
            <img
              className="app_headerImage"
              src={logo}
              alt="" />
          </center>
          <Input onChange={(e) => setEmail(e.target.value)} type="text" placeholder="email" value={email} />
          <Input onChange={(e) => setPassword(e.target.value)} type="text" placeholder="password" value={password} />
          <Button onClick={() => signIn()}>Sign In</Button>
          <Button onClick={() => changeAuthMode('signUp')}>Sign Up Instead...</Button>
        </form>
      </Modal>
      {/** over */}
    </div>
  );
}

export default withRouter(App);
