import { Transfer } from 'antd';
import React from "react";

export class PermTransfer extends React.Component {
    state = {
        mockData: [],
        targetKeys: [],
    };

    componentDidMount() {
        this.getMock();
    }

    getMock = () => {
        const targetKeys = [];
        const mockData = [];
        for (let i = 0; i < 20; i++) {
            const data = {
                key: i.toString(),
                title: `Permission${i + 1}`,
                description: `description of Permission${i + 1}`,
                chosen: Math.random() * 2 > 1,
            };
            if (data.chosen) {
                targetKeys.push(data.key);
            }
            mockData.push(data);
        }
        this.setState({ mockData, targetKeys });
    };

    filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

    handleChange = targetKeys => {
        this.setState({ targetKeys });
    };

    handleSearch = (dir, value) => {
        console.log('search:', dir, value);
    };

    render() {
        return (
            <Transfer
                dataSource={this.state.mockData}
                showSearch
                listStyle={{
                    width: "45%",
                    height: 300,
                }}
                filterOption={this.filterOption}
                targetKeys={this.state.targetKeys}
                onChange={this.handleChange}
                onSearch={this.handleSearch}
                render={item => item.title}
            />
        );
    }
}