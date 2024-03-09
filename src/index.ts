import JSZip = require('jszip');
const saveAs = require('file-saver').saveAs;

let _maghskCounter = 0;
let _maghskImages: any[] = []; // 用于保存canvas截图的数组
let canvas: HTMLCanvasElement; // 获取页面中的canvas元素

setTimeout(() => {
    canvas = document.querySelector('canvas')!; // 获取页面中的canvas元素
}, 1000);

function maghskIncrementCounter() {
    if (_maghskCounter < 100) {
        console.log('截图');
        const _counter = _maghskCounter;
        canvas.toBlob((blob: Blob | null) => {
            let reader = new FileReader();
            reader.onloadend = function () {
                let base64data = reader.result as string;
                _maghskImages.push({ name: `screenshot_${_counter}.png`, data: base64data.split(',')[1] });
            }
            reader.onerror = function (error) {
                console.error('Error: ', error);
            }
            reader.onabort = function () {
                console.error('读取中断');
            }
            reader.readAsDataURL(blob!);
        }, 'image/png', 1);
        _maghskCounter++;
        requestAnimationFrame(maghskIncrementCounter);
    } else {
        console.log(_maghskImages.length);
        if (_maghskImages.length < 100) {
            requestAnimationFrame(maghskIncrementCounter);
            return;
        }
        console.log('截图完成');
        // @ts-ignore
        window._maghskImages = _maghskImages;
        let zip = new JSZip();
        console.log(_maghskImages.length);
        _maghskImages.forEach((image) => {
            zip.file(image.name, image.data, { base64: true }); // 将图像添加到zip文件中
        });

        const title = document.title;

        // 生成zip文件并下载
        zip.generateAsync({ type: "blob" })
            .then(function (content: any) {
                saveAs(content, `${title}-webgl-30fps.zip`);
            });
    }
}

var intervalId: any;


// @ts-ignore
if (sessionStorage.getItem('HYD_LOAD_KEY') === 'on') {
    console.log('no bundle screenshot');
} else {
    setTimeout(() => {
        // intervalId = setInterval(maghskIncrementCounter, 100);
        requestAnimationFrame(maghskIncrementCounter);
    }, 5000);
}

///////////-----------------////////////////////


// setTimeout(() => {
//     const canvas = document.querySelector('canvas');
//     const stream = canvas!.captureStream(60); // 30 frames per second

//     let recorder = new MediaRecorder(stream, {
//         mimeType: 'video/webm;codecs=vp9', // Lossless VP9 codec
//         bitsPerSecond: 10_000_000, // 10Mbps
//     });

//     let chunks: any = [];

//     recorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//             chunks.push(event.data);
//         }
//     };

//     recorder.onstop = () => {
//         let blob = new Blob(chunks, { type: 'video/webm' });
//         let url = URL.createObjectURL(blob);

//         let a = document.createElement('a');
//         document.body.appendChild(a);
//         a.href = url;
//         a.download = 'recorded-video.webm';
//         a.click();

//         URL.revokeObjectURL(url);
//     };
//     recorder.start();
//     setTimeout(() => {
//         recorder.stop();
//     }, 5000); // Stop recording after 5000ms
// }, 5000); // Start recording after 5000ms
