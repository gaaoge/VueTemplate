import Vue from 'vue'
import { toSearchParams } from '@/utils'

const MODAL_CONFIG = 'MODAL_CONFIG'
const TOAST_CONFIG = 'TOAST_CONFIG'

const stores = {
  state: {
    modalConfig: {},
    toastConfig: {}
  },
  mutations: {
    [MODAL_CONFIG] (state, payload) {
      state.modalConfig = payload
    },
    [TOAST_CONFIG] (state, payload) {
      state.toastConfig = payload
    }
  },
  actions: {
    openDialog ({ commit }, payload = {}) {
      commit(MODAL_CONFIG, {
        isShow: true,
        ...payload
      })
    },
    closeDialog ({ commit }) {
      commit(MODAL_CONFIG, {})
    },
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
    async fetch ({ state, commit, dispatch }, payload = {}) {
      let { url, method = 'get', params, credentials = 'include' } = payload

      // 配置url和method
      if (!/^(https?:)?\/\//.test(url) && process.env.NODE_ENV === 'production') {
        let isTest = /wp\.m\.163\.com\/163\/test/.test(window.location.href)
        let host = isTest ? process.env.VUE_APP_TEST_HOST : process.env.VUE_APP_PUBLISH_HOST
        url = host + url
      }
      method = method.toLowerCase()
      if (method === 'get' && params) {
        url = url + '?' + toSearchParams(params)
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