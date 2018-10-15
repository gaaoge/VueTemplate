import Vue from 'vue'
import NewsappShare from 'newsapp-share'
import { getStaticPath, getAbsPath, toSearchParams } from '@/utils'
import { trackEvent } from '@/utils/track'

const TOAST_CONFIG = 'TOAST_CONFIG'
const MODAL_CONFIG = 'MODAL_CONFIG'
const SHARE_CONFIG = 'SHARE_CONFIG'

const stores = {
  state: {
    toastConfig: {},
    modalConfig: {},
    shareConfig: {}
  },
  mutations: {
    [TOAST_CONFIG] (state, payload) {
      state.toastConfig = payload
    },
    [MODAL_CONFIG] (state, payload) {
      state.modalConfig = payload
    },
    [SHARE_CONFIG] (state, payload) {
      state.shareConfig = payload
    }
  },
  actions: {
    toast ({ state, commit }, payload) {
      if (state.toastConfig.timer) {
        clearTimeout(state.toastConfig.timer)
        commit(TOAST_CONFIG, {})
      }
      let timer = setTimeout(() => {
        commit(TOAST_CONFIG, {})
      }, 2000)

      Vue.nextTick(() => {
        commit(TOAST_CONFIG, {
          isShow: true,
          content: payload,
          timer
        })
      })
    },
    openDialog ({ commit }, payload = {}) {
      if (typeof payload === 'string') {
        payload = { dialog: payload }
      }

      commit(MODAL_CONFIG, {
        isShow: true,
        ...payload
      })
    },
    closeDialog ({ commit }) {
      commit(MODAL_CONFIG, {})
    },
    updateShareConfig ({ state, commit }, payload = {}) {
      let shareConfig = Object.assign({
        title: '分享标题',
        desc: '分享描述',
        imgUrl: getStaticPath('share-icon.png'),
        link: getAbsPath(),
        shareDone: () => {
          // 统计
          trackEvent('sharedone')
        },
        onlyImg: false
      }, state.shareConfig, payload)

      commit(SHARE_CONFIG, shareConfig)
      NewsappShare.config(shareConfig)
    },
    async share ({ state }, payload = {}) {
      return new Promise((resolve, reject) => {
        payload.shareConfig && NewsappShare.config(payload.shareConfig)

        const shareDone = state.shareConfig.shareDone
        NewsappShare.config({
          shareDone: () => {
            NewsappShare.config(state.shareConfig)
            shareDone()
            resolve()
          }
        })
        NewsappShare.show(payload.tag)
      })
    },
    async fetch ({ state, commit, dispatch }, payload = {}) {
      let { url, method = 'get', params, credentials = 'include' } = payload

      // 配置url和method
      if (!/^(https?:)?\/\//.test(url)) {
        if (process.env.NODE_ENV === 'development') {
          let host = window.location.origin + '/api'
          url = host + url.replace(/[?#].*/, '') + '.json'
          method = 'get'
        } else {
          let host = window.location.origin + '/api'  //api代表后台api路径
          url = host + url
          method = method.toLowerCase()
        }
      }

      // 配置headers和body
      let headers = {}
      let body
      if (method === 'post') {
        headers['Content-Type'] = 'application/x-www-form-urlencoded'
        body = toSearchParams(params)
      }

      // 发送fetch请求
      let data
      try {
        let response = await window.fetch(url, {
          method,
          headers,
          body,
          credentials
        })
        data = await response.json()
      } catch (e) {
        dispatch('toast', '网络请求出错')
        throw new Error('网络请求出错')
      }

      // 处理请求返回结果
      if (data.code !== 200) {
        switch (data.code) {
          default:
            dispatch('toast', data.message)
            break
        }

        let err = new Error(data.message)
        err.code = data.code
        throw err
      }

      return data
    },
    async sleep ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, payload)
      })
    }
  }
}

export default stores
