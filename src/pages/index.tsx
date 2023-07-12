import { FC, useEffect, useReducer, DragEvent, useRef } from 'react';
import {
  SelectedItemTypes,
  MessageChildDataProps,
  WidgetTypes,
} from '@kp-react-visual-design/design';
import * as widgets from '@kuping/oto_component';
import * as fucWidgets from '@kp-react-visual-design/widgets';
import { ReactSortable } from 'react-sortablejs';
import { Button, Popconfirm, message, Empty } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import _, { debounce } from 'lodash';
import { Drop } from '../components';
import './index.less';

type PreviewProps = Pick<
  MessageChildDataProps,
  'selectedList' | 'widgetName' | 'activeIndex'
> & {
  isDragging: boolean;
  isPreviewing: boolean;
  initialWidgets: WidgetTypes[];
  appCode: string;
  dragingIndex: number;
  surplusHeiht: number;
};

// 不能重复
const notRepeat = [
  'FooterNav',
  'Header',
  'MasonryLayouts',
  'SearchInput',
  'DailyDiscount',
  'LocalShopping',
  'SearchInputAndIconsAndCarousel',
];
// 不能在下面
const notBelow = ['FooterNav'];
// 不能在上面
const notTop = ['Header'];

const initialState: PreviewProps = {
  selectedList: [],
  activeIndex: 0,
  widgetName: '',
  dragingIndex: -1,
  isDragging: false,
  isPreviewing: false,
  initialWidgets: [],
  appCode: '',
  surplusHeiht: 0,
};

