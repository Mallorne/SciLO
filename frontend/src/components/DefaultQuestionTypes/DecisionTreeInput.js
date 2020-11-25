import React from "react";
import {Collapse, Divider, Form} from 'antd';
// import XmlEditor from "../Editor/XmlEditor";
import DecisionTree from "../DecisionTree";
// import {CodeEditor} from "../CodeEditor";

/**
 * Input field form template
 */
export default class DecisionTreeInput extends React.Component {

    render() {
        const Panel = Collapse.Panel;
        const { getFieldDecorator } = this.props.form;

        // form layout css
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };
        return (
            <Collapse
                defaultActiveKey={[this.props.id]}
                style={{marginBottom: 12}}
            >
            <Panel>
                <div>
                    <Form.Item label="Tree" {...formItemLayout} style={{overflow: "auto"}}>
                        {getFieldDecorator(`tree`)(
                            <DecisionTree tree={this.props.tree} responses={this.props.responses} onChange={this.props.onChange}/>)}
                    </Form.Item>
                    <Divider style={{marginBottom: 4}}/>

                </div>
            </Panel>
            </Collapse>
        );
    }
}