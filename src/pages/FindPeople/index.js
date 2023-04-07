import { Button, Checkbox, Col, Input, Row, Table } from "antd";
import './index.css'
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const FindPeople = () => {
  const [rules, setRules] = useState([])
  const [fields, setFields] = useState([])
  const [selectedItem, setSelectItem] = useState({})
  const [inputValue, setInputValue] = useState({})
  const [resultList, setResultList] = useState([])
  const cache = useRef()

  const field_map = {
    '姓名': 'name',
    '邮箱': 'email',
    '电话': 'phone',
    '国籍': 'country',
    '城市': 'city',
    '地址': 'address',
  }
  // 请求已存在的规则
  // 由于在开发环境react18中useEffect会请求两次接口，所以用cache做一个数据缓存防止多次请求
  useEffect(() => {
    let ignore = false

    async function startFetching() {
      if (!cache.current) {
        cache.current = await getExistRule()
      }
      if (!ignore) {
        let resData = cache.current.data.data.rules
        // 解析规则并放入useState中
        for (let i = 0; i < resData.length; i++) {
          rules.push({
            key: resData[i].id,
            rule_id: rules.length + 1,
            rule_name: resData[i].ruleName,
            rule_composition: resData[i].rule,
            rule_des: resData[i].ruleDes
          })
          setRules([...rules])
        }
      }
    }

    startFetching().then()
    return () => {
      ignore = true
    }
  }, [])
  // 加载已经存在的规则
  const getExistRule = () => {
    return axios.get('/api/rule/findExistRule')

  }
  const onCheckBox = (rule_id, index) => {
    // 要是规则未被选中，则将规则id加入
    if (!selectedItem.hasOwnProperty(rule_id)) {
      for (let i = 0; i < rules.length; i++) {
        if (rules[i].key === rule_id) {
          selectedItem[rule_id] = rules[i].rule_composition
        }
      }
      // 取消选中规则移除对应规则id的内容
    } else {
      delete selectedItem[rule_id]
    }
    // 依次遍历选中规则所包含的字段用于输入显示
    let tmp = []
    for (let key in selectedItem) {
      for (let i = 0; i < selectedItem[key].length; i++) {
        tmp.push(selectedItem[key][i].label)
      }
    }
    tmp = Array.from(new Set(tmp))
    setFields([...tmp])
  }

  const getInputValue = (key, e) => {
    inputValue[field_map[key]] = e.target.value
  }
  // 查找事件处理函数
  const onFind = async () => {
    // 提交数据
    const acceptRules = []
    // console.log(rules)
    // selectedItem 选中的规则
    // inputValue 输入的值
    // 遍历选中的规则，解析每个规则所需要的输入值
    for (let key in selectedItem) {
      let tmp = {ruleId: key}
      for (let i = 0; i < selectedItem[key].length; i++) {
        tmp[selectedItem[key][i].field] = {
          value: inputValue[selectedItem[key][i].field],
          rule: selectedItem[key][i].rule
        }
      }
      acceptRules.push(tmp)
    }
    // 请求查找接口
    let result = await axios.post('/api/find_people/accept_rule/find', acceptRules)
    // console.log(result)
    resultList.length = 0
    const resultData = result.data.data.possibleOrg
    const resultRuleIds = Object.keys(result.data.data.possibleOrg)
    // console.log(resultRuleIds)
    // console.log(rules)
    for (let i = 0; i < resultRuleIds.length; i++) {
      // console.log(resultData[resultRuleIds[i]])
      let tmpRuleName = ''
      for (let j = 0; j < rules.length; j++) {
        if (rules[j].key === resultRuleIds[i]) {
          tmpRuleName = rules[j].rule_name
          break
        }
      }
      for (let orgItem in resultData[resultRuleIds[i]]) {
        // console.log(orgItem)
        resultList.push({
          ruleName: tmpRuleName,
          ruleId: resultRuleIds[i],
          orgName: orgItem,
          weight: resultData[resultRuleIds[i]][orgItem]
        })
      }
    }
    // console.log(resultList)
    setResultList([...resultList])

  }
  // 单元格合并
  const mergeCells = (data, type) => {
    const objResult = {}
    const arr = []
    const arr1 = []
    const arr2 = [0]
    const arrResult = []
    let len = 0
    let typeResult
    data.map(val => {
      for (const item in val) {
        if (item === type) {
          typeResult = val[item]
        }
      }
      const objArray = objResult[typeResult] || []
      objArray.push(objArray)
      objResult[typeResult] = objArray
    })
    for(const item in objResult) {
      arr.push(objResult[item])
    }
    arr.map((val, key) => {
      arr1.push(val.length)
      len += val.length
      arr2.push(len)
    })
    arrResult[0] = arr1
    arrResult[1] = arr2
    return arrResult
  }

  const columns = [
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
      width: 120,
      render: (val, row, index) => {
        const obj = {
          children: val,
          props: {}
        }
        const arrResult = mergeCells(resultList, 'ruleId')
        for(let i=0;i<arrResult.length;i++) {
          if(index === arrResult[1][i]) {
            obj.props.rowSpan = arrResult[0][i]
          }
          if(index > arrResult[1][i] && index < arrResult[1][i+1]) {
            obj.props.rowSpan = 0
          }
        }
        return obj
      }
    },
    {
      title: '组织名称',
      dataIndex: 'orgName',
      key: 'OrgName'
    },
    {
      title: '权重',
      dataIndex: 'weight',
      key: 'weight'
    }
  ]


  return (
    <Row>
      <Col offset={ 4 } span={ 16 }>
        <Row justify='center'>
          <Col>
            <h1>基于规则匹配的人员查找算法</h1>
          </Col>
        </Row>
        <Row>
          <Col span={ 12 } style={ {border: '1px solid #ccc', padding: '10px'} }>
            <Row>
              <Col>
                <h3>规则选择</h3>
              </Col>
            </Row>
            <Row>
              <Col>
                { rules.length > 0 ? rules.map(item => {
                  return (
                    <div className='select-rule' key={ item.key }>
                      <div className='select-rule-name'>
                        <Checkbox onChange={ onCheckBox.bind(this, item.key) }>{ item.rule_name }</Checkbox>
                      </div>
                      <div className='select-rule-des'>{ item.rule_des }</div>
                    </div>
                  )
                }) : '' }
              </Col>
            </Row>
          </Col>
          <Col span={ 12 } style={ {border: '1px solid #ccc', padding: '10px'} }>
            <Row>
              <Col>
                <h3>信息填写</h3>
              </Col>
            </Row>
            <Row>
              <Col>
                { fields.length > 0 ? fields.map(item => {
                  return (
                    <div className='input-info' key={ item }>
                      <div className='label'>{ item }：</div>
                      <Input placeholder='请输入' onChange={ getInputValue.bind(this, item) }/>
                    </div>
                  )
                }) : '' }
                { fields.length > 0 ? <Button type='primary' onClick={ onFind }>查找</Button> : '' }
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col style={{width: '100%'}}>
            <Table dataSource={ resultList } columns={ columns }/>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default FindPeople
