import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

import {
    Form,
    Input,
    Button,
    PageHeader,
    Badge,
    Divider,
    List,
    Typography,
} from "antd";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";

import ListItem from "../components/ListItem";
import Container from "../components/Container";
import { isLogged, postOrder, getEmail } from "../util";

const { Title } = Typography;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
};

const validateMessages = {
    required: "${label} is required!",
};

const Cart = ({ pizzas }) => {
    const [order, setOrder] = useState([]);
    const [total, setTotal] = useState(0);
    const [status, setStatus] = useState(0);

    useEffect(() => getOrder(), [pizzas]);

    const getOrder = () => {
        axios
            .get("/api/pizzas")
            .then((res) => res.data)
            .then((menu) => {
                let tempArray = [];
                let tempTotal = Object.keys(pizzas).reduce((acc, pizzaId) => {
                    tempArray.push({
                        ...menu[pizzaId - 1],
                        amount: pizzas[pizzaId],
                    });
                    acc += pizzas[pizzaId] * menu[pizzaId - 1].cost;
                    return acc;
                }, 0);
                setOrder(tempArray);
                setTotal(tempTotal);
            });
    };

    const count = Object.values(pizzas).reduce((a, b) => a + b, 0);
    const onFinish = ({ addressFirstLine, addressSecondLine, phone }) => {
        let data = {
            email: isLogged() ? getEmail() : "",
            pizzas,
            address: addressFirstLine + "\n" + addressSecondLine,
            phone,
        };
        postOrder(data).then((res) => setStatus(res.id));
    };

    // let currentOrder = [];
    // for (let pizzaId of Object.keys(pizzas)) {
    //     let id = pizzaId - 1;
    //     currentOrder.push({ ...menu[id], amount: pizzas[pizzaId] });
    // }
    return (
        <>
            <PageHeader
                title="Your cart"
                extra={[
                    <Link to={isLogged() ? "./profile" : "./user"}>
                        <Button
                            key="account"
                            icon={<UserOutlined />}
                            size="large"
                        />
                    </Link>,
                    <Button
                        key="cart"
                        icon={
                            <Badge count={count}>
                                <ShoppingCartOutlined />
                            </Badge>
                        }
                        size="large"
                    />,
                ]}
                onBack={() => window.history.back()}
            />
            <Container>
                <Divider>Your order</Divider>
                {order.length === 0 ? (
                    <Title level={3} style={{ textAlign: "center" }}>
                        You need to add something to the cart first!
                    </Title>
                ) : (
                    <>
                        <List
                            itemLayout="horizontal"
                            dataSource={order}
                            renderItem={(p) => (
                                <ListItem key={p.id} pizza={p} />
                            )}
                        />
                        <Divider />
                        <Title level={4} style={{ textAlign: "right" }}>
                            Total: ${total} (€{Math.floor(total * 0.8)})
                        </Title>
                        <Title level={4} style={{ textAlign: "right" }}>
                            Delivery cost: $5 (€4)
                        </Title>
                        <Title level={4} style={{ textAlign: "right" }}>
                            To be payed: ${total + 5} (€
                            {Math.floor((total + 5) * 0.8)})
                        </Title>
                        <Divider>Shipment details</Divider>
                        {status > 0 ? (
                            <>
                                <Title
                                    level={3}
                                    style={{ textAlign: "center" }}
                                >
                                    Your order is placed, order number is{" "}
                                    {status}!
                                </Title>
                                <br />
                                <Title
                                    level={4}
                                    style={{ textAlign: "center" }}
                                >
                                    If you want to be able to access order
                                    history, register!
                                </Title>
                            </>
                        ) : (
                            <Form
                                {...layout}
                                onFinish={onFinish}
                                validateMessages={validateMessages}
                            >
                                <Form.Item name="name" label="Name">
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="phone"
                                    label="Phone number"
                                    required
                                    help='Enter the number without "+7"'
                                >
                                    <Input type="number" prefix="+7" />
                                </Form.Item>
                                <Form.Item
                                    name="addressFirstLine"
                                    label="The first line of address"
                                    required
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="addressSecondLine"
                                    label="The second line of address"
                                    required
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
                                    <Button htmlType="submit">Order!</Button>
                                </Form.Item>
                            </Form>
                        )}
                    </>
                )}
            </Container>
            {/* <Divider>Shipment details</Divider>
            <Form
                {...layout}
                name="nest-messages"
                onFinish={onFinish}
                validateMessages={validateMessages}
            >
                <Form.Item
                    name={["user", "name"]}
                    label="Name"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name={["user", "email"]}
                    label="Email"
                    rules={[{ type: "email" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name={["user", "age"]}
                    label="Age"
                    rules={[{ type: "number", min: 0, max: 99 }]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item name={["user", "website"]} label="Website">
                    <Input />
                </Form.Item>
                <Form.Item name={["user", "introduction"]} label="Introduction">
                    <Input.TextArea />
                </Form.Item>
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form> */}
        </>
    );
};

const mapStateToProps = (state) => ({ pizzas: state.cart });

export default connect(mapStateToProps)(Cart);
