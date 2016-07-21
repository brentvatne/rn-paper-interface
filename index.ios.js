/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Animated,
  PanResponder,
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  Dimensions,
  TouchableHighlight,
  LayoutAnimation
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'

let AnimatedScrollView = Animated.createAnimatedComponent(ScrollView)

let cardsMap = {
  'question': {
    title: 'QUESTION',
    colorDark: '#A91400',
    colorLight: '#FF5505',
  },
  'update': {
    title: 'UPDATE',
    colorDark: '#032269',
    colorLight: '#27AFFF',
  }
}

let darkRed = "#A91400";
let brightOrange = "#FF5505";

class Shroom extends Component {
  constructor(props) {
    super(props)

    this.state = {
      reactionCount: 5,
      isDocked: true,
      scroll: true,
      pan: new Animated.ValueXY(),
    }
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: () => {
        // this.setState({scroll: false})
      },
      onPanResponderMove: Animated.event([null, {dx: this.state.pan.x, dy: this.state.pan.y}]),
      onPanResponderRelease: () => {
        // this.setState({scroll: true})

        if (this._pan.y < -100) {
          Animated.spring(this.state.pan.y, {
            toValue: -400
          }).start();
        } else {
          Animated.spring(this.state.pan.y, {
            toValue: 0
          }).start(()=>{
            this.setState({
              isDocked: false
            })
          });          
        }
      }
    })
  }

  componentDidMount() {
    this.state.pan.addListener((value) => {  // Async listener for state changes  (step1: uncomment)
      console.log(value)
      this._pan = value
    });
  }

  componentWillUnmount() {
    this.state.pan.x.removeAllListeners();  
    this.state.pan.y.removeAllListeners();
  }

  renderCard(meta) {
    let {
      type
    } = meta

    return (
      <LinearGradient 
        colors={[cardsMap[type].colorDark, cardsMap[type].colorLight]}
        style={{
          width: Dimensions.get('window').width - 20,
          marginTop: 20,
          marginHorizontal: 10,
          marginBottom: 10,
          borderRadius: 10,
          overflow: 'hidden',
          // backgroundColor: 'pink'
        }}
      >
        <View style={{
          flexDirection: 'row'
        }}>
            <Image 
              style={styles.profilePicture}
              source={{
                height: 80,
                width: 80,
                uri: "https://facebook.github.io/react/img/logo_og.png"
              }}
            />
          
          <Text style={styles.displayName}>
            {"John\nAppleseed"}
          </Text>
          <View
            style={styles.badgeSection}
          >
            <View
              style={[styles.badgeSlug, {
                backgroundColor: cardsMap[type].colorLight
              }]}
            >
              <Text style={[styles.badgeText,{
                color: cardsMap[type].colorDark
              }]}>
                {cardsMap[type].title}
              </Text>
            </View>
          </View>
        </View>
        <View>
          <Text style={styles.updateText}>
            Did anyone complete Rajat's assignment?
          </Text>
        </View>
        <View style={styles.reactionBox}>
          <TouchableHighlight
            underlayColor='transparent'
            onPress={() => {
              LayoutAnimation.easeInEaseOut()
              this.setState({
                reactionCount: this.state.reactionCount + 1,
                isDocked: !this.state.isDocked
              })
            }}
          >
            <Text style={[styles.reactionEmoji, {
              textShadowColor: cardsMap[type].colorDark
            }]}>
              👏
            </Text>
          </TouchableHighlight>
          <Text style={styles.reactionCount}>
            {this.state.reactionCount}
          </Text>
        </View>

      </LinearGradient>
    )
  }

  render() {
    let {
      pan
    } = this.state

    return (
      <View style={styles.box}>
        <AnimatedScrollView
          horizontal={true}
          pagingEnabled={!this.state.isDocked}
          scrollEnabled={this.state.scroll}
          style={[styles.container,{
            borderWidth: 1,
            borderColor: 'red',
            width: this.state.pan.y.interpolate({
              inputRange: [-300, 0],
              outputRange: [Dimensions.get('window').width, Dimensions.get('window').width * 2],
              extrapolate: 'clamp'
            }),
          }, {
            transform: [{
              scale: this.state.pan.y.interpolate({
                inputRange: [-300, 0],
                outputRange: [1, 0.5],
                extrapolate: 'clamp'
              }),
            }, {
              translateX: this.state.pan.y.interpolate({
                inputRange: [-300, 0],
                outputRange: [0, -(Dimensions.get('window').width)],
                extrapolate: 'clamp'
              }),
            }, {
              translateY: this.state.pan.y.interpolate({
                inputRange: [-300, 0],
                outputRange: [0, (Dimensions.get('window').height/2)],
                extrapolate: 'clamp'
              }),
            }],
          }]}
          // style={[styles.container,{
          //   transform: [{
          //     scale: this.state.isDocked ? 0.5 : 1,
          //   }, {
          //     translateX: this.state.isDocked ? -150 : 0,
          //   }, {
          //     translateY: this.state.isDocked ? 260 : 0,
          //   }],
          // }]}
          {...this._panResponder.panHandlers}
        >
          {this.renderCard({
            type: 'update'
          })}
          {this.renderCard({
            type: 'question'
          })}
          {this.renderCard({
            type: 'update'
          })}
          {this.renderCard({
            type: 'question'
          })}
          {this.renderCard({
            type: 'question'
          })}
          {this.renderCard({
            type: 'update'
          })}
        </AnimatedScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: 'black',
  },

  container: {
    flex: 1,
    // overflow: 'visible',
    // justifyContent: 'center',
    // alignItems: 'center',
    
  },
  updateText: {
    // fontFamily: 'Dosis',
    fontSize: 32,
    color: 'white',
    backgroundColor: 'transparent',
    // fontWeight: 300,
    // textAlign: 'center',
    margin: 20,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    margin: 20,
    marginRight: 10
  },
  displayName: {
    backgroundColor: 'transparent',
    color: 'white',
    // textAlign: 'center',
    marginLeft: 0,
    marginTop: 22,
    fontSize: 20,
    marginBottom: 5,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  badgeSection: {
    flex: 1,
    alignItems: 'flex-end',
    // marginTop: 20,
    marginRight: 20,
    justifyContent: 'center'
  },
  badgeSlug: {
    backgroundColor: brightOrange,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  badgeText: {
    color: darkRed,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 'bold'
  },
  reactionBox: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 40,
  },
  reactionEmoji: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontSize: 50,
    padding: 10,
    textShadowColor: darkRed,
    textShadowRadius: 10,
    textShadowOffset: {
      width: 5,
      heigth: 5
    },
  },
  reactionCount: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: darkRed,
    fontSize: 30,
    padding: 0,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});

AppRegistry.registerComponent('Shroom', () => Shroom);
