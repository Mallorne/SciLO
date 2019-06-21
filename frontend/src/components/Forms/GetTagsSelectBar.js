import {Form, message, Select, Spin} from 'antd';
import React from "react";
import GetTags from "../../networks/GetTags";

const { Option } = Select;

export default class GetTagsSelectBar extends React.Component {
    state = {
        data: [],
        value: [],
        fetching: false,
    };

    componentDidMount() {
        this.fetchTags();
    }
    fetchTags = () => {
        this.setState({ data: [], fetching: true });
        GetTags().then(
            data => {
                if (!data || data.status !== 200) {
                    message.error("Cannot fetch tags, see console for more details.");
                    console.error("FETCH_TAGS_FAILED", data);
                }
                else {
                    this.setState({
                        data: data.data.tags
                    });
                }
            }
        );
    };

    render() {
        const { fetching, data, value } = this.state;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };

        return (
            <Form.Item
                label="Tags"
                {...formItemLayout}
            >
                {this.props.form.getFieldDecorator('tags', {initialValue: value})(
                    <Select
                        placeholder="select tags"
                        mode="tags"
                        style={{ width: '100%' }}
                        tokenSeparators={[',']}
                        notFoundContent={fetching ? <Spin size="small" /> : null}
                    >
                        {data.map(d => (
                            <Option key={d.name}>{d.name}</Option>
                        ))}
                    </Select>
                )}
            </Form.Item>
        );
    }
}