import { Button, Col, Divider, Input, message, Row, Space, Table, Tag, theme, Tooltip } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import './index.css'
import { useEffect, useRef, useState } from "react";

const ExpertKnowMatchConfig = () => {

  const {token} = theme.useToken();
  const [tags, setTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputOrgValue, setInputOrgValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');
  const [tableData, setTableData] = useState([
    {
      key: 1,
      tableId: 1,
      orgName: 'Department of Justice',
      orgLabel: '美属萨摩亚;宾夕法尼亚大学;组织2的成员-经常寄递'
    },
    {
      key: 2,
      tableId: 2,
      orgName: 'Center for Strategic and International Studies',
      orgLabel: '美国;金融业;民主党;组织1--支持;阿根廷-经常入境的国家'
    },
    {
      key: 3,
      tableId: 3,
      orgName: 'Agricultural Research Service',
      orgLabel: '英国;农、林、牧、渔业;伊斯兰教;组织7-操纵组织'
    }
  ])
  const inputRef = useRef(null);
  const editInputRef = useRef(null);
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);
  useEffect(() => {
    editInputRef.current?.focus();
  }, [inputValue]);
  const handleClose = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };
  const showInput = () => {
    setInputVisible(true);
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };
  const handleEditInputChange = (e) => {
    setEditInputValue(e.target.value);
  };
  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setInputValue('');
  };
  const handleOrgInput = (e) => {
    setInputOrgValue(e.target.value)
  }
  const onCreateKnow = () => {
    if (inputOrgValue !== '' && tags.length > 0) {
      tableData.push({
        key: tableData.length + 1,
        tableId: tableData.length + 1,
        orgName: inputOrgValue,
        orgLabel: tags.join(';')
      })
      console.log(tableData)
      setTags([])
      setTableData([...tableData])
      setInputOrgValue('')
    } else {
      message.info('信息填写不全')
    }
  }
  const tagInputStyle = {
    width: 78,
    verticalAlign: 'top',
  }
  const tagPlusStyle = {
    background: token.colorBgContainer,
    borderStyle: 'dashed',
  }
  const columns = [
    {
      title: '序号',
      dataIndex: 'tableId',
      key: 'tableId'
    },
    {
      title: '组织名称',
      dataIndex: 'orgName',
      key: 'orgName'
    },
    {
      title: '标签描述',
      dataIndex: 'orgLabel',
      key: 'orgLabel'
    }
  ]

  return (
    <Row>
      <Col offset={ 4 } span={ 16 }>
        <Row justify={ 'center' }>
          <Col>
            <h1>专家知识库配置</h1>
          </Col>
        </Row>
        <Row>
          <Col span={ 24 }>
            <div className='org-name'>
              <div style={ {width: '80px'} }>组织名称</div>
              <Input value={ inputOrgValue } onChange={ handleOrgInput } placeholder='请输入组织名称'/>
            </div>
            <div className='add-label'>
              <span>添加组织标签：</span>
              <Space size={ [0, 8] } wrap>
                <Space size={ [0, 8] } wrap>
                  { tags.map((tag, index) => {
                    if (editInputIndex === index) {
                      return (
                        <Input
                          ref={ editInputRef }
                          key={ tag }
                          size="middle"
                          style={ tagInputStyle }
                          value={ editInputValue }
                          onChange={ handleEditInputChange }
                          onBlur={ handleEditInputConfirm }
                          onPressEnter={ handleEditInputConfirm }
                        />
                      );
                    }
                    const isLongTag = tag.length > 20;
                    const tagElem = (
                      <Tag
                        key={ tag }
                        closable={ index !== -1 }
                        style={ {
                          userSelect: 'none'
                        } }
                        onClose={ () => handleClose(tag) }
                      >
              <span
                onDoubleClick={ (e) => {
                  if (index !== -1) {
                    setEditInputIndex(index);
                    setEditInputValue(tag);
                    e.preventDefault();
                  }
                } }
              >
                { isLongTag ? `${ tag.slice(0, 20) }...` : tag }
              </span>
                      </Tag>
                    );
                    return isLongTag ? (
                      <Tooltip title={ tag } key={ tag }>
                        { tagElem }
                      </Tooltip>
                    ) : (
                      tagElem
                    );
                  }) }
                </Space>
                { inputVisible ? (
                  <Input
                    ref={ inputRef }
                    type="text"
                    size="middle"
                    style={ tagInputStyle }
                    value={ inputValue }
                    onChange={ handleInputChange }
                    onBlur={ handleInputConfirm }
                    onPressEnter={ handleInputConfirm }
                  />
                ) : (
                  <Tag style={ tagPlusStyle } onClick={ showInput }>
                    <PlusOutlined/> 新增标签
                  </Tag>
                ) }
              </Space>
              <Button onClick={ onCreateKnow } type='primary'>创建</Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={ 24 }>
            <Divider plain>已有组织知识库</Divider>
          </Col>
        </Row>
        <Row>
          <Col span={ 24 }>
            <Table dataSource={ tableData } columns={ columns }/>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default ExpertKnowMatchConfig
