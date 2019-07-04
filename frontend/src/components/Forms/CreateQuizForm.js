import {
    Button,
    Form,
    Input,
    DatePicker,
    Divider,
    Tooltip,
    Checkbox,
    Select,
    InputNumber,
    Col,
    Row,
    List,
    Drawer, Card, Icon, Popconfirm, Steps
} from "antd";
import React from "react";
import {Link} from "react-router-dom";
import QuickLook from "../QuestionPreviews/QuickLook";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import theme from "../../config/theme";
import QuestionBankModal from "../../pages/QuestionBankTable/QuestionBankModal";

const timeFormat = "YYYY-MM-DD HH:mm:ss";
const notifyCondition = ["Deadline","Submission after deadline","Flag of a question","Every submission"];

class CreateQuizForm extends React.Component {

    state = {
        QuickLook: {
            visible: false,
            question: null
        },
        current: 0,
        showQuestionBank: false
    };

    next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }

    handleSubmit = e => {
        e.preventDefault();

        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            // Should format date value before submit.
            const rangeTimeValue = fieldsValue['start-end-time'];
            const lateTimeValue = fieldsValue['late-time'];
            const values = {
                ...fieldsValue,
                'start-end-time': [
                    rangeTimeValue[0].format(timeFormat),
                    rangeTimeValue[1].format(timeFormat),
                ],
                'late-time': lateTimeValue ? lateTimeValue.format(timeFormat): undefined,
                questions: this.props.order
            };
            console.log('Received values of form: ', values);
            console.log('Json', JSON.stringify(values))
        });
    };

    validate = () => {
        let valid = true;
        this.props.form.validateFields((err, fieldsValue) => {
            valid = !err;
            return !err;
        });
        return valid;
    };

    /* make sure we have the late submission time later than the end time */
    validateLateTime = (rule, value, callback) => {
        if (value) {
            const timeRange = this.props.form.getFieldValue("start-end-time");
            if (timeRange && timeRange[1]) {
                const end = timeRange[1];
                if (!value.isAfter(end)) {
                    callback("Oops, you have the late submission time earlier than the end time.");
                }
            }
        }
        callback()
    };

    /* make sure we have free attempt number fewer than total attempts */
    validateFreeAttempts = (rule, value, callback) => {
        if (value) {
            const attempts = this.props.form.getFieldValue("attempt-limit");
            if (attempts && attempts < value) {
                callback("Oops, you have more free tries than the total number of attempts.");
            }
        }
        callback()
    };

    quickLookQuestion = (question) => {
        this.setState({
            QuickLook: {
                visible: true,
                question: question
            }
        })
    };

    onClose = () => {
        this.setState({
            QuickLook: {
                visible: false,
                question: null
            }
        })
    };

    /* happen when the user has done dragging of the answer card */
    onDragEnd = (result) => {
        // a little function to help us with reordering the result
        const reorder = (list, startIndex, endIndex) => {
            const result = Array.from(list);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            return result;
        };
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        const order = reorder(
            this.props.order,
            result.source.index,
            result.destination.index
        );
        // re-order the answers
        this.props.setOrder(order);
    };

    render() {
        const TextArea = Input.TextArea;
        const { MonthPicker, RangePicker } = DatePicker;
        const { Option, OptGroup } = Select;
        const { Step } = Steps;
        const {current} = this.state;

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };

        const formItemLayoutWithoutLabel = {
            wrapperCol: { span: 24 },
        };

        const { getFieldDecorator } = this.props.form;

        const rangeConfig = {
            rules: [{ type: 'array', required: true, message: 'Please select time!' }],
            preserve: true
        };

        const steps = [
            {
                title: 'Info',
                description: 'some essential info such as deadline',
                content: (
                    <div>
                        <Form.Item
                            required
                            label="Title"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('title', {
                                rules: [{ required: true, message: 'Please enter a title for the quiz!' }],
                                preserve: true
                            })(
                                <Input placeholder="enter a title" />
                            )}
                        </Form.Item>
                        <Form.Item
                            required
                            label="Start / End Time"
                            {...formItemLayout}

                        >
                            {getFieldDecorator('start-end-time', rangeConfig)(
                                <RangePicker showTime format={timeFormat} style={{width: "100%"}}/>,
                            )}
                        </Form.Item>
                        <Form.Item
                            label={<Tooltip title={"Students can submit after the deadline"}>Late Submission</Tooltip>}
                            {...formItemLayout}
                        >
                            {getFieldDecorator('late-time',{
                                rules: [
                                    { validator: this.validateLateTime}
                                ],
                                preserve: true
                            })(
                                <DatePicker showTime format={timeFormat} style={{width: "100%"}}/>,
                            )}
                        </Form.Item>
                    </div>
                )
            },
            {
                title: 'Questions',
                description: 'confirm question selection',
                content: (
                    <div>
                        <DragDropContext onDragEnd={this.onDragEnd}>
                            <Droppable
                                droppableId={"Drop_"}
                            >
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {this.props.order.map((id, index) => (
                                            <Draggable
                                                key={"drag_"+id}
                                                draggableId={"drag_"+id}
                                                index={index}
                                            >
                                                { (provided, snapshot) => (
                                                    <div
                                                        key={id}
                                                        {...provided.draggableProps}
                                                        ref={provided.innerRef}
                                                    >
                                                        <Card
                                                            size={"small"}
                                                            bordered={snapshot.isDragging}
                                                            style={{backgroundColor: snapshot.isDragging?"white":theme["@white"]}}
                                                            //{...provided.dragHandleProps}
                                                        >
                                                            <Card.Meta
                                                                avatar={
                                                                    <Icon style={{border: "solid 1px"}} type="bars" {...provided.dragHandleProps}/>
                                                                }
                                                                title={
                                                                    <>
                                                                        <Button type={"link"} onClick={()=>{
                                                                            this.quickLookQuestion(this.props.questions[id])
                                                                        }}>
                                                                            {this.props.questions[id].title}
                                                                        </Button>
                                                                        <span style={{float: "right"}}>
                                                                            <Link to={`/QuestionBank/edit/${id}`}><Button type="link" icon="edit"/></Link>
                                                                            <Divider type="vertical" />
                                                                            <Popconfirm
                                                                                title="Are you sure?"
                                                                                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                                                                                onConfirm={() => {this.props.delete(id)}}
                                                                            >
                                                                                <Icon type="delete" style={{ color: 'red' }} />
                                                                            </Popconfirm>
                                                                        </span>
                                                                    </>
                                                                }
                                                                description={this.props.questions[id].text}
                                                            />
                                                        </Card>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                )
            },
            {
                title: 'Settings',
                description: 'policy and administration',
                content: (
                    <div>
                        <Form.Item
                            label="Grading Policy"
                            {...formItemLayout}
                        >
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        label={<Tooltip title={"Leave EMPTY for unlimited attempts"}>Attempts</Tooltip>}
                                    >
                                        {getFieldDecorator('attempt-limit', {
                                            rules: [{ required: true, message: 'Please enter the attempt limit for the quiz!' }],
                                            initialValue: 3
                                        })(
                                            <InputNumber min={1} max={10} />,
                                        )}
                                    </Form.Item>
                                    <Form.Item
                                        label={<Tooltip title={"How many attempts are free from deduction"}>Free Tries</Tooltip>}
                                    >
                                        {getFieldDecorator('free-attempts', {
                                            initialValue: 0,
                                            rules: [
                                                { validator: this.validateFreeAttempts}
                                            ]
                                        })(
                                            <InputNumber min={0} max={10} />,
                                        )}
                                    </Form.Item>

                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Method"
                                    >
                                        {getFieldDecorator('method', {
                                            initialValue: "highest",
                                        })(
                                            <Select style={{ width: "50%" }}>
                                                <Option value="highest">highest</Option>
                                                <Option value="last">last attempt</Option>
                                                <Option value="average">average</Option>
                                                <Option value="minimum">minimum</Option>
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        label="Deduction per attempt"
                                    >
                                        {getFieldDecorator('attempt-deduction', {
                                            initialValue: 0,
                                        })(
                                            <InputNumber
                                                min={0}
                                                max={100}
                                                formatter={value => `${value}%`}
                                                parser={value => value.replace('%', '')}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Deduction after deadline:"
                                    >
                                        {getFieldDecorator('late-deduction', {
                                            initialValue: 20,
                                        })(
                                            <InputNumber
                                                disabled={!(this.props.form.getFieldValue("late-time"))}
                                                min={0}
                                                max={100}
                                                formatter={value => `${value}%`}
                                                parser={value => value.replace('%', '')}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item
                            label="Notify me when"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('notify-condition', {
                                initialValue: ["Deadline","Submission after deadline","Flag of a question"]
                            })(
                                <Checkbox.Group options={notifyCondition}/>
                            )}
                        </Form.Item>
                        <Form.Item
                            label="Who can edit"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('editable', {
                            })(
                                <Select mode={"multiple"} style={{ width: "50%" }} >
                                    <OptGroup label="Professor">
                                        <Option value="jack">Jack</Option>
                                        <Option value="lucy">Lucy</Option>
                                    </OptGroup>
                                    <OptGroup label="TA">
                                        <Option value="Yiminghe">yiminghe</Option>
                                    </OptGroup>
                                </Select>
                            )}
                        </Form.Item>
                    </div>
                )
            },
        ];

        return (
            <Form>
                <Steps current={current} status={this.state.status} onChange={(current)=> {
                    const result = this.validate();
                    if (result) {
                        delete this.state.status;
                        this.setState({current: current})
                    }
                    else {
                        this.setState({status: "error"})
                    }
                }}>
                    {steps.map(item => (
                        <Step key={item.title} title={item.title} description={item.description}/>
                    ))}
                </Steps>
                <Divider dashed/>
                <div className="steps-content">{steps[current].content}</div>
                <Divider dashed/>
                <div className="steps-action">
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={() => {
                            const result = this.validate();
                            if (result) {
                                delete this.state.status;
                                this.next();
                            }
                            else {
                                this.setState({status: "error"});
                            }
                        }}>
                            Next
                        </Button>
                    )}
                    {current === 1 && (
                        <Button
                            icon={"more"}
                            onClick={()=>{this.setState({showQuestionBank: true})}}
                            style={{float: "right"}}
                        >
                            Manage Questions
                        </Button>
                    )}


                    {current === steps.length - 1 && (
                        <Button type={"danger"} onClick={this.handleSubmit}>
                            Done
                        </Button>
                    )}
                    {current > 0 && (
                        <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                            Previous
                        </Button>
                    )}
                </div>
                <Drawer
                    width={640}
                    placement="right"
                    closable={true}
                    mask={false}
                    onClose={this.onClose}
                    visible={this.state.QuickLook.visible}
                    destroyOnClose
                >
                    {this.state.QuickLook.question && <QuickLook question={this.state.QuickLook.question}/>}
                </Drawer>
                <QuestionBankModal
                    visible={this.state.showQuestionBank}
                    setQuickLook={this.quickLookQuestion}
                    keys={this.props.keys}
                    update={this.props.update}
                    close={()=>{this.setState({showQuestionBank: false})}}
                />
            </Form>
        );
    }
}

export default Form.create({ name: 'CreateQuizForm' })(CreateQuizForm);