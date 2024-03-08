// const JSZip = require('jszip');
// const saveAs = require('file-saver').saveAs;

// let _maghskCounter = 0;
// let _maghskImages: any[] = []; // 用于保存canvas截图的数组

// function maghskIncrementCounter() {
//     if (_maghskCounter < 100) {
//         console.log('截图');
//         let canvas = document.querySelector('canvas')!; // 获取页面中的canvas元素
//         canvas.toBlob((blob) => {
//             let reader = new FileReader();
//             reader.onloadend = function () {
//                 let base64data = reader.result as string;
//                 _maghskImages.push({ name: `screenshot_${_maghskCounter}.png`, data: base64data.split(',')[1] });
//             }
//             reader.readAsDataURL(blob!);
//         }, 'image/png');
//         _maghskCounter++;
//         setTimeout(maghskIncrementCounter, 50);
//     } else {
//         let zip = new JSZip();
//         _maghskImages.forEach((image) => {
//             zip.file(image.name, image.data, { base64: true }); // 将图像添加到zip文件中
//         });

//         const title = document.title;

//         // 生成zip文件并下载
//         zip.generateAsync({ type: "blob" })
//             .then(function (content: any) {
//                 saveAs(content, `${title} - screenshots.zip`);
//             });
//     }
// }

// setTimeout(() => {
//     maghskIncrementCounter();
// }, 5000);

///////////-----------------////////////////////


setTimeout(() => {
    const canvas = document.querySelector('canvas');
    const stream = canvas!.captureStream(60); // 30 frames per second

    let recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9', // Lossless VP9 codec
        bitsPerSecond: 10_000_000, // 10Mbps
    });

    let chunks: any = [];

    recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            chunks.push(event.data);
        }
    };

    recorder.onstop = () => {
        let blob = new Blob(chunks, { type: 'video/webm' });
        let url = URL.createObjectURL(blob);

        let a = document.createElement('a');
        document.body.appendChild(a);
        a.href = url;
        a.download = 'recorded-video.webm';
        a.click();

        URL.revokeObjectURL(url);
    };
    recorder.start();
    setTimeout(() => {
        recorder.stop();
    }, 5000); // Stop recording after 5000ms
}, 5000); // Start recording after 5000ms
