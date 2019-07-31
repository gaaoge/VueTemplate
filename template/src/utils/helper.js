import { loadScript } from '@/utils/index'
import { register } from 'register-service-worker'

// 移动端console
if (process.env.NODE_ENV === 'development' || /debug/gi.test(location.hash)) {
  loadScript('//cdn.jsdelivr.net/npm/eruda', () => {
    window.eruda.init()
  })
}

if (process.env.NODE_ENV === 'production') {
  // 统计及错误监控
  loadScript('//static.ws.126.net/163/frontend/antnest/NTM-BXR8M5Z5-1.js')

  // 离线缓存Service Worker
  register('service-worker.js', {
    registrationOptions: { scope: './' }
  })
}
