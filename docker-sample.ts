import * as Docker from 'dockerode';
import * as tar from 'tar-stream'
import { Readable, Writable } from 'stream';

const docker = new Docker();

// docker.createImage({ fromImage: 'ubuntu', tag: 'latest' }, (err, stream) => {
//     if (err) {
//         console.error(err);
//         return;
//     }
//     stream.pipe(process.stdout);
// });

// docker.createImage(
//     { fromImage: 'python', tag: 'slim' },
//     (err: Error, stream: NodeJS.ReadableStream) => {
//     if (err) {
//         console.error(err);
//         return;
//     }
//     stream.pipe(process.stdout);
// });



// 定义构建镜像的函数
async function buildImageFromDockerfileContent(dockerfileContent: string, imageName: string, tag: string = 'latest') {
    try {
        // 创建一个 tar 包作为构建上下文
        const pack = tar.pack();

        // 将 Dockerfile 内容添加到 tar 包中
        pack.entry({ name: 'Dockerfile' }, dockerfileContent);

        // 结束 tar 包
        pack.finalize();

        // 将 tar 包转换为可读流
        const tarStream: Readable = new Readable().wrap(pack);

        // 构建镜像
        const stream: NodeJS.ReadableStream = await docker.buildImage(tarStream, {
            t: `${imageName}:${tag}`, // 镜像名称和标签
        });

        // 监听构建输出
        await new Promise((resolve, reject) => {
            docker.modem.followProgress(stream, (err: Error, res: any) => {
                if (err) return reject(err);
                console.log(res);
                resolve(res);
            }, (event: any) => {
                console.log(event);
            });
        });

        console.log(`Image ${imageName}:${tag} built successfully!`);
    } catch (error) {
        console.error('Error building Docker image:', error);
    }
}

// 调用函数构建镜像
// const dockerfileContent = `
// FROM ubuntu:latest
// RUN apt-get update && apt-get install -y gcc
// `;
const dockerfileContent = `
FROM python:slim
RUN pip install --no-cache-dir numpy
`

const imageName = 'my-custom-image'; // 镜像名称
const tag = 'v1'; // 镜像标签

buildImageFromDockerfileContent(dockerfileContent, imageName, tag);
