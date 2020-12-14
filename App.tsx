/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';

import NewUser from './views/NewUser';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import auth from '@react-native-firebase/auth';
import {useState} from 'react';
import {Text} from 'react-native';
import Dashboard from './views/Dashboard';
import Header from './views/Header';
import {NativeRouter, Route, Switch} from 'react-router-native';
import Chat from './views/Chat';
import OneSignal from 'react-native-onesignal';

import {ONESIGNAL_PROJECT_ID} from '@env';

declare const global: {HermesInternal: null | {}};

let subscriber: any;
let oneSignalUserId: string;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {initializing: true, user: null};
    OneSignal.setLogLevel(6, 0);

    console.log(ONESIGNAL_PROJECT_ID);

    try {
      OneSignal.init(ONESIGNAL_PROJECT_ID, {
        kOSSettingsKeyAutoPrompt: false,
        kOSSettingsKeyInAppLaunchURL: false,
        kOSSettingsKeyInFocusDisplayOption: 2,
      });
    } catch (error) {
      console.error(error);
    }
    console.log('past init');

    OneSignal.inFocusDisplaying(2);

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);

    subscriber = auth().onAuthStateChanged(this.onAuthStateChanged);

    // // this.onIds = this.onIds.bind(this);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received');
    OneSignal.removeEventListener('opened');
    OneSignal.removeEventListener('ids');

    subscriber;
  }

  onReceived(notification) {
    console.log('Notification received: ', notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onIds(device) {
    console.log('Device info: ', device);
    oneSignalUserId = device.userId;
    console.log('one signal', oneSignalUserId);
  }

  onAuthStateChanged = (user) => {
    this.setState({user: user});
    if (this.state.initializing) this.setState({initializing: false});
  };

  render() {
    if (this.state.initializing) return null;

    if (!this.state.user) {
      return (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <NewUser />
        </View>
      );
    }
    return (
      <NativeRouter>
        <View style={{flex: 1}}>
          <Header />
          {console.log(this.state.user)}
          <Switch>
            <Route
              exact
              path="/"
              component={() => <Dashboard user={this.state.user} />}
            />
            <Route exact path="/chat/" component={Chat} />
          </Switch>
        </View>
      </NativeRouter>
    );
  }
}

// const App = () => {
//   const [initializing, setInitializing] = useState(true);
//   const [user, setUser] = useState(null);

//   const onAuthStateChanged = (user) => {
//     setUser(user);
//     if (initializing) setInitializing(false);
//   };

//   useEffect(() => {
//     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

//     console.log(subscriber);
//     return subscriber;
//   }, []);

//   if (initializing) return null;

//   if (!user) {
//     return (
//       <View style={{flex: 1, backgroundColor: '#fff'}}>
//         <NewUser />
//       </View>
//     );
//   }
//   return (
//     <NativeRouter>
//       <View style={{flex: 1}}>
//         <Header />
//         {console.log(user)}
//         <Switch>
//           <Route exact path="/" component={() => <Dashboard user={user} />} />
//           <Route exact path="/chat/" component={Chat} />
//         </Switch>
//       </View>
//     </NativeRouter>
//   );
// };

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
