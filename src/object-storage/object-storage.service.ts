import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as path from 'path';

const wasabiEndpoint = new AWS.Endpoint('s3.wasabisys.com');

@Injectable()
export class ObjectStorageService {

  AWS_S3_BUCKET = 'aatbip';

  s3 = new AWS.S3({
    endpoint: wasabiEndpoint,
    accessKeyId: '3EKVA19BJ72HO5QN6AQV',
    secretAccessKey: 'uY4JkU381m8vY4Zqr8OBfHPk67jgupTSV7PrBzsO',
  });

  async uploadFile(file, name) {
    console.log(file);

    return await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      name,
      file.mimetype,
    );
  }

  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };

    try {
      let s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (e) {
      console.log(e);
    }
  }

  async deleteS3Files(keys: any) {

    let params = {
      Bucket: this.AWS_S3_BUCKET,
      Delete: {
        Objects: [...keys.map((el: any) => {
          return {
            Key: el
          }
        })],
        Quiet: false
      }
    }
    try {
      await this.s3.deleteObjects(params).promise();
    } catch (e) {
      console.log(e);
    }
  }

}
