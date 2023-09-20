// websocket信息
var WEBRTC;
var WEBRTCEngine = function (wsUrl) {
    this.init(wsUrl);
    WEBRTC = this;
    console.log(this);
    return this;
}
// 初始化传地址
WEBRTCEngine.prototype.init = function (wsUrl) {
    // 设置websocket  url
    this.wsUrl = wsUrl;
    /** websocket对象 */
    this.signaling = null;
}
WEBRTCEngine.prototype.createWebsocket = function () {
    WEBRTC = this;
    WEBRTC.signaling = new WebSocket(this.wsUrl);

    RTCengine.signaling.onopen = function () {
        WEBRTC.onOpen();
    }

    RTCengine.signaling.onmessage = function (ev) {
        WEBRTC.onMessage(ev);
        // 这个地方渲染聊天记录？
    }

    RTCengine.signaling.onerror = function (ev) {
        WEBRTC.onError(ev);
    }
 
    RTCengine.signaling.onclose = function (ev) {
        WEBRTC.onClose(ev);
    }
}