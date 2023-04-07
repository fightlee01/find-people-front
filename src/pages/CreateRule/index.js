import { Button, Checkbox, Col, Divider, Input, message, Row, Select, Table } from 'antd';
import './index.css'
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const CreateRule = () => {

  // const field = ['姓名', '电话', '邮箱', '国籍', '城市', '地址', '护照类型' ]
  // 前端显示rules的数据结构[{field: '', label: '', rule: ''}]
  const [rules, setRules] = useState([]);
  // 存储一个规则用于提交到后端
  const [ruleItems] = useState([])
  const [ruleName, setRuleName] = useState('')
  const [ruleDes, setRuleDes] = useState('')
  const [tableData, setTableData] = useState([])
  const cache = useRef(null)
  const field = [
    {
      fieldName: '姓名',
      value: 'name',
      rule: [
        {value: 'exact_match', label: '精确匹配'},
        {value: 'fuzzy_match', label: '模糊匹配'}]
    },
    {
      fieldName: '电话',
      value: 'phone',
      rule: [
        {value: 'prefix_match', label: '前缀匹配'},
        {value: 'similarity', label: '相似度匹配'}]
    },
    {
      fieldName: '邮箱',
      value: 'email',
      rule: [{value: 'suffix', label: '后缀匹配'}]
    },
    {
      fieldName: '国籍',
      value: 'country',
      rule: [
        {value: 'exact_match', label: '精确匹配'},
        {value: 'fuzzy_match', label: '模糊匹配'}]
    },
    {
      fieldName: '城市',
      value: 'city',
      rule: [
        {value: 'exact_match', label: '精确匹配'},
        {value: 'fuzzy_match', label: '模糊匹配'}]
    },
    {
      fieldName: '地址',
      value: 'address',
      rule: []
    },
    {
      fieldName: '护照类型',
      value: 'passport',
      rule: []
    },
  ]
  const columns = [
    {
      title: '规则编号',
      dataIndex: 'rule_id',
      key: 'rule_id',
      width: '12%',
      align: 'center'
    },
    {
      title: '规则名称',
      dataIndex: 'rule_name',
      key: 'rule_name',
      width: '20%'
    },
    {
      title: '规则组成',
      dataIndex: 'rule_composition',
      key: 'rule_composition'
    },
    {
      title: '规则描述',
      key: 'rule_des',
      dataIndex: 'rule_des'
    }
  ]

  useEffect(() => {
    let ignore = false

    async function startFetching() {
      if (!cache.current) {
        cache.current = await getExistRule()
      }
      if (!ignore) {
        let resData = cache.current.data.data.rules
        for (let i = 0; i < resData.length; i++) {
          tableData.push({
            key: resData[i].id,
            rule_id: tableData.length + 1,
            rule_name: resData[i].ruleName,
            rule_composition: showRules(resData[i].rule),
            rule_des: resData[i].ruleDes
          })
          setTableData([...tableData])
        }
      }
    }
    startFetching()
    return () => {
      ignore = true
    }
  }, [])

  const getExistRule = () => {
    return axios.get('/api/rule/findExistRule')

  }
  // 字段选择处理函数
  const onChange = (checkedValues) => {
    const selectField = checkedValues.target.value
    for (let i = 0; i < rules.length; i++) {
      if (rules[i].field === selectField) {
        rules.splice(i, 1)
        setRules([...rules])
        return
      }
    }
    let selectRule = null
    let selectLabel = null
    for (let i = 0; i < field.length; i++) {
      if (field[i].value === selectField) {
        selectRule = field[i].rule
        selectLabel = field[i].fieldName
      }
    }
    rules.push({field: selectField, rule: selectRule, label: selectLabel})
    setRules([...rules])
  }
  // 字段规则处理函数
  const handleChange = (index, value) => {
    console.log(`selected ${ value }, index ${ index }`);
    ruleItems.push(JSON.parse(JSON.stringify(rules[index])))
    let selectRuleItem = null
    for (let i = 0; i < rules[index].rule.length; i++) {
      if (rules[index].rule[i].value === value) {
        selectRuleItem = rules[index].rule[i].label
        break
      }
    }
    ruleItems[ruleItems.length - 1].rule = selectRuleItem
  }

  // 创建规则
  const onCreateRule = () => {
    if (ruleName === '' || ruleDes === '' || ruleItems.length === 0 || ruleItems.length !== rules.length) {
      message.info('规则信息不完整', 1).then()
      return
    }
    tableData.push(
      {
        key: tableData.length + 1,
        rule_id: tableData.length + 1,
        rule_name: ruleName,
        rule_composition: showRules(ruleItems),
        rule_des: ruleDes
      })
    setTableData([...tableData])
    let data = {
      ruleName,
      ruleDes,
      ruleItems
    }
    console.log(data)
    axios.post('/api/rule/createRule', data).then(res => {
      console.log(res.data)
    })
  }

  // 处理显示规则的样式
  const showRules = (ruleItem) => {
    ruleItem = JSON.parse(JSON.stringify(ruleItem))
    for (let i = 0; i < ruleItem.length; i++) {
      ruleItem[i] = ruleItem[i].label
    }
    return ruleItem.join('+')
  }
  const onChangeName = (e) => {
    setRuleName(e.target.value)
  }

  const onChangeDes = (e) => {
    setRuleDes(e.target.value)
  }

  return (
    <>
      <Row justify={ 'center' }>
        <Col>
          <h1>基于规则匹配的人员查找算法</h1>
        </Col>
      </Row>
      <Row>
        <Col offset={ 4 } span={ 16 }>
          <div>{
            field.map(item => <Checkbox
              onChange={ onChange }
              key={ item.value }
              value={ item.value }>{ item.fieldName }</Checkbox>) }
          </div>
        </Col>
      </Row>
      <Row>
        <Col offset={ 4 } span={ 6 }>
          <div className='rule-name-des'>
            <span>规则名称</span>
            <Input placeholder={ '请输入规则名称' } onChange={ onChangeName }/>
          </div>
        </Col>
        <Col span={ 6 }>
          <div className='rule-name-des'>
            <span>规则描述</span>
            <Input placeholder={ '请输入规则描述' } onChange={ onChangeDes }/>
          </div>
        </Col>
        <Col span={ 4 }>
          <div className='rule-name-des'><Button type='primary' onClick={ onCreateRule }>创建规则</Button></div>
        </Col>
      </Row>
      <Row>
        <Col offset={ 4 } span={ 16 }>
          <div className='select-field'>{ rules.length > 0 ? rules.map((item, index) => {
            return (
              <div key={ index } className='select-field-item'>
                <span>{ item.label }</span>
                <Select
                  defaultValue='请选择'
                  style={ {width: 100} }
                  onChange={ handleChange.bind(this, index) }
                  options={ item.rule }
                />
              </div>
            )
          }) : '' }</div>
        </Col>
      </Row>
      <Row>
        <Col offset={ 4 } span={ 16 }>
          <Divider plain>已有规则</Divider>
        </Col>
      </Row>
      <Row>
        <Col offset={ 4 } span={ 16 }>
          <Table style={ {width: '100%'} } columns={ columns } dataSource={ tableData }/>
        </Col>
      </Row>
    </>
  )
}

export default CreateRule
