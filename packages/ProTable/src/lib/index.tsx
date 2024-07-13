import React from 'react';
import { ParamsType, ProTableProps, UseFetchDataAction } from './type';
import { Table } from '@arco-design/web-react';


function TableRender<T extends Record<string, any>, U, ValueType>(
  props: ProTableProps<T, U, ValueType> & {
    action: UseFetchDataAction<any>;
  },
) {
  const {
    rowKey,
   ...rest
  } = props;

  const getTableProps = () => ({
    ...rest,
  });

  /** 默认的 table dom，如果是编辑模式，外面还要包个 form */
  const baseTableDom = (
    <Table<T> {...getTableProps()} rowKey={rowKey} />
  );
}

const ProTable = <
  T extends Record<string, any>,
  U extends ParamsType,
  ValueType,
>(
  props: ProTableProps<T, U, ValueType> & {
    defaultClassName: string;
  },
) => {
    return (
      <div>
        ProTable1
      </div>
    );
  };

export default ProTable;