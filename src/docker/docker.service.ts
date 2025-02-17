import { Injectable } from '@nestjs/common';
import * as tar from 'tar-stream';
import * as Docker from 'dockerode';
import { Readable } from 'stream';

export class BuildResult {
  success: boolean;
  message: string;
  logs: string[];

  constructor(success: boolean, message: string, logs: string[]) {
    this.success = success;
    this.message = message;
    this.logs = logs;
  }
}

@Injectable()
export class DockerService {
  private docker: Docker;
  constructor() {
    this.docker = new Docker();
  }

  async buildImageFromDockerfileContent(
    dockerfileContent: string,
    imageName: string,
    tag: string = 'latest',
  ): Promise<BuildResult> {
    let logs: string[] = [];
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
      const stream: NodeJS.ReadableStream = await this.docker.buildImage(
        tarStream,
        {
          t: `${imageName}:${tag}`, // 镜像名称和标签
        },
      );

      // 监听构建输出
      await new Promise((resolve, reject) => {
        this.docker.modem.followProgress(
          stream,
          (err: Error, res: any) => {
            if (err) return reject(err);
            logs.push(`${res}`);
            resolve(res);
          },
          (event: any) => {
            logs.push(`${event.stream}`);
          },
        );
      });
      console.log(`Image ${imageName}:${tag} built successfully!`);
      return new BuildResult(true, 'Build successful', logs);
    } catch (error) {
      console.error('Error building Docker image:', error);
      return new BuildResult(false, 'Build failed', logs);
    }
  }

  async createImage(fromImage: string, tag: string) {
    await this.docker.createImage(
      { fromImage, tag },
      (err: Error, stream: NodeJS.ReadableStream) => {
        if (err) {
          console.error(err);
          return;
        }
        stream.pipe(process.stdout);
      },
    );
  }
}