const Preview: FC = () => {
  const [
    {
      selectedList,
      isPreviewing,
      isDragging,
      dragingIndex,
      activeIndex,
      initialWidgets,
      appCode,
      surplusHeiht,
    },
    dispatch,
  ] = useReducer(
    (state: PreviewProps, newState: Partial<PreviewProps>) => ({
      ...state,
      ...newState,
    }),
    initialState,
  );

  const containerRef = useRef<HTMLDivElement>(null); // 用户C端端滚动事件的scrollTop值计算

  const handleChangeSelectedList = (list: SelectedItemTypes[]) => {
    if (!list.length) return;
    const changeIndex = list.findIndex(
      (item) => item.id === selectedList[activeIndex].id,
    );
    window.parentIFrame.sendMessage({
      method: 'onChangeState',
      data: {
        selectedList: list,
        activeIndex: changeIndex === -1 ? 0 : changeIndex,
      },
    });
  };

  const hanldleClickEditItem = (widgetName: string, index: number) => {
    if (activeIndex === index) return;
    window.parentIFrame.sendMessage({
      method: 'onClickEditItem',
      data: {
        activeIndex: index,
        schema: initialWidgets.find((item) => item.en === widgetName)?.schema,
        isPreviewing: false,
      },
    });
  };

  const handleDrop = (e: DragEvent<Element>) => {
    if (dragingIndex < 0) return message.error('拖的太快了 〃>_<;〃');
    const widgetName: string = e.dataTransfer?.getData('widgetName') || '';
    const isRepeat = selectedList.some(
      (item: SelectedItemTypes) => item.name === widgetName,
    );
    const hasFooterNav = selectedList.some((item: SelectedItemTypes) =>
      notBelow.includes(item.name),
    );
    const { schema, data } =
      initialWidgets.find((item) => item.en === widgetName) || {};
    if (
      !{
        ...widgets,
        ...fucWidgets,
      }[widgetName]
    )
      return message.error('组件库不存在该组件，请联系开发人员');

    if (!schema && !data)
      return message.error('请先配置挂件默认数据和默认配置项');
    if (!schema) return message.error('「Schema」不能为空');
    if (isRepeat && notRepeat.includes(widgetName))
      // 不能重复添加
      return message.error('仅可展示一个此组件');

    if (hasFooterNav && dragingIndex === selectedList.length)
      // 不能添加到挂件下面
      return message.error(`请勿将挂件添加至「底部导航」之下`);
    if (dragingIndex === 0)
      return message.error(`请勿将挂件添加至「页面全局配置」之上`);

    window.parentIFrame.sendMessage({
      method: 'onDropAddItem',
      data: {
        widgetName,
        schema,
        activeIndex: dragingIndex,
        selectedList,
        defaultData: data,
        error: '',
      },
    });
  };

  const hanldeClickOk = (index: number) => {
    const newSelectedList = JSON.parse(JSON.stringify(selectedList));
    newSelectedList.splice(index, 1);
    window.parentIFrame.sendMessage({
      method: 'onClickDelete',
      data: {
        selectedList: newSelectedList,
        activeIndex: 0,
        schema: initialWidgets.find((item) => item.en === selectedList[0]?.name)
          ?.schema,
      },
    });
  };

  const handleDragOver = debounce((e: DragEvent, index: number) => {
    const { height, top } = (e.target as HTMLElement).getBoundingClientRect();
    if (e.clientY < top + height / 2) {
      dispatch({ dragingIndex: index });
    } else {
      dispatch({ dragingIndex: index + 1 });
    }
  }, 8);

  useEffect(() => {
    window.iFrameResizer = {
      onMessage: dispatch,
    };
  }, []);

  useEffect(() => {
    if (!isDragging) {
      dispatch({ dragingIndex: -1 });
    }
  }, [isDragging]);

  useEffect(() => {
    if (!selectedList.length) return;
    const global = selectedList.find(
      (item: SelectedItemTypes) => item.name === 'Header',
    );
    document.body.style.cssText = `background-color: ${global?.data?.dataSource.bodyStyle.backgroundColor}; background-image: url(${global?.data?.dataSource.topImage})`;
  }, [selectedList]);

  useEffect(() => {
    const domain =
      process.env.NODE_ENV === 'development'
        ? location.hostname
        : `justcodej.github.io`;
    document.domain = domain;
  }, []);

  /**
   * 动态计算可拖拽剩余高度
   */
  useEffect(() => {
    if (!isDragging) {
      dispatch({ surplusHeiht: 0 });
      return;
    }
    if (!(innerHeight > document.body.offsetHeight)) return;
    dispatch({ surplusHeiht: innerHeight - document.body.offsetHeight });
  }, [isDragging]);

  return (
    <div className="container" ref={containerRef}>
      {isPreviewing ? (
        <>
          {selectedList.map((item: SelectedItemTypes) => {
            const Comp = (
              {
                ...widgets,
                ...fucWidgets,
              } as any
            )[item.name] || <div>未成功引入组件</div>;
            return (
              <div className="widget-item" key={item.id}>
                <div
                  className={classNames('widget-item-view', {
                    'is-previewing': isPreviewing,
                  })}
                >
                  <Comp
                    scrollContainer={containerRef?.current}
                    data={item.data}
                    appCode={appCode}
                    emptyDataVisible
                  />
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <>
          <ReactSortable list={selectedList} setList={handleChangeSelectedList}>
            {selectedList.map((item: SelectedItemTypes, index: number) => {
              const Comp = (
                {
                  ...widgets,
                  ...fucWidgets,
                } as any
              )[item.name] || <div>未成功引入组件</div>;
              return (
                <div
                  className={classNames('widget-item', {
                    'is-before': dragingIndex === index,
                    'is-after':
                      (dragingIndex === selectedList.length &&
                        index === selectedList.length - 1) ||
                      (dragingIndex > selectedList.length &&
                        index === selectedList.length - 1),
                  })}
                  key={item.id}
                >
                  <div
                    className={classNames('widget-item-view', {
                      'is-previewing': isPreviewing,
                      active: activeIndex === index,
                    })}
                    onClick={() => hanldleClickEditItem(item.name, index)}
                  >
                    <Comp
                      scrollContainer={containerRef?.current}
                      data={item.data}
                      appCode={appCode}
                      emptyDataVisible
                    />
                    {item.name !== 'Header' && (
                      <div className="widget-item-controls">
                        <Button.Group size="small">
                          <Button type="primary">
                            {Comp.defaultProps?.attr?.name}
                          </Button>
                          <Popconfirm
                            title={`确定删除组件吗？`}
                            onConfirm={() => hanldeClickOk(index)}
                            placement="leftBottom"
                            okText="确定"
                            cancelText="取消"
                          >
                            <Button
                              type="primary"
                              icon={<CloseOutlined />}
                            ></Button>
                          </Popconfirm>
                        </Button.Group>
                      </div>
                    )}
                  </div>
                  <Drop
                    visible={isDragging}
                    onDrop={handleDrop}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnter={(e) => handleDragOver(e, index)}
                  />
                </div>
              );
            })}
            <Drop
              className="rest-area"
              visible={isDragging && !!surplusHeiht}
              onDrop={handleDrop}
              onDragOver={(e) => handleDragOver(e, selectedList.length)}
              onDragEnter={(e) => handleDragOver(e, selectedList.length)}
              style={{ height: surplusHeiht }}
            />
          </ReactSortable>
          {!selectedList.length && !isDragging && (
            <Empty
              description="暂无数据"
              style={{
                height: '100vh',
                paddingTop: 140,
                margin: 0,
                backgroundColor: '#f8f8f8',
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Preview;
