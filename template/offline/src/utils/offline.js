/**
 * 离线工具类
 * Created by GG on 2019/12/16.
 */

import { invoke, isAvailable } from '@mf2e/js-bridge'

// render上报
renderStart()
document.addEventListener('DOMContentLoaded', renderEnd)

function invokeIfAvailable(name, params, needResult) {
  if (isAvailable(name)) {
    return invoke(name, params, needResult)
  }
}

function renderStart() {
  invokeIfAvailable('updateFailType', { failType: '2002' }, false)
}

function requestStart() {
  invokeIfAvailable('updateFailType', { failType: '2003' }, false)
}

function requestEnd() {
  invokeIfAvailable('updateFailType', { failType: '2004' }, false)
}

let isRender
function renderEnd() {
  if (isRender) return

  invokeIfAvailable('render', { timestamp: { render: Date.now() } }, false)
  isRender = true
}

export { invokeIfAvailable, renderStart, requestStart, requestEnd, renderEnd }
