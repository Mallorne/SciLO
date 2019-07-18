import React from 'react';
import { Tabs, Radio } from 'antd';
import UserIcon from "./UserIcon";

const { TabPane } = Tabs;

export default class SlidingTabsDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 'top',
        };
    }

    render() {
        const { mode } = this.state;
        return (
            <div>
                <Tabs defaultActiveKey="1" tabPosition="left" style={{ height: "70vh" }} hideAdd>
                    {[...Array(30).keys()].map(i => (
                        <TabPane tab={<UserIcon/>} key={i}>
                            Content of tab {i}
                        </TabPane>
                    ))}
                </Tabs>
            </div>
        );
    }
}