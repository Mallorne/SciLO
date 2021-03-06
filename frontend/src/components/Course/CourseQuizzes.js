import React from "react";
import {Button, Icon, List, message, Typography} from "antd";
import {Link} from "react-router-dom";
import GetAttemptListByQuiz from "../../networks/GetAttemptListByQuiz";
import GetQuizByCourse from "../../networks/GetQuizByCourse";
import QuizInfoModal from "../QuizCard/QuizInfoModal";
import Instructor from "../../contexts/Instructor";

export default class CourseQuizzes extends React.Component {
    state = {
        quizzes: []
    };

    componentDidMount() {
        this.setState({fetching: true});
        GetQuizByCourse(this.props.course.id, this.props.token).then(
            data => {
                if (!data || data.status !== 200) {
                    message.error("Cannot fetch course quizzes, see console for more details.");
                    this.setState({
                        fetching: false,
                    })
                }
                else {
                    this.setState({
                        fetching: false,
                        quizzes: data.data
                    })
                }
            }
        )
    }

    fetchAttempt = (quizId, params = {}) => {
        GetAttemptListByQuiz(quizId, this.props.token, params).then(data => {
            if (!data || data.status !== 200) {
                message.error("Cannot fetch quiz attempts, see console for more details.");
            } else {
                console.log(data.data);

                this.setState({
                    targetQuiz: quizId,
                    quizAttempts: data.data.quiz_attempts,
                    showQuizModal: true
                });
            }
        });
    };

    render() {
        return (
            <div className="CourseQuizzes">
                <Typography.Title level={3}>
                    {`Quizzes`}
                    <Instructor>
                        <span style={{float: "right"}}>
                            <Link to={{pathname: `/Quiz/new`, search: "?course="+this.props.course.id}}><Button type={"primary"} icon="plus">Create a Quiz</Button></Link>
                        </span>
                    </Instructor>
                </Typography.Title>
                {
                    // this.state.quizzes.map((quiz)=>{
                    //     return (
                    //         <OngoingQuiz
                    //             action={this.fetchAttempt}
                    //             id={quiz.id}
                    //             title={<span style={{color: "red"}}>{quiz.title}</span>}
                    //             status={quiz.status}
                    //             endTime={moment.utc(quiz.late_time)}
                    //             startTime={moment.utc(quiz.start_end_time[1])}
                    //         />)
                    // })

                }
                <List
                    style={{maxHeight: "calc(80vh)", marginBottom: 24, overflowY:"auto"}}
                    size={"small"}
                    dataSource={this.state.quizzes}
                    bordered
                    className="listItem"
                    pagination={{
                        showSizeChanger: true,
                        defaultPageSize: 10,
                        pageSizeOptions: ['10','20','50','100']
                    }}
                    renderItem={item => (
                        <List.Item actions={[
                            <Instructor><Link to={`/Quiz/edit/${item.id}`}><Icon type="edit" /></Link></Instructor>]}
                        >
                            <List.Item.Meta
                                title={<Button type={"link"} onClick={()=>{this.fetchAttempt(item.id)}}>{item.title}</Button>}
                            />
                            <span>Status: {item.status}</span>
                        </List.Item>
                    )}
                />
                <QuizInfoModal token={this.props.token} id={this.state.targetQuiz} attempts={this.state.quizAttempts} visible={this.state.showQuizModal} onClose={()=>{this.setState({showQuizModal: false})}}/>
            </div>
        )
    }

}