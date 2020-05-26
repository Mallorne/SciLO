import React from 'react';

import AceEditor from "react-ace";

// import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/ext-language_tools"
import {Radio} from "antd";


export class CodeEditor extends React.Component {

    static getDerivedStateFromProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            return {
                ...(nextProps.value || {}),
            };
        }
        return null;
    }

    state = {
        value: this.props.value || "",
    };


    handleChange = value => {
        if (!('value' in this.props)) {
            this.setState(value);
        }
        this.triggerChange(value);
    };

    triggerChange = value => {
        // Should provide an event to pass value to Form.
        const { onChange } = this.props;
        if (onChange) {
            onChange(value);
        }
    };

    render() {
        return (
            <div>
                <AceEditor
                    mode="python"
                    theme="textmate"
                    name="script-editor"
                    width="100%"
                    style={{
                        minHeight: 32,
                        height: "auto",
                        border: 'solid 1px #ddd',
                        borderRadius: "4px",
                        overflow: "auto",
                        resize: "vertical"
                    }}
                    maxLines={Infinity}
                    onChange={this.handleChange}
                    fontSize={14}
                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    value={this.props.value || this.state.value}
                    editorProps={{$blockScrolling: true}}
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: true,
                        showLineNumbers: true,
                        tabSize: 4,
                        useWorker: false
                    }}
                />
            </div>
        );
    }
}