import Vue from 'vue'
import Vuex from 'vuex'
import {getRequest} from "../utils/api";
import SockJS from  'sockjs-client';
import Stomp from 'stompjs';
import { Notification } from 'element-ui';

Vue.use(Vuex);

const now = new Date();

const store = new Vuex.Store({
    state:{
        routes: [],
        sessions: {},
        admins: [],
        currentAdmin: JSON.parse(window.sessionStorage.getItem("user")),
        currentSession: null,
        filterKey: '',
        stomp:null,
        isDot: {}

    },
    mutations:{
        initRoutes(state,data){
            state.routes = data;
        },
        changeCurrentSession (state, currentSession) {
            Vue.set(state.isDot, state.currentAdmin.username + '#' + currentSession.username, false);
			state.currentSession = currentSession;
		},
		addMessage (state,msg) {
			let mss = state.sessions[state.currentAdmin.username + '#' + msg.to];
            if(!mss){
                // 无法监听到实时显示
                //state.sessions[state.currentAdmin.username + '#' + msg.to] = [];
                // state.sessions 就可以被vue监听到，当sessions发生变化时候，页面就会随变化而变化
                Vue.set(state.sessions, state.currentAdmin.username + '#' + msg.to, []);
            }
            state.sessions[state.currentAdmin.username + '#' + msg.to].push({
				content: msg.content,
				date: new Date(),
				self: !msg.notSelf
			})
		},
        INIT_DATA (state) {
            // 浏览器本地历史聊天记录 
            let data = localStorage.getItem('vue-chat-session');
             //console.log(data)
            if (data) {
                 state.sessions = JSON.parse(data);
            }
        },
        INIT_ADMINS(state, data){
            state.admins = data;
        }

    }, //异步
    actions:{
        initData (context) {
            context.commit('INIT_DATA');
            getRequest('/chat/admin').then(resp=>{
                if(resp){
                  context.commit('INIT_ADMINS',resp);
                }
            });
        },
        connect(context){
            context.state.stomp = Stomp.over(new SockJS('/ws/ep'));
            let token = window.sessionStorage.getItem('tokenStr');
            context.state.stomp.connect({'Auth-Token':token}, success => {
                context.state.stomp.subscribe('/user/queue/chat',msg => {
                    let receiveMsg = JSON.parse(msg.body);
                    console.log(receiveMsg);
                    if(!context.state.currentSession || receiveMsg.from != context.state.currentSession.username){
                        Notification.info({
                            title: '【'+ receiveMsg.fromNickName + '】发来一条消息',
                            message: receiveMsg.content.length > 10 ? receiveMsg.content.substr(0,10) : receiveMsg.content,
                            position: 'bottom-right'
                          });
                        Vue.set(context.state.isDot,context.state.currentAdmin.username +'#'+ receiveMsg.from, true); 
                    }   
                    receiveMsg.notSelf = true;
                    receiveMsg.to = receiveMsg.from;
                    context.commit('addMessage', receiveMsg);
                });
            },error=>{

            });
        }
    }
});

store.watch(function (state) {
    return state.sessions
  },function (val) {
    //console.log('CHANGE: ', val);
    localStorage.setItem('vue-chat-session', JSON.stringify(val));
  },{
    /*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
    deep:true
});
  
  
export default store;