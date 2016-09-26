import React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    PixelRatio,
    TouchableOpacity,
    Image,
    Platform,
    Navigator,
    AsyncStorage,
} from 'react-native';

import Tab from '../tab/tab'
import Login from '../account/login'

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logined: false,
        }
    }

    componentDidMount() {
        this._asyncAppStatus();
    }
    _asyncAppStatus() {
        var that = this;
        AsyncStorage.getItem('user')
            .then((data)=> {
                var user, newState={};
                if(data) {
                    var user = JSON.parse(data);
                }

                if(user&&user.accessToken) {
                    newState.user = user;
                    newState.logined = true
                }else{
                    newState.logined = false
                }
                that.setState(newState)
            })
    }
    _afterLogin(user) {
        var that = this;
        var user = JSON.stringify(user)
        AsyncStorage.setItem('user', user)
            .then(()=>{
                that.setState({
                    logined: true,
                    user: user
                })
            })
    }

    render() {
        if(!this.state.logined) {
            return <Login afterLogin={this._afterLogin.bind(this)} />
        }
        return (
             <Navigator
                 initialRoute = {{name: 'list',component: Tab}}
                 configureScene={(route, routeStack) =>Navigator.SceneConfigs.FloatFromRight}
                 renderScene={(route, navigator)=>{
                         var Compenent = route.component;
                         return <Compenent {...route.params} user = {this.state.user} navigator={navigator}/>
                     }
                 }
             />
        )
    }
}







