import React, { useState } from "react";
import { PageHeader, Form, Input, Button } from "antd";

import Container from "../components/Container";
import { login } from "../util";
import { Redirect } from "react-router-dom";

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
};

export default () => {
    const [status, setStatus] = useState("");

    const onFinish = (values) => {
        setStatus("validating");
        login(values).then((res) => {
            if (res.ok) {
                setStatus("success");
            } else {
                setStatus("error");
            }
        });
        // .then((res) => console.log(res));
    };
    return (
        <>
            {status === "success" && <Redirect to="./profile" />}
            <PageHeader title="Sign in" onBack={() => window.history.back()} />
            <Container>
                <Form {...layout} onFinish={onFinish}>
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
                    <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
                        <Button htmlType="submit">Log in</Button>
                    </Form.Item>
                </Form>
            </Container>
        </>
    );
};
