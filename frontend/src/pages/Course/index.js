import React from 'react';
import {withRouter} from "react-router-dom";
import {Divider, message, Typography} from "antd";
import "./index.css";
import GetCourseById from "../../networks/GetCourseById";
import CourseQuizzes from "../../components/Course/CourseQuizzes";
import CoursePeople from "../../components/Course/CoursePeople";
import CourseQuestionBank from "../../components/Course/CourseQuestionBank";
import Instructor from "../../contexts/Instructor";

class Course extends React.Component {
    state = {
        course: {},
    };

    componentDidMount() {
        this.fetch();
    };

    /* fetch courses */
    fetch = () => {
        this.setState({ data: [], fetching: true });
        GetCourseById(this.props.id, this.props.token).then(
            data => {
                if (!data || data.status !== 200) {
                    message.error("Cannot fetch the course, see console for more details.");
                    this.setState({
                        fetching: false,
                    })
                }
                else {
                    const course = data.data;
                    this.setState({
                        fetching: false,
                        course: course,
                    })
                }
            }
        );
    };

    render() {
        if (!this.state.fetching) {
            return (
                <div className={"CoursePanel"}>
                    <Typography.Title level={2}>{`${this.state.course.shortname} - ${this.state.course.fullname}`}</Typography.Title>
                    {(!!this.state.course.id) && <div>
                        <CourseQuizzes course={this.state.course} token={this.props.token}/>
                        <Divider dashed/>
                        <Instructor>
                            <CourseQuestionBank course={this.state.course.id} token={this.props.token} url={"/QuestionBank"}/>
                            <Divider dashed/>
                        </Instructor>
                        <CoursePeople course={this.state.course.id} groups={this.state.course.groups} token={this.props.token} fetch={this.fetch}/>
                    </div>}
                </div>
            )
        }
        else {
            return (
                <></>
            )
        }
    }
}

export default withRouter(Course);