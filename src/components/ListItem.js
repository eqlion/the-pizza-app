import * as React from "react";
import { List, Avatar, Button, Typography } from "antd";
import { PlusOutlined, MinusOutlined, DeleteOutlined } from "@ant-design/icons";
import { connect } from "react-redux";

import { addToCart, removeFromCart, removeAllFromCart } from "../actions";

const { Item } = List;
const { Title } = Typography;

const ItemCard = ({ pizza, addToCart, removeFromCart, removeAllFromCart }) => {
    const { id, name, desc, cost, image, amount } = pizza;
    return (
        <Item
            actions={[
                <Button
                    icon={<MinusOutlined />}
                    onClick={() => removeFromCart(id)}
                />,
                <Title level={4}>{amount}</Title>,
                <Button
                    icon={<PlusOutlined />}
                    onClick={() => addToCart(id)}
                />,
                <Title level={4}>
                    ${amount * cost} (€{Math.floor(amount * cost * 0.8)})
                </Title>,
                <Button
                    icon={<DeleteOutlined />}
                    onClick={() => removeAllFromCart(id)}
                />,
            ]}
        >
            <Item.Meta
                avatar={<Avatar size={64} src={image} />}
                title={
                    <Title level={4}>
                        {name} — ${cost} (€{Math.floor(cost * 0.8)})
                    </Title>
                }
                description={desc}
            />
        </Item>
    );
};

const mapDispatchToProps = {
    addToCart,
    removeFromCart,
    removeAllFromCart,
};

export default connect(null, mapDispatchToProps)(ItemCard);
