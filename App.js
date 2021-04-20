import React, {Component} from 'react';
import {View, Text, SafeAreaView, Image} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {Dialogflow_V2} from 'react-native-dialogflow';

import {dialogflowConfig} from './env';

// const botavater = require('./assets/images/bot1.PNG');

const BOT = {
  _id: 2,
  name: 'Mr.bot',
  avatar: 'https://bit.ly/3du8P1Z'
};

class App extends Component {
  state = {
    messages: [
      {_id: 2, text: 'Helper ยินดีให้ความช่วยเหลือค้าบน้อนๆ', createdAt: new Date(), user: BOT},
      {_id: 1, text: 'สวัสดีค่ะ', createdAt: new Date(), user: BOT},
    ],
    id: 1,
    name: '',
    // avatar: 'https://i.imgur.com/7k12EPD.png'
  };

  componentDidMount() {
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      //  Dialogflow_V2.LANG_UKRAINIAN,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id,
    );
  }

  handleGoogleResponse(result) {
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];

    this.sendBotResponse(text);
  }

  sendBotResponse(text) {

    let msg;

     if (text == 'ตึกวิท'){
      msg = {
        _id: this.state.messages.length + 1,
        text: 'ตัวเลือก',
        image: 'https://i.ytimg.com/vi/V6wkpbwfrIQ/maxresdefault.jpg',
        createdAt: new Date(),
        user: BOT,
      };
     }
     else if (text == 'show options'){
      msg = {
        _id: this.state.messages.length + 1,
        text: 'ตัวเลือก',
        // image: 'https://i.ytimg.com/vi/V6wkpbwfrIQ/maxresdefault.jpg',
        createdAt: new Date(),
        user: BOT,
        quickReplies: {
          type: 'radio',
          keepIt: true,
          values: [
            {title: 'ตึกวิท', value: 'ตึกวิท'},
            {title: 'คณะ', value: 'คณะ'},
            {title: 'วิชา', value: 'วิชา'}
          ],
        },
      };
     }

     else {
      msg = {
        _id: this.state.messages.length + 1,
        text,
        // image: 'https://i.ytimg.com/vi/V6wkpbwfrIQ/maxresdefault.jpg',
        createdAt: new Date(),
        user: BOT,
      };
     }

    // let msg = {
    //   _id: this.state.messages.length + 1,
    //   text,
    //   createdAt: new Date(),
    //   user: BOT,
    // };

    this.setState(previouseState => ({
      messages: GiftedChat.append(previouseState.messages, [msg]),
    }));
  }

  onSend(messages = []) {
    this.setState(previouseState => ({
      messages: GiftedChat.append(previouseState.messages, messages),
    }));

    let message = messages[0].text;

    Dialogflow_V2.requestQuery(
      message,
      result => this.handleGoogleResponse(result),
      error => console.log(error),
    );
  }

  onQuickReply(quickReply) {
    this.setState(previouseState => ({
      messages: GiftedChat.append(previouseState.messages, quickReply),
    }));
    let message = quickReply[0].value;

    Dialogflow_V2.requestQuery(
      message,
      result => this.handleGoogleResponse(result),
      error => console.log(error),
    );
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <GiftedChat
          messages={this.state.messages}
          onSend={message => this.onSend(message)}
          onQuickReply={quickReply => this.onQuickReply(quickReply)}
          user={{id: 1}}
        />
      </View>
    );
  }
}

export default App;
