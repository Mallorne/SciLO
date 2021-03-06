import React from "react"
import GetCourseById from "../../networks/GetCourseById";
import {message, Tag} from "antd";
import RandomColorBySeed from "../../utils/RandomColorBySeed";

export default class CourseTags extends React.Component {

    componentDidMount() {
        this.fetch()
    }

    fetch = () => {
        this.setState({ fetching: true });
        GetCourseById(this.props.course, this.props.token).then(
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
        if (this.state.course) {
            return (
                <Tag style={{float: "right"}} color={RandomColorBySeed(this.state.course.id).bg}>
                    <span style={{color: RandomColorBySeed(this.state.course.id).fg}}>{this.state.course.shortname}</span>
                </Tag>
            )
        }
        else {return <></>}
    }
}