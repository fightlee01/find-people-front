import { Button, Checkbox, Col, Divider, Input, message, Row, Select, Table } from 'antd';
import './index.css'
import { useEffect, useState } from "react";
import axios from "axios";

const CreateRule = () => {

  // const field = ['姓名', '电话', '邮箱', '国籍', '城市', '地址', '护照类型' ]
  // 前端显示rules的数据结构[{field: '', label: '', rule: ''}]
  const [rules, setRules] = useState([]);
  // 存储一个规则用于提交到后端
  const [ruleItems, setRuleItems] = useState([])
  const [ruleName, setRuleName] = useState('')
  const [ruleDes, setRuleDes] = useState('')
  const [tableData, setTableData] = useState([])
  const [modify, setModify] = useState([])
  const [modifyRule, setModifyRule] = useState([])
  // checkBox状态
  const [checkBoxChecked, setCheckBoxChecked] = useState({
    name: false,
    phone: false,
    email: false,
    country: false,
    city: false,
    address: false,
    passport: false
  })
  const field = [
    {
      fieldName: '姓名',
      value: 'name',
      defaultRule: '',
      rule: [
        {value: 'exact_match', label: '精确匹配'},
        {value: 'fuzzy_match', label: '模糊匹配'}]
    },
    {
      fieldName: '电话',
      value: 'phone',
      defaultRule: '',
      rule: [
        {value: 'prefix_match', label: '前缀匹配'},
        {value: 'similarity', label: '相似度匹配'}]
    },
    {
      fieldName: '邮箱',
      value: 'email',
      defaultRule: '',
      rule: [{value: 'suffix', label: '后缀匹配'}]
    },
    {
      fieldName: '国籍',
      value: 'country',
      defaultRule: '',
      rule: [
        {value: 'exact_match', label: '精确匹配'},
        {value: 'fuzzy_match', label: '模糊匹配'}]
    },
    {
      fieldName: '城市',
      value: 'city',
      defaultRule: '',
      rule: [
        {value: 'exact_match', label: '精确匹配'},
        {value: 'fuzzy_match', label: '模糊匹配'}]
    },
    {
      fieldName: '地址',
      value: 'address',
      defaultRule: '',
      rule: []
    },
    {
      fieldName: '护照类型',
      value: 'passport',
      defaultRule: '',
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
    },
    {
      title: '规则操作',
      key: 'rule_opt',
      render: (text, record, index) => {
        return (
          <>
            <Button type='primary' onClick={ onModifyRule.bind(this, text, record, index) }>修改</Button>
            <Button type='primary' onClick={ onDeleteRule.bind(this, text, record, index) }>删除</Button>
          </>
        )
      }
    }
  ]

  useEffect(() => {
    getExistRules().then()
  }, [])

  const getExistRules = async () => {
    // 每次请求数据清空当前数据
    tableData.length = 0
    let resData = await axios.get('/api/rule/findExistRule')
    resData = resData.data.data.rules
    for (let i = 0; i < resData.length; i++) {
      tableData.push({
        key: resData[i].id,
        rule_id: tableData.length + 1,
        rule_name: resData[i].ruleName,
        rule_composition: showRules(resData[i].rule),
        rule_des: resData[i].ruleDes
      })
      modifyRule.push({
        key: resData[i].id,
        rule_id: tableData.length + 1,
        rule_name: resData[i].ruleName,
        rule_composition: resData[i].rule,
        rule_des: resData[i].ruleDes
      })
    }
    setTableData([...tableData])
  }


  const onModifyRule = (text, record, index) => {
    message.info("暂未实现", 1)
    // console.log(record)
    // setRuleName(record.rule_name)
    // setRuleDes(record.rule_des)
    // console.log(modifyRule)
    // let modifyTmp = null
    // for (let i = 0; i < modifyRule.length; i++) {
    //   if(modifyRule[i].key === record.key) {
    //     modifyTmp = modifyRule[i]
    //   }
    // }
    // for (let i = 0; i < modifyTmp.rule_composition.length; i++) {
    //   for (let j = 0; j < field.length; j++) {
    //     if(field[j].value === modifyTmp.rule_composition[i].field) {
    //       rules.push({
    //
    //       })
    //       break
    //     }
    //   }
    // }
    // console.log(rules)
    // setRules([...rules])
  }

  // 删除规则
  const onDeleteRule = (text, record, index) => {
    axios.post(`/api/rule/deleteRuleById/${ record.key }`).then(res => {
      getExistRules().then()
    })
  }

  // 字段选择处理函数
  const onChange = (value) => {
    // 点击选择框时将其状态反转
    checkBoxChecked[value] = !checkBoxChecked[value]
    // 更新状态
    setCheckBoxChecked({...checkBoxChecked})
    // 获取选择的哪个字段
    const selectField = value
    for (let i = 0; i < rules.length; i++) {
      if (rules[i].field === selectField) {
        rules.splice(i, 1)
        setRules([...rules])
        ruleItems.splice(i, 1)
        setRuleItems([...ruleItems])
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
    ruleItems.push({field: selectField, rule: selectRule, label: selectLabel})
    setRules([...rules])
    setRuleItems([...ruleItems])
  }
  // 字段规则处理函数
  const handleChange = (index, value) => {
    let selectRuleItem = null
    for (let i = 0; i < rules[index].rule.length; i++) {
      if (rules[index].rule[i].value === value) {
        selectRuleItem = rules[index].rule[i].label
        break
      }
    }
    ruleItems[index].rule = selectRuleItem
  }

  // 创建规则
  const onCreateRule = () => {
    if (ruleName === '' || ruleDes === '') {
      message.info('规则信息不完整', 1).then()
      return
    }
    for(let i=0;i<ruleItems.length;i++) {
      if(ruleItems[i].rule instanceof Array) {
        message.info('规则信息不完整', 1).then()
        return
      }
    }

    let data = {
      ruleName,
      ruleDes,
      ruleItems
    }
    axios.post('/api/rule/createRule', data).then(res => {
      if (res.data.code === 2000) {
        message.success('规则创建成功')
        // 规则创建成功清除状态
        // 清除规则名称状态
        setRuleName('')
        // 清除规则描述状态
        setRuleDes('')
        // 清除提交的数据
        for(let i=0;i<ruleItems.length;i++) {
          checkBoxChecked[ruleItems[i].field] = false
        }
        ruleItems.length = 0
        setRuleItems([...ruleItems])
        // 清空字段选择的状态
        setCheckBoxChecked({...checkBoxChecked})
        // 清除选择的字段的状态
        rules.length = 0
        setRules([...rules])
      } else {
        message.success('规则创建失败')
      }
      getExistRules()
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
              onChange={ onChange.bind(this, item.value) }
              key={ item.value }
              checked={ checkBoxChecked[item.value] }
              // value={item.value}
            >{ item.fieldName }</Checkbox>) }
          </div>
        </Col>
      </Row>
      <Row>
        <Col offset={ 4 } span={ 6 }>
          <div className='rule-name-des'>
            <span>规则名称</span>
            <Input placeholder={ '请输入规则名称' } value={ ruleName } onChange={ onChangeName }/>
          </div>
        </Col>
        <Col span={ 6 }>
          <div className='rule-name-des'>
            <span>规则描述</span>
            <Input placeholder={ '请输入规则描述' } value={ ruleDes } onChange={ onChangeDes }/>
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
