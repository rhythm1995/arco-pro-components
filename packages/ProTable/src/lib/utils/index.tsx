type PostDataType<T> = (data: T) => T;

/**
 * 一个转化的 pipeline 列表
 * 创建一个数据处理的管道，用户可以通过提供一个 pipeline 数组来定义处理逻辑
 *
 * @param data
 * @param pipeline
 */

export function postDataPipeline<T>(data: T, pipeline: PostDataType<T>[]) {
  if (pipeline.filter((item) => item).length < 1) {
    return data;
  }
  return pipeline.reduce((pre, postData) => {
    return postData(pre);
  }, data);
}

