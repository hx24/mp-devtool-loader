import Vue from 'vue'
import Recorder from './Recorder'
import { rewriteRequest } from './request'

const recorder = Vue.prototype.$recorder = new Recorder()

rewriteRequest(recorder)

console.log('WyMpDevtool初始化成功')
