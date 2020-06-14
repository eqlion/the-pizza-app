import * as React from "react";
import { connect } from "react-redux";
import { Card, Typography, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { addToCart } from "../actions";

const { Meta } = Card;
const { Title } = Typography;

let Card_ = ({ pizza, addToCart }) => {
    const { id, name, desc, image, cost } = pizza;

    const onClick = () => {
        addToCart(id);
        message.success(`${name} added to the cart!`);
    };

    return (
        <Card
            title={
                <Title level={4} style={{ textAlign: "center" }}>
                    {name}
                </Title>
            }
            actions={[
                <Title level={4}>${cost}</Title>,
                <Button
                    icon={<PlusOutlined />}
                    type="text"
                    onClick={onClick}
                />,
                <Title level={4}>€{Math.floor(cost * 0.8)}</Title>,
            ]}
            cover={<img alt={name} src={image} />}
        >
            <Meta
                // title={<Title level={4}>{name}</Title>}
                description={desc}
            />
        </Card>
    );
};

let mapDispatchToProps = { addToCart };

export default connect(null, mapDispatchToProps)(Card_);
