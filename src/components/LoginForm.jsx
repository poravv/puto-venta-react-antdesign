
import { useState } from 'react';
import '../CSS/LoginForm.css'
import LoginServices from '../services/Login'
import '../CSS/Cuerpo.css'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Layout, Typography, message } from 'antd';

//const { Text } = Typography;
const { Content } = Layout;

function LoginForm() {
    //poravv-andres
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);

    const handleLoginSubmit = async () => {
        //event.preventDefault();
        //console.log('Presionado el submit');
        try {
            const usuarioRes = await LoginServices({
                nick: username,
                password: password
            });
            setUser(usuarioRes);
            setUserName('');
            setPassword('');
            console.log(user);
            window.localStorage.setItem(
                'loggedSiswebUser', JSON.stringify(usuarioRes)
            );
            // eslint-disable-next-line
            window.location.href = window.location.href;
            //navigate('/');

        } catch (e) {
            //console.log(e);
            message.warning('Error de usuario o contraseña');
        }
    }

    return (

        <>
            <div style={{
                height: `700px`,
                justifyItems: `center`,
                justifyContent: `center`,
                alignItems: `center`,
                display: `flex`
            }}>
                <Content style={{
                    margin: '0 16px',
                    //background:`green`,
                    display: `flex`,
                    alignItems: `center`,
                    textAlign: `center`,
                    justifyContent: `center`,
                }}
                >
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        style={{
                            width: `400px`,
                            //height: `600px`
                        }}
                        onFinish={handleLoginSubmit}
                    >
                        <Typography.Title
                            //editable
                            level={2}
                            style={{
                                marginTop: `30px`,
                            }}
                        >
                            Login
                        </Typography.Title>

                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Please input your Username!', },]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" onChange={({ target }) => setUserName(target.value)} />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your Password!', },]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
                                onChange={({ target }) => setPassword(target.value)}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>

                </Content>
            </div>
        </>
    );
}

export default LoginForm;