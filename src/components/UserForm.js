import React, { useState } from "react";
import { Form, Input, Button, Typography } from "antd";

import { login, signup } from "../util";
import { Redirect } from "react-router-dom";

const { Text } = Typography;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
};

export default ({ type }) => {
    const [status, setStatus] = useState("");

    const onLogin = (values) => {
        setStatus("validating");
        login(values).then((res) => {
            if (res.ok) {
                setStatus("success");
            } else {
                setStatus("error");
            }
        });
    };

    const onSignup = (values) => {
        setStatus("validating");
        signup(values).then((res) => {
            if (res.ok) {
                setStatus("success");
            } else {
                setStatus("error");
            }
        });
    };
    return (
        <>
            {status === "success" && <Redirect to="./profile" />}
            <Form {...layout} onFinish={type === "login" ? onLogin : onSignup}>
                <Form.Item
                    name="email"
                    required
                    label="E-mail"
                    hasFeedback
                    validateStatus={status}
                >
                    <Input type="email" />
                </Form.Item>
                <Form.Item
                    name="password"
                    required
                    label="Password"
                    hasFeedback
                    validateStatus={status}
                >
                    <Input.Password />
                </Form.Item>
                {type === "signup" && (
                    <Form.Item
                        name="confirm"
                        rules={[
                            {
                                required: true,
                                message: "Please confirm your password!",
                            },
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    if (
                                        !value ||
                                        getFieldValue("password") === value
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        "The two passwords that you entered do not match!"
                                    );
                                },
                            }),
                        ]}
                        label="Confirm password"
                        dependencies={["password"]}
                    >
                        <Input.Password />
                    </Form.Item>
                )}
                {status === "error" && (
                    <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
                        <Text type="danger">
                            Check the credentials, account is not found :(
                        </Text>
                    </Form.Item>
                )}
                <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
                    <Button htmlType="submit">
                        {type === "signup" ? "Sign up" : "Log in"}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};
