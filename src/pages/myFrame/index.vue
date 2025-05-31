<script setup lang="ts">
import { useRouter } from 'vue-router'
import setPageTitle from '@/utils/set-page-title'
import { onMounted, ref } from 'vue'
import { BrowserMultiFormatReader } from '@zxing/library'

const router = useRouter()
const route = useRoute()

const { redirect, ...othersQuery } = router.currentRoute.value.query
const frameSrc = ref('')
if (redirect === 'https://easy-temps.github.io/easy-docs/vue3-vant-mobile/') {
  const title = '文档中心title'
  const i18n = '文档中心i18n'
  frameSrc.value = redirect
  // router.currentRoute.value.meta.title = title
  // router.currentRoute.value.meta.i18n = i18n
  route.meta.title = title
  route.meta.i18n = i18n
  setPageTitle(title)
}
const frameRef = ref(null)
const frameLoading = ref(true)
console.warn(frameRef)
console.warn(frameLoading.value)

const message = ref('')
let codeReader = null
let selectedDeviceId = ''
const mask = ref(false)

function init() {
  // 识别和处理多种常见的条形码和二维码格式
  codeReader = new BrowserMultiFormatReader()
  // 获取当前设备上可用的视频输入设备列表
  codeReader.getVideoInputDevices().then((videoInputDevices) => {
    if (videoInputDevices.length > 1) {
      // 后缀摄像头（手机）
      selectedDeviceId = videoInputDevices[1].deviceId
    }
    else {
      // 前置摄像头
      selectedDeviceId = videoInputDevices[0].deviceId
    }
  })
}

onMounted(() => {
  frameRef.value.onload = function () {
    //    后续操作
    frameLoading.value = false
    console.warn(frameLoading.value)
  }
  init()
})

function scanner() {
  mask.value = true
  message.value = ''
  // 自动打开指定的视频输入设备，并实时对视频流中的每一帧图像进行条形码和二维码的解码操作，此方法不是只进行一次解码尝试，而是在视频流持续传输的过程中，不断地对每一帧图像进行解码分析
  codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
    if (result) {
      message.value = result.text
      close()
    }
    if (err) {
      console.warn(err)
    }
  })
}

function close() {
  codeReader.reset()
  // message.value = '';
  mask.value = false
}

onBeforeRouteLeave(() => {
  close()
})

console.warn(frameLoading.value)
console.warn(router, route, redirect, othersQuery)
</script>

<template>
  <div>
    <button @click="scanner">
      扫码
    </button>&nbsp;
    <button @click="close">
      关闭
    </button>&nbsp;
    <div v-if="mask" class="scanContainer">
      <video id="video" />
      <div class="mask" />
      <div class="" style="position: absolute;right:10px;bottom:0" @click="close">
        关闭
      </div>
    </div>
    <h4>识别到的信息：<span style="color: red;">{{ message }}</span></h4>
    <van-empty
      v-show="frameLoading"
      description="页面加载中"
    />
    <iframe
      v-show="!frameLoading" ref="frameRef"
      style="width:100%;height:500px"
      :src="frameSrc"
    />
  </div>
</template>

<route lang="json5">
{
name: 'myFrame',
meta: {
title: 'Frame',
i18n: 'myFrame'
},
}
</route>

<style>
.scanContainer {
  width: 100%;
  height: 60vh;
  position: relative;
  margin-top: 10px;
  overflow: hidden;
}

.scanContainer > video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mask {
  position: absolute;
  left: 15%;
  top: 20%;
  max-width: 100%;
  width: 70%;
  height: 60%;
  border-radius: 2px;
  outline: rgba(0, 0, 0, 0.25) solid 20vmax;
}
</style>
