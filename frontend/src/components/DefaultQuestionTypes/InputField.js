import React from "react";

import {Form, Input, Icon, Button, Select, Divider, Card, Radio, Checkbox, Col, InputNumber, Row, Tag} from 'antd';
import tags from "../../mocks/Tags";
import theme from "../../config/theme"

/**
 * Input field form template
 */
export default class InputField extends React.Component {

    constructor(props) {
        super(props);
        this.id = 0;
        this.state = {
            answers: []
        }
    }


    /* remove an answer */
    remove = k => {
        const { form } = this.props;
        // can use data-binding to get
        const answers = this.state.answers;

        // can use data-binding to set
        this.setState({
            answers: answers.filter(key => key !== k),
        });
    };

    /* add an answer */
    add = () => {
        const { form } = this.props;
        // can use data-binding to get
        const answers = this.state.answers;
        const nextKeys = answers.concat(this.id++);
        // can use data-binding to set
        // important! notify form to detect changes
        this.setState({
            answers: nextKeys
        });
    };

    render() {
        const { TextArea } = Input;

        const { getFieldDecorator, getFieldValue } = this.props.form;


        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };

        const formItemLayoutWithoutLabel = {
            wrapperCol: { span: 24 },
        };

        const buttonItemLayout = {
            wrapperCol: {span: 14, offset: 4},
        };
        const formItems = this.state.answers.map((k, index) => (
            <React.Fragment key={k}>
                <Form.Item
                    {...formItemLayout}
                    label={"answers " + k}
                    required={false}
                    key={k}
                >
                    {getFieldDecorator(`responses[${this.props.id}].answers[${k}].text`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [
                            {
                                required: true,
                                whitespace: true,
                                message: "Cannot have empty body.",
                            },
                        ],
                    })(<Input
                        placeholder="enter an answer"
                        style={{ width: '60%', marginRight: 8 }}
                    />)}
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        onClick={() => this.remove(k)}
                    />
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="Grade"
                >
                    {getFieldDecorator(`responses[${this.props.id}].answers[${k}].grade`, {
                        initialValue: k===0?100:0,
                    })(<InputNumber
                        formatter={value => `${value}%`}
                        parser={value => value.replace('%', '')}
                    />)}
                </Form.Item>
            </React.Fragment>
        ));


        return (
            <Card
                title={
                    <span>
                        <Tag onClick={this.props.up} style={{marginLeft: 4}}>
                            <Icon type="caret-up" />
                        </Tag>
                        <Tag onClick={this.props.down}>
                            <Icon type="caret-down" />
                        </Tag>
                        {this.props.title}
                    </span>
                }
                type="inner"
                size="small"
                bodyStyle={{backgroundColor: theme["@white"]}}
                extra={
                    <Icon type="delete" onClick={this.props.remove}/>
                }
            >
                <Form.Item label="Text" {...formItemLayout}>
                    {getFieldDecorator(`responses[${this.props.id}].text`, {})(
                        <TextArea autosize={{ minRows: 2, maxRows: 6 }} placeholder="description of this response" />)}
                </Form.Item>
                <Divider />
                {formItems}
                <Form.Item {...formItemLayoutWithoutLabel}>
                    <Button type="default" icon="plus" onClick={this.add}>
                        Add a potential answer
                    </Button>
                </Form.Item>
                {/* storing meta data*/}
                <span hidden={true}>
                    {getFieldDecorator(`responses[${this.props.id}].type.name`, {initialValue: "input"})(<input/>)}
                </span>
            </Card>
        );
    }
}