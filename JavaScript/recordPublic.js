window.addEventListener('load', () => {
    let recorder;
    let audio = document.querySelector('audio');
    const id = window.location.search.substring(1);

    function startRecording() {
        HZRecorder.get(function(rec) {
            recorder = rec;
            recorder.start();
        });
    }

    function stopRecording() {
        recorder.stop();
    }

    function playRecording() {
        recorder.play(audio);
    }

    function cancelAudio() {
        recorder.stop();
        recorder.clear();
    }

    function uploadAudio(audio) {
        recorder.upload("http://localhost:8080/team_project/file/uploadVoice", audio, (state, e) => {
            switch (state) {
                case 'uploading':
                    break;
                case 'ok':
                    alert("上传成功");
                    break;
                case 'error':
                    alert("上传失败");
                    break;
                case 'cancel':
                    alert("上传被取消");
                    break;
            }
        });
    }


    const addAudio = document.querySelector('.addAudio'); //获取添加录音按钮
    const putOnTheBeach = document.querySelector('.putOnTheBeach'); //放到海滩，并且上传到后端数据库
    const recording = document.querySelector('.recording'); //正在录制中区域
    const recordTip = document.querySelector('.recordTip'); //提示文本
    const btn_record = document.querySelector('.btn_record'); //点击开始录音按钮
    const text_record = document.querySelector('.text_record'); //点击录音文本
    const time_record = document.querySelector('.time_record'); //计时器
    const finish_record = document.querySelector('.finish_record'); //完成录制按钮
    const preview = document.querySelector('.preview'); //录音预览区
    const play_audio = preview.querySelector('.play_audio'); //播放音频
    const cancle_audio = preview.querySelector('.cancle_audio'); //取消音频


    let timer = null;

    function Count(time_record, flag) {
        let count = 0; //点击开始计数
        flag == true ? timer = setInterval(function() {
            count++;
            time_record.children[0].innerHTML = count;
        }, 1000) : clearInterval(timer);

    }
    //点击添加录音
    addAudio.addEventListener('click', () => {
        recordTip.style.display = 'none'; //隐藏提示文本
        recording.style.display = 'block'; //显示正在录制中区域
        addAudio.style.display = 'none'; //隐藏添加语言按钮
        btn_record.children[0].src = '../Images/btn_record.png';
        finish_record.style.display = 'none';
        btn_record.addEventListener('click', () => {
            startRecording(); //录音
            btn_record.children[0].src = '../Images/btn_record.gif';
            text_record.innerHTML = '正在录制';
            text_record.className = 'text_record_click'; //添加类名
            time_record.children[0].innerHTML = '0';
            finish_record.style.display = 'block';
            Count(time_record, true); //调用计数函数
        })
    });
    //点击完成录制
    finish_record.addEventListener('click', () => {
        stopRecording(); //暂停
        recording.style.display = 'none'; //隐藏正在录制中区域
        preview.style.display = 'block'; //显示预览区
        btn_record.children[0].src = '../Images/btn_record.png';
        text_record.innerHTML = '点击录音';
        text_record.className = 'text_record'; //改变类名
        time_record.children[0].innerHTML = '0';
        finish_record.style.display = 'none';
        Count(time_record, false); //清空计数器

    });
    //点击取消录音
    cancle_audio.addEventListener('click', () => {
        cancelAudio(); //取消
        startRecording(); //录音
        preview.style.display = 'none'; //隐藏预览区
        recording.style.display = 'block'; //显示正在录制中区域
    });
    //点击播放录音
    play_audio.addEventListener('click', () => {
        playRecording(); //播放
    });



    const conchData = ['../Images/conchOne.png', '../Images/conchTwo.png', '../Images/conchThree.png', '../Images/conchFour.png']; //定义数组存储海螺图片
    const conches = document.querySelectorAll('.conch'); //获取海螺
    const bubblesAudio = document.querySelectorAll('.bubblesAudio');

    //点击放到海滩按钮，上传录音，生成海螺
    putOnTheBeach.addEventListener('click', () => {
        recording.style.display = 'none'; //隐藏正在录制中区域
        preview.style.display = 'none'; //隐藏预览区
        recordTip.style.display = 'block'; //显示提示文本
        addAudio.style.display = 'block'; //显示添加语言按钮

        let index = Math.floor((Math.random() * conches.length)); //随机获取一个海螺的索引
        const audio = conches[index].querySelector('audio');
        let img = document.createElement('img');
        img.src = conchData[index];
        conches[index].children[0].innerHTML = '';
        conches[index].children[0].appendChild(img); //为海螺添加图片
        conches[index].style.display = 'block'; //随机显示海螺
        uploadAudio(audio); //上传
        for (let i = 0; i < conches.length; i++) {
            //点击播放按钮播放录音，切换图片
            tabAudio(bubblesAudio, conches[i].querySelector('audio'), i);
        }
    });


    console.log(id);
    //获取海螺的随机音频
    ajax({
        url: "http://localhost:8080/team_project/island/getVoiceRandom", // url---->地址
        type: "POST", // type ---> 请求方式
        async: true, // async----> 同步：false，异步：true 
        data: {
            "belong": id,
            "size": 4
        }, //传入信息
        success: function(result) { //返回接受信息
            if (result.data.voices.length >= 4) {
                for (let i = 0; i < 4; i++) {
                    //调用获取随机音频函数
                    getRamdomAudio(conches, bubblesAudio, result, i);
                }
            } else {
                for (let i = 0; i < result.data.voices.length; i++) {
                    //调用获取随机音频函数
                    getRamdomAudio(conches, bubblesAudio, result, i);
                }
            }
        },
        error: function(error) {
            console.log(error);
        }
    });


    //封装获取随机音频函数
    function getRamdomAudio(conches, bubblesAudio, result, i) {
        console.log(result);
        const audio = conches[i].querySelector('audio');
        const img = document.createElement('img');
        img.src = conchData[i];
        conches[i].children[0].innerHTML = '';
        conches[i].children[0].appendChild(img); //为海螺添加图片
        conches[i].style.display = 'block';
        audio.src = result.data.voices[i].voiceUrl; //渲染音频

        //调用切换音频和按钮函数
        tabAudio(bubblesAudio, audio, i);
    }

    function tabAudio(bubblesAudio, audio, i) {
        bubblesAudio[i].addEventListener('click', () => {
            if (bubblesAudio[i].children[0].src.match('action')) {
                bubblesAudio[i].children[0].src = '../Images/bubble_pause.png';
                audio.play();
            } else {
                bubblesAudio[i].children[0].src = '../Images/action.png';
                audio.pause();
                //若检测到音频播放完毕则停止播放音频
                audio.addEventListener('ended', () => {
                    bubblesAudio[i].children[0].src = '../Images/action.png';
                    audio.pause();
                })
            }
        })
    }

})