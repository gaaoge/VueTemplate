import NewsappShare from '@newsapp-activity/newsapp-share'
import { getAbsPath, getStaticPath, expandFunc } from '@/utils'
import { trackEvent } from '@/utils/track'
import * as jsBridge from '@mf2e/js-bridge'

window.jsBridge = jsBridge
const defaultConfig = {
  title: '默认分享标题',
  desc: '默认分享描述',
  imgUrl: getStaticPath('share-icon.png'),
  link: getAbsPath() + '?spss=share',
  onlyImg: false,
  shareBefore: () => {
    trackEvent('click_share')
  },
  shareDone: res => {
    if (res && res.scene === 'favorite') {
      trackEvent('favorite')
    } else {
      trackEvent('sharedone')
    }
  }
}
let customConfig = {}

function updateShareConfig(config = {}) {
  config.shareBefore = expandFunc(config.shareBefore, defaultConfig.shareBefore)
  config.shareDone = expandFunc(config.shareDone, defaultConfig.shareDone)

  customConfig = Object.assign({}, defaultConfig, config)
  NewsappShare.config(customConfig)
}

function shareWithConfig(config = {}, tag) {
  config.shareBefore = expandFunc(config.shareBefore, defaultConfig.shareBefore)
  config.shareDone = expandFunc(config.shareDone, defaultConfig.shareDone)
  config.shareDone = expandFunc(config.shareDone, () => {
    updateShareConfig(customConfig)
  })

  NewsappShare.config(config)
  NewsappShare.show(tag)
}

export { updateShareConfig, shareWithConfig }
